"""
Database migration script to decouple local credentials and transition
to WytNet Centralized Authentication with 'sub' as primary key.
"""
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=env_path, override=True)

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'calculator.db')}")

# Fix sqlite relative path
if DATABASE_URL == "sqlite:///./calculator.db":
    DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'calculator.db').replace('\\', '/')}"

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})

def migrate():
    print(f"Starting WytNet identity migration on {DATABASE_URL}...")
    is_sqlite = "sqlite" in DATABASE_URL
    
    with engine.connect() as conn:
        try:
            if is_sqlite:
                # In SQLite, drop old tables/backups and ensure the modern schema
                conn.execute(text("DROP TABLE IF EXISTS users_backup;"))
                
                table_check = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='users';")).fetchone()
                if table_check:
                    conn.execute(text("ALTER TABLE users RENAME TO users_backup;"))
                
                # Create modern users table with sub as primary key
                conn.execute(text("""
                    CREATE TABLE users (
                        sub VARCHAR PRIMARY KEY,
                        email VARCHAR UNIQUE NOT NULL,
                        name VARCHAR,
                        username VARCHAR,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                """))
                conn.execute(text("CREATE INDEX IF NOT EXISTS ix_users_sub ON users (sub);"))
                conn.execute(text("CREATE INDEX IF NOT EXISTS ix_users_email ON users (email);"))
                
                # Migrate any existing records if users_backup existed
                if table_check:
                    try:
                        conn.execute(text("""
                            INSERT INTO users (sub, email, name, username)
                            SELECT 
                                COALESCE(wytpass_id, 'wn_usr_' || lower(hex(randomblob(16)))),
                                email,
                                username,
                                username
                            FROM users_backup;
                        """))
                    except Exception as e:
                        print(f"Notice during migration of existing rows: {e}")
                    
                    conn.execute(text("DROP TABLE IF EXISTS users_backup;"))
                
                conn.commit()
                print("SQLite users table migrated successfully: 'sub' (wn_usr_...) is now primary key. Local passwords removed.")

            else:
                # PostgreSQL migration
                conn.execute(text("""
                    DO $$ 
                    BEGIN 
                        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='sub') THEN
                            ALTER TABLE users ADD COLUMN sub VARCHAR;
                        END IF;
                        
                        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='hashed_password') THEN
                            ALTER TABLE users DROP COLUMN hashed_password;
                        END IF;

                        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='wytpass_id') THEN
                            UPDATE users SET sub = wytpass_id WHERE sub IS NULL AND wytpass_id IS NOT NULL;
                            ALTER TABLE users DROP COLUMN wytpass_id;
                        END IF;

                        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_sso_user') THEN
                            ALTER TABLE users DROP COLUMN is_sso_user;
                        END IF;
                    END $$;
                """))
                conn.commit()
                print("PostgreSQL users table migrated successfully.")

            print("WytNet database migration completed successfully!")

        except Exception as ex:
            print(f"Migration error: {ex}")
            raise

if __name__ == "__main__":
    migrate()
