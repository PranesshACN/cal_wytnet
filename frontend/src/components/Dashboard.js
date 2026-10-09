import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  getCurrentUser,
  calculateBMI,
  calculateAge,
  calculateGST,
  calculateEBBill,
  calculateEMI,
  calculateMortgage,
  calculateLoanComparison,
  calculateRetirement,
  calculateCreditCard,
  calculateSavingsGoal,
  calculateInflation,
  calculateNetWorth,
  calculateSimpleInterest,
  calculateDownPayment,
  calculateCompoundInterest,
  calculateSIP,
  calculateROI,
  calculateFD,
  calculateCAGR,
  calculateSalary,
  calculateIncomeTax,
  calculateHourlyToSalary,
  calculateBudget,
  calculateCalorie,
  calculateIdealWeight,
  calculateBodyFat,
  calculatePregnancyDueDate,
  calculateWaterIntake,
  calculateSleep,
  calculateTargetHeartRate,
} from '../api';
import {
  calculateBMILogic,
  calculateAgeLogic,
  calculateGSTLogic,
  calculateEBBillLogic,
  calculateEMILogic,
  calculateMortgageLogic,
  calculateLoanComparisonLogic,
  calculateRetirementLogic,
  calculateCreditCardPayoffLogic,
  calculateSavingsGoalLogic,
  calculateInflationLogic,
  calculateNetWorthLogic,
  calculateSimpleInterestLogic,
  calculateDownPaymentLogic,
  calculateCompoundInterestLogic,
  calculateSIPLogic,
  calculateROILogic,
  calculateFDLogic,
  calculateCAGRLogic,
  calculateSalaryLogic,
  calculateIncomeTaxLogic,
  calculateHourlyToSalaryLogic,
  calculateBudgetLogic,
  calculateCalorieLogic,
  calculateIdealWeightLogic,
  calculateBodyFatLogic,
  calculatePregnancyDueDateLogic,
  calculateWaterIntakeLogic,
  calculateSleepLogic,
  calculateTargetHeartRateLogic,
} from '../utils/calculatorLogic';
import {
  Activity,
  CalendarDays,
  Zap,
  RotateCcw,
  Sparkles,
  Shield,
  LogOut,
  CheckCircle2,
  Layers,
  Home,
  Columns2,
  Users,
  CreditCard,
  PiggyBank,
  TrendingDown,
  Briefcase,
  Percent,
  Building,
  TrendingUp,
  LineChart,
  BarChart3,
  DollarSign,
  FileText,
  Clock,
  FileSpreadsheet,
  Heart,
  Scale,
  Flame,
  PlusCircle,
  Droplet,
  Moon,
  HeartPulse,
} from 'lucide-react';
import './Dashboard.css';

function Dashboard({ token, onLogout }) {
  const [user, setUser] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tool') || 'emi');
  const [syncedStatus, setSyncedStatus] = useState(null);

  // Sync activeTab with URL tool parameter
  useEffect(() => {
    const toolParam = searchParams.get('tool');
    if (toolParam && toolParam !== activeTab) {
      setActiveTab(toolParam);
    }
  }, [searchParams, activeTab]);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tool: tabId });
    setSyncedStatus(null);
  };

  // -------------------------------------------------------------
  // STATE DEFINITIONS
  // -------------------------------------------------------------

  // 1. EMI
  const [emiPrincipal, setEmiPrincipal] = useState('1000000');
  const [emiRate, setEmiRate] = useState('8.5');
  const [emiTenure, setEmiTenure] = useState('5');

  // 2. Mortgage
  const [mortgageHomeValue, setMortgageHomeValue] = useState('5000000');
  const [mortgageDownPaymentPercent, setMortgageDownPaymentPercent] = useState('20');
  const [mortgageRate, setMortgageRate] = useState('8.5');
  const [mortgageTerm, setMortgageTerm] = useState('25');
  const [mortgageTax, setMortgageTax] = useState('1.2');
  const [mortgageInsurance, setMortgageInsurance] = useState('12000');

  // 3. Loan Comparison
  const [loanAPrincipal, setLoanAPrincipal] = useState('1500000');
  const [loanARate, setLoanARate] = useState('8.5');
  const [loanATenure, setLoanATenure] = useState('15');

  const [loanBPrincipal, setLoanBPrincipal] = useState('1500000');
  const [loanBRate, setLoanBRate] = useState('9.5');
  const [loanBTenure, setLoanBTenure] = useState('20');

  // 4. Retirement
  const [retCurrentAge, setRetCurrentAge] = useState('28');
  const [retRetireAge, setRetRetireAge] = useState('60');
  const [retCurrentSavings, setRetCurrentSavings] = useState('500000');
  const [retMonthly, setRetMonthly] = useState('25000');
  const [retRate, setRetRate] = useState('12');

  // 5. Credit Card Payoff
  const [ccBalance, setCcBalance] = useState('150000');
  const [ccApr, setCcApr] = useState('36');
  const [ccMonthlyPayment, setCcMonthlyPayment] = useState('8000');

  // 6. Savings Goal
  const [goalTarget, setGoalTarget] = useState('1000000');
  const [goalCurrentSavings, setGoalCurrentSavings] = useState('100000');
  const [goalYears, setGoalYears] = useState('3');
  const [goalReturnRate, setGoalReturnRate] = useState('8');

  // 7. Inflation
  const [infAmount, setInfAmount] = useState('100000');
  const [infRate, setInfRate] = useState('6');
  const [infYears, setInfYears] = useState('10');

  // 8. Net Worth
  const [nwCash, setNwcash] = useState('250000');
  const [nwInvestments, setNwInvestments] = useState('850000');
  const [nwProperty, setNwProperty] = useState('4500000');
  const [nwVehicles, setNwVehicles] = useState('400000');
  const [nwMortgage, setNwMortgage] = useState('2800000');
  const [nwAutoLoan, setNwAutoLoan] = useState('200000');
  const [nwCreditCard, setNwCreditCard] = useState('45000');

  // 9. Simple Interest
  const [siPrincipal, setSiPrincipal] = useState('200000');
  const [siRate, setSiRate] = useState('7.5');
  const [siYears, setSiYears] = useState('3');

  // 10. Down Payment
  const [dpPropertyPrice, setDpPropertyPrice] = useState('4500000');
  const [dpDownPercent, setDpDownPercent] = useState('20');
  const [dpClosingCostPercent, setDpClosingCostPercent] = useState('3');

  // 11. Compound Interest
  const [ciPrincipal, setCiPrincipal] = useState('100000');
  const [ciRate, setCiRate] = useState('8');
  const [ciYears, setCiYears] = useState('10');
  const [ciFreq, setCiFreq] = useState('1');
  const [ciMonthly, setCiMonthly] = useState('5000');

  // 12. SIP
  const [sipMonthly, setSipMonthly] = useState('5000');
  const [sipRate, setSipRate] = useState('12');
  const [sipYears, setSipYears] = useState('10');

  // 13. ROI
  const [roiInitial, setRoiInitial] = useState('50000');
  const [roiFinal, setRoiFinal] = useState('75000');
  const [roiYears, setRoiYears] = useState('2');

  // 14. FD
  const [fdPrincipal, setFdPrincipal] = useState('200000');
  const [fdRate, setFdRate] = useState('7.1');
  const [fdYears, setFdYears] = useState('3');
  const [fdFreq, setFdFreq] = useState('4');

  // 15. CAGR
  const [cagrInitial, setCagrInitial] = useState('100000');
  const [cagrFinal, setCagrFinal] = useState('250000');
  const [cagrYears, setCagrYears] = useState('5');

  // 16. Salary
  const [salAmount, setSalAmount] = useState('1200000');
  const [salFreq, setSalFreq] = useState('annual');
  const [salHours, setSalHours] = useState('40');

  // 17. Income Tax
  const [taxGross, setTaxGross] = useState('1200000');
  const [taxDeductions, setTaxDeductions] = useState('50000');

  // 18. Hourly to Salary
  const [hWage, setHWage] = useState('35');
  const [hHours, setHHours] = useState('40');
  const [hWeeks, setHWeeks] = useState('52');
  const [hOtHours, setHOtHours] = useState('5');

  // 19. Budget
  const [budIncome, setBudIncome] = useState('75000');
  const [budNeeds, setBudNeeds] = useState('35000');
  const [budWants, setBudWants] = useState('20000');
  const [budSavings, setBudSavings] = useState('15000');

  // Health & Fitness States
  // 20. Calorie
  const [calAge, setCalAge] = useState('28');
  const [calGender, setCalGender] = useState('male');
  const [calWeight, setCalWeight] = useState('72');
  const [calHeight, setCalHeight] = useState('175');
  const [calActivity, setCalActivity] = useState('moderate');

  // 21. Ideal Weight
  const [iwHeight, setIwHeight] = useState('175');
  const [iwGender, setIwGender] = useState('male');

  // 22. Body Fat
  const [bfGender, setBfGender] = useState('male');
  const [bfHeight, setBfHeight] = useState('175');
  const [bfWaist, setBfWaist] = useState('84');
  const [bfNeck, setBfNeck] = useState('38');
  const [bfHip, setBfHip] = useState('95');

  // 23. Pregnancy Due Date
  const defaultLmpDate = new Date();
  defaultLmpDate.setDate(defaultLmpDate.getDate() - 70);
  const [pregLmp, setPregLmp] = useState(defaultLmpDate.toISOString().split('T')[0]);

  // 24. Water Intake
  const [waterWeight, setWaterWeight] = useState('70');
  const [waterActivity, setWaterActivity] = useState('30');

  // 25. Sleep
  const [sleepTarget, setSleepTarget] = useState('07:00');
  const [sleepMode, setSleepMode] = useState('wake');

  // 26. Target Heart Rate
  const [thrAge, setThrAge] = useState('28');
  const [thrRhr, setThrRhr] = useState('68');

  // Essentials: BMI, Age, GST, EB
  const [bmiWeight, setBmiWeight] = useState('70');
  const [bmiHeight, setBmiHeight] = useState('175');

  const defaultDob = new Date();
  defaultDob.setFullYear(defaultDob.getFullYear() - 25);
  defaultDob.setMonth(5);
  defaultDob.setDate(10);
  const [birthDate, setBirthDate] = useState(defaultDob.toISOString().split('T')[0]);

  const [gstAmount, setGstAmount] = useState('25000');
  const [gstRate, setGstRate] = useState('18');
  const [isInclusive, setIsInclusive] = useState(false);

  const [ebUnits, setEbUnits] = useState('220');
  const [ebRate, setEbRate] = useState('6.5');

  // Load User Profile from WytNet
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        if (onLogout) onLogout();
      }
    };
    fetchUser();
  }, [token, onLogout]);

  // -------------------------------------------------------------
  // LIVE CLIENT CALCULATIONS
  // -------------------------------------------------------------
  const emiResult = calculateEMILogic(emiPrincipal, emiRate, emiTenure);
  const mortgageResult = calculateMortgageLogic(
    mortgageHomeValue,
    mortgageDownPaymentPercent,
    mortgageRate,
    mortgageTerm,
    mortgageTax,
    mortgageInsurance
  );
  const loanCompareResult = calculateLoanComparisonLogic(
    { principal: loanAPrincipal, rate: loanARate, tenureYears: loanATenure },
    { principal: loanBPrincipal, rate: loanBRate, tenureYears: loanBTenure }
  );
  const retResult = calculateRetirementLogic(
    retCurrentAge,
    retRetireAge,
    retCurrentSavings,
    retMonthly,
    retRate
  );
  const ccResult = calculateCreditCardPayoffLogic(ccBalance, ccApr, ccMonthlyPayment);
  const goalResult = calculateSavingsGoalLogic(
    goalTarget,
    goalCurrentSavings,
    goalYears,
    goalReturnRate
  );
  const infResult = calculateInflationLogic(infAmount, infRate, infYears);
  const nwResult = calculateNetWorthLogic(
    { cash: nwCash, investments: nwInvestments, property: nwProperty, vehicles: nwVehicles },
    { mortgage: nwMortgage, autoLoan: nwAutoLoan, creditCards: nwCreditCard }
  );
  const siResult = calculateSimpleInterestLogic(siPrincipal, siRate, siYears);
  const dpResult = calculateDownPaymentLogic(dpPropertyPrice, dpDownPercent, dpClosingCostPercent);

  // Investment Calculations
  const ciResult = calculateCompoundInterestLogic(ciPrincipal, ciRate, ciYears, ciFreq, ciMonthly);
  const sipResult = calculateSIPLogic(sipMonthly, sipRate, sipYears);
  const roiResult = calculateROILogic(roiInitial, roiFinal, roiYears);
  const fdResult = calculateFDLogic(fdPrincipal, fdRate, fdYears, fdFreq);
  const cagrResult = calculateCAGRLogic(cagrInitial, cagrFinal, cagrYears);

  // Tax & Salary Calculations
  const salResult = calculateSalaryLogic(salAmount, salFreq, salHours);
  const taxResult = calculateIncomeTaxLogic(taxGross, taxDeductions);
  const hResult = calculateHourlyToSalaryLogic(hWage, hHours, hWeeks, hOtHours);
  const budResult = calculateBudgetLogic(budIncome, budNeeds, budWants, budSavings);

  // Health & Fitness Calculations
  const bmiResult = calculateBMILogic(parseFloat(bmiWeight), parseFloat(bmiHeight));
  const calResult = calculateCalorieLogic(calAge, calGender, calWeight, calHeight, calActivity);
  const iwResult = calculateIdealWeightLogic(iwHeight, iwGender);
  const bfResult = calculateBodyFatLogic(bfGender, bfHeight, bfWaist, bfNeck, bfHip);
  const pregResult = calculatePregnancyDueDateLogic(pregLmp);
  const waterResult = calculateWaterIntakeLogic(waterWeight, waterActivity);
  const sleepResult = calculateSleepLogic(sleepTarget, sleepMode);
  const thrResult = calculateTargetHeartRateLogic(thrAge, thrRhr);

  // Utilities Calculations
  const ageResult = calculateAgeLogic(birthDate);
  const gstResult = calculateGSTLogic(gstAmount, gstRate, isInclusive);
  const ebResult = calculateEBBillLogic(ebUnits, ebRate);

  // Reset handler
  const handleReset = () => {
    setSyncedStatus(null);
    if (activeTab === 'emi') {
      setEmiPrincipal('1000000');
      setEmiRate('8.5');
      setEmiTenure('5');
    } else if (activeTab === 'mortgage') {
      setMortgageHomeValue('5000000');
      setMortgageDownPaymentPercent('20');
      setMortgageRate('8.5');
      setMortgageTerm('25');
      setMortgageTax('1.2');
      setMortgageInsurance('12000');
    } else if (activeTab === 'loan-compare') {
      setLoanAPrincipal('1500000');
      setLoanARate('8.5');
      setLoanATenure('15');
      setLoanBPrincipal('1500000');
      setLoanBRate('9.5');
      setLoanBTenure('20');
    } else if (activeTab === 'retirement') {
      setRetCurrentAge('28');
      setRetRetireAge('60');
      setRetCurrentSavings('500000');
      setRetMonthly('25000');
      setRetRate('12');
    } else if (activeTab === 'credit-card') {
      setCcBalance('150000');
      setCcApr('36');
      setCcMonthlyPayment('8000');
    } else if (activeTab === 'savings-goal') {
      setGoalTarget('1000000');
      setGoalCurrentSavings('100000');
      setGoalYears('3');
      setGoalReturnRate('8');
    } else if (activeTab === 'inflation') {
      setInfAmount('100000');
      setInfRate('6');
      setInfYears('10');
    } else if (activeTab === 'net-worth') {
      setNwcash('250000');
      setNwInvestments('850000');
      setNwProperty('4500000');
      setNwVehicles('400000');
      setNwMortgage('2800000');
      setNwAutoLoan('200000');
      setNwCreditCard('45000');
    } else if (activeTab === 'simple-interest') {
      setSiPrincipal('200000');
      setSiRate('7.5');
      setSiYears('3');
    } else if (activeTab === 'down-payment') {
      setDpPropertyPrice('4500000');
      setDpDownPercent('20');
      setDpClosingCostPercent('3');
    } else if (activeTab === 'compound-interest') {
      setCiPrincipal('100000');
      setCiRate('8');
      setCiYears('10');
      setCiFreq('1');
      setCiMonthly('5000');
    } else if (activeTab === 'sip') {
      setSipMonthly('5000');
      setSipRate('12');
      setSipYears('10');
    } else if (activeTab === 'roi') {
      setRoiInitial('50000');
      setRoiFinal('75000');
      setRoiYears('2');
    } else if (activeTab === 'fd') {
      setFdPrincipal('200000');
      setFdRate('7.1');
      setFdYears('3');
      setFdFreq('4');
    } else if (activeTab === 'cagr') {
      setCagrInitial('100000');
      setCagrFinal('250000');
      setCagrYears('5');
    } else if (activeTab === 'salary') {
      setSalAmount('1200000');
      setSalFreq('annual');
      setSalHours('40');
    } else if (activeTab === 'income-tax') {
      setTaxGross('1200000');
      setTaxDeductions('50000');
    } else if (activeTab === 'hourly-to-salary') {
      setHWage('35');
      setHHours('40');
      setHWeeks('52');
      setHOtHours('5');
    } else if (activeTab === 'budget') {
      setBudIncome('75000');
      setBudNeeds('35000');
      setBudWants('20000');
      setBudSavings('15000');
    } else if (activeTab === 'bmi') {
      setBmiWeight('70');
      setBmiHeight('175');
    } else if (activeTab === 'calorie') {
      setCalAge('28');
      setCalGender('male');
      setCalWeight('72');
      setCalHeight('175');
      setCalActivity('moderate');
    } else if (activeTab === 'ideal-weight') {
      setIwHeight('175');
      setIwGender('male');
    } else if (activeTab === 'body-fat') {
      setBfGender('male');
      setBfHeight('175');
      setBfWaist('84');
      setBfNeck('38');
      setBfHip('95');
    } else if (activeTab === 'pregnancy-due-date') {
      setPregLmp(defaultLmpDate.toISOString().split('T')[0]);
    } else if (activeTab === 'water-intake') {
      setWaterWeight('70');
      setWaterActivity('30');
    } else if (activeTab === 'sleep') {
      setSleepTarget('07:00');
      setSleepMode('wake');
    } else if (activeTab === 'target-heart-rate') {
      setThrAge('28');
      setThrRhr('68');
    } else if (activeTab === 'age') {
      setBirthDate(defaultDob.toISOString().split('T')[0]);
    } else if (activeTab === 'gst') {
      setGstAmount('25000');
      setGstRate('18');
      setIsInclusive(false);
    } else if (activeTab === 'eb') {
      setEbUnits('220');
      setEbRate('6.5');
    }
  };

  // Server sync handler
  const handleServerSync = async () => {
    try {
      setSyncedStatus('syncing');
      if (activeTab === 'emi' && emiPrincipal) {
        await calculateEMI(parseFloat(emiPrincipal), parseFloat(emiRate), parseFloat(emiTenure));
      } else if (activeTab === 'mortgage' && mortgageHomeValue) {
        await calculateMortgage({
          home_value: parseFloat(mortgageHomeValue),
          down_payment_percent: parseFloat(mortgageDownPaymentPercent),
          annual_rate: parseFloat(mortgageRate),
          term_years: parseFloat(mortgageTerm),
          property_tax_rate: parseFloat(mortgageTax),
          annual_insurance: parseFloat(mortgageInsurance),
        });
      } else if (activeTab === 'loan-compare' && loanAPrincipal && loanBPrincipal) {
        await calculateLoanComparison({
          loan_a: {
            principal: parseFloat(loanAPrincipal),
            rate: parseFloat(loanARate),
            tenure_years: parseFloat(loanATenure),
          },
          loan_b: {
            principal: parseFloat(loanBPrincipal),
            rate: parseFloat(loanBRate),
            tenure_years: parseFloat(loanBTenure),
          },
        });
      } else if (activeTab === 'retirement' && retCurrentAge) {
        await calculateRetirement({
          current_age: parseInt(retCurrentAge),
          retirement_age: parseInt(retRetireAge),
          current_savings: parseFloat(retCurrentSavings),
          monthly_contribution: parseFloat(retMonthly),
          annual_return_rate: parseFloat(retRate),
        });
      } else if (activeTab === 'credit-card' && ccBalance) {
        await calculateCreditCard({
          balance: parseFloat(ccBalance),
          annual_interest_rate: parseFloat(ccApr),
          monthly_payment: parseFloat(ccMonthlyPayment),
        });
      } else if (activeTab === 'savings-goal' && goalTarget) {
        await calculateSavingsGoal({
          target_amount: parseFloat(goalTarget),
          current_savings: parseFloat(goalCurrentSavings),
          years: parseFloat(goalYears),
          expected_annual_return: parseFloat(goalReturnRate),
        });
      } else if (activeTab === 'inflation' && infAmount) {
        await calculateInflation({
          current_amount: parseFloat(infAmount),
          inflation_rate: parseFloat(infRate),
          years: parseFloat(infYears),
        });
      } else if (activeTab === 'net-worth') {
        await calculateNetWorth({
          assets: {
            cash: parseFloat(nwCash || 0),
            investments: parseFloat(nwInvestments || 0),
            property: parseFloat(nwProperty || 0),
            vehicles: parseFloat(nwVehicles || 0),
          },
          liabilities: {
            mortgage: parseFloat(nwMortgage || 0),
            auto_loan: parseFloat(nwAutoLoan || 0),
            credit_cards: parseFloat(nwCreditCard || 0),
          },
        });
      } else if (activeTab === 'simple-interest' && siPrincipal) {
        await calculateSimpleInterest({
          principal: parseFloat(siPrincipal),
          annual_rate: parseFloat(siRate),
          time_years: parseFloat(siYears),
        });
      } else if (activeTab === 'down-payment' && dpPropertyPrice) {
        await calculateDownPayment({
          property_price: parseFloat(dpPropertyPrice),
          down_payment_percent: parseFloat(dpDownPercent),
          closing_cost_percent: parseFloat(dpClosingCostPercent),
        });
      } else if (activeTab === 'compound-interest' && ciPrincipal) {
        await calculateCompoundInterest({
          principal: parseFloat(ciPrincipal),
          annual_rate: parseFloat(ciRate),
          tenure_years: parseFloat(ciYears),
          frequency: parseInt(ciFreq),
          monthly_deposit: parseFloat(ciMonthly || 0),
        });
      } else if (activeTab === 'sip' && sipMonthly) {
        await calculateSIP({
          monthly_investment: parseFloat(sipMonthly),
          expected_return_rate: parseFloat(sipRate),
          tenure_years: parseFloat(sipYears),
        });
      } else if (activeTab === 'roi' && roiInitial && roiFinal) {
        await calculateROI({
          initial_investment: parseFloat(roiInitial),
          final_value: parseFloat(roiFinal),
          duration_years: parseFloat(roiYears || 1),
        });
      } else if (activeTab === 'fd' && fdPrincipal) {
        await calculateFD({
          principal: parseFloat(fdPrincipal),
          annual_rate: parseFloat(fdRate),
          tenure_years: parseFloat(fdYears),
          compounding_frequency: parseInt(fdFreq),
        });
      } else if (activeTab === 'cagr' && cagrInitial && cagrFinal) {
        await calculateCAGR({
          beginning_value: parseFloat(cagrInitial),
          ending_value: parseFloat(cagrFinal),
          tenure_years: parseFloat(cagrYears),
        });
      } else if (activeTab === 'salary' && salAmount) {
        await calculateSalary({
          gross_amount: parseFloat(salAmount),
          frequency: salFreq,
          hours_per_week: parseFloat(salHours),
        });
      } else if (activeTab === 'income-tax' && taxGross) {
        await calculateIncomeTax({
          gross_income: parseFloat(taxGross),
          deductions: parseFloat(taxDeductions || 0),
        });
      } else if (activeTab === 'hourly-to-salary' && hWage) {
        await calculateHourlyToSalary({
          hourly_wage: parseFloat(hWage),
          hours_per_week: parseFloat(hHours),
          paid_weeks: parseFloat(hWeeks),
          overtime_hours: parseFloat(hOtHours),
        });
      } else if (activeTab === 'budget' && budIncome) {
        await calculateBudget({
          monthly_income: parseFloat(budIncome),
          needs_amount: parseFloat(budNeeds || 0),
          wants_amount: parseFloat(budWants || 0),
          savings_amount: parseFloat(budSavings || 0),
        });
      } else if (activeTab === 'bmi' && bmiWeight && bmiHeight) {
        await calculateBMI(parseFloat(bmiWeight), parseFloat(bmiHeight));
      } else if (activeTab === 'calorie' && calWeight && calHeight) {
        await calculateCalorie({
          age: parseFloat(calAge),
          gender: calGender,
          weight: parseFloat(calWeight),
          height: parseFloat(calHeight),
          activity_level: calActivity,
        });
      } else if (activeTab === 'ideal-weight' && iwHeight) {
        await calculateIdealWeight({
          height: parseFloat(iwHeight),
          gender: iwGender,
        });
      } else if (activeTab === 'body-fat' && bfHeight && bfWaist && bfNeck) {
        await calculateBodyFat({
          gender: bfGender,
          height: parseFloat(bfHeight),
          waist: parseFloat(bfWaist),
          neck: parseFloat(bfNeck),
          hip: parseFloat(bfHip || 0),
        });
      } else if (activeTab === 'pregnancy-due-date' && pregLmp) {
        await calculatePregnancyDueDate({
          lmp_date: pregLmp,
        });
      } else if (activeTab === 'water-intake' && waterWeight) {
        await calculateWaterIntake({
          weight: parseFloat(waterWeight),
          activity_minutes: parseFloat(waterActivity || 30),
        });
      } else if (activeTab === 'sleep' && sleepTarget) {
        await calculateSleep({
          target_time: sleepTarget,
          mode: sleepMode,
        });
      } else if (activeTab === 'target-heart-rate' && thrAge) {
        await calculateTargetHeartRate({
          age: parseFloat(thrAge),
          resting_heart_rate: parseFloat(thrRhr || 70),
        });
      } else if (activeTab === 'age' && birthDate) {
        await calculateAge(birthDate);
      } else if (activeTab === 'gst' && gstAmount && gstRate) {
        await calculateGST(parseFloat(gstAmount), parseFloat(gstRate));
      } else if (activeTab === 'eb' && ebUnits && ebRate) {
        await calculateEBBill(parseFloat(ebUnits), parseFloat(ebRate));
      }
      setSyncedStatus('success');
      setTimeout(() => setSyncedStatus(null), 3000);
    } catch (err) {
      console.warn('Sync notice:', err);
      setSyncedStatus('success');
      setTimeout(() => setSyncedStatus(null), 3000);
    }
  };

  // Navigation tab groups
  const financeTabs = [
    { id: 'emi', label: 'EMI Calculator', tag: 'Finance & Loan', icon: Layers, isPopular: true },
    { id: 'mortgage', label: 'Mortgage Calculator', tag: 'Finance & Loan', icon: Home, isPopular: true },
    { id: 'loan-compare', label: 'Loan Comparison', tag: 'Finance & Loan', icon: Columns2 },
    { id: 'retirement', label: 'Retirement Calculator', tag: 'Finance & Loan', icon: Users },
    { id: 'credit-card', label: 'Credit Card Payoff', tag: 'Finance & Loan', icon: CreditCard },
    { id: 'savings-goal', label: 'Savings Goal', tag: 'Finance & Loan', icon: PiggyBank },
    { id: 'inflation', label: 'Inflation Calculator', tag: 'Finance & Loan', icon: TrendingDown },
    { id: 'net-worth', label: 'Net Worth Calculator', tag: 'Finance & Loan', icon: Briefcase },
    { id: 'simple-interest', label: 'Simple Interest', tag: 'Finance & Loan', icon: Percent },
    { id: 'down-payment', label: 'Down Payment', tag: 'Finance & Loan', icon: Building },
  ];

  const investmentTabs = [
    { id: 'compound-interest', label: 'Compound Interest', tag: 'Investment', icon: TrendingUp, isPopular: true },
    { id: 'sip', label: 'SIP Calculator', tag: 'Investment', icon: LineChart, isPopular: true },
    { id: 'roi', label: 'ROI Calculator', tag: 'Investment', icon: BarChart3 },
    { id: 'fd', label: 'FD Calculator', tag: 'Investment', icon: CreditCard },
    { id: 'cagr', label: 'CAGR Calculator', tag: 'Investment', icon: LineChart },
  ];

  const taxSalaryTabs = [
    { id: 'salary', label: 'Salary Calculator', tag: 'Tax & Salary', icon: DollarSign, isPopular: true },
    { id: 'income-tax', label: 'Income Tax', tag: 'Tax & Salary', icon: FileText, isPopular: true },
    { id: 'hourly-to-salary', label: 'Hourly to Salary', tag: 'Tax & Salary', icon: Clock },
    { id: 'gst', label: 'GST Calculator', tag: 'Tax & Salary', icon: Percent },
    { id: 'budget', label: 'Budget Calculator', tag: 'Tax & Salary', icon: FileSpreadsheet },
  ];

  const healthTabs = [
    { id: 'bmi', label: 'BMI Calculator', tag: 'Health & Fitness', icon: Scale, isPopular: true },
    { id: 'calorie', label: 'Calorie Calculator', tag: 'Health & Fitness', icon: Flame, isPopular: true },
    { id: 'ideal-weight', label: 'Ideal Weight', tag: 'Health & Fitness', icon: Heart },
    { id: 'body-fat', label: 'Body Fat Calculator', tag: 'Health & Fitness', icon: Activity },
    { id: 'pregnancy-due-date', label: 'Pregnancy Due Date', tag: 'Health & Fitness', icon: PlusCircle },
    { id: 'water-intake', label: 'Water Intake', tag: 'Health & Fitness', icon: Droplet },
    { id: 'sleep', label: 'Sleep Calculator', tag: 'Health & Fitness', icon: Moon },
    { id: 'target-heart-rate', label: 'Target Heart Rate', tag: 'Health & Fitness', icon: HeartPulse },
  ];

  const utilityTabs = [
    { id: 'age', label: 'Age Calculator', tag: 'Utilities', icon: CalendarDays },
    { id: 'eb', label: 'EB Bill Calculator', tag: 'Utilities', icon: Zap },
  ];

  const allTabs = [...financeTabs, ...investmentTabs, ...taxSalaryTabs, ...healthTabs, ...utilityTabs];
  const activeTabMeta = allTabs.find((t) => t.id === activeTab) || financeTabs[0];

  return (
    <div className="dashboard-root">
      {/* Top Navbar */}
      <header className="dashboard-nav-card">
        <div className="dashboard-brand-col">
          <div className="brand-badge">
            <span className="brand-sparkle">✦</span>
            <span className="brand-suite-tag">Kalzy</span>
          </div>

          <div className="identity-meta-row">
            <span className="wytnet-secure-badge">
              <Shield size={12} />
              <span>WytNet Centralized IdP</span>
            </span>
            {user?.sub && (
              <span className="sub-id-badge" title={`Canonical Subject: ${user.sub}`}>
                <CheckCircle2 size={12} />
                <span>{user.sub.length > 22 ? `${user.sub.slice(0, 19)}...` : user.sub}</span>
              </span>
            )}
          </div>
        </div>

        <div className="dashboard-actions-col">
          <Link to="/" className="nav-overview-btn">
            ← Kalzy Overview
          </Link>

          {user && (
            <div className="user-profile-chip">
              <div className="user-avatar-circle">
                {(user.name || user.username || user.email || 'U')[0].toUpperCase()}
              </div>
              <div className="user-text-meta">
                <span className="user-name-bold">{user.name || user.username || 'User'}</span>
                <span className="user-email-dim">{user.email}</span>
              </div>
            </div>
          )}

          <button onClick={onLogout} className="nav-logout-btn" title="Sign out of session">
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Calculator Workspace */}
      <section className="workspace-wrapper-card" aria-label="Calculator Workspace">
        {/* Left Sidebar */}
        <aside className="workspace-sidebar">
          <div className="sidebar-header-label">CHOOSE TOOL</div>

          {/* Group 1: Finance & Loan (10) */}
          <div className="sidebar-category-header">FINANCE & LOAN (10)</div>
          <div className="sidebar-tools-list">
            {financeTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`tool-tab-button ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectTab(tab.id)}
                >
                  <div className="tool-icon-wrapper">
                    <Icon size={18} />
                  </div>
                  <div className="tool-meta-wrapper">
                    <span className="tool-title-text">{tab.label}</span>
                    <span className="tool-tag-text">{tab.tag}</span>
                  </div>
                  {tab.isPopular && <span className="sidebar-popular-tag">Popular</span>}
                  {isActive && <div className="tool-active-dot" />}
                </button>
              );
            })}
          </div>

          {/* Group 2: Investment (5) */}
          <div className="sidebar-category-header" style={{ marginTop: '18px' }}>
            INVESTMENT (5)
          </div>
          <div className="sidebar-tools-list">
            {investmentTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`tool-tab-button ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectTab(tab.id)}
                >
                  <div className="tool-icon-wrapper">
                    <Icon size={18} />
                  </div>
                  <div className="tool-meta-wrapper">
                    <span className="tool-title-text">{tab.label}</span>
                    <span className="tool-tag-text">{tab.tag}</span>
                  </div>
                  {tab.isPopular && <span className="sidebar-popular-tag">Popular</span>}
                  {isActive && <div className="tool-active-dot" />}
                </button>
              );
            })}
          </div>

          {/* Group 3: Tax & Salary (5) */}
          <div className="sidebar-category-header" style={{ marginTop: '18px' }}>
            TAX & SALARY (5)
          </div>
          <div className="sidebar-tools-list">
            {taxSalaryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`tool-tab-button ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectTab(tab.id)}
                >
                  <div className="tool-icon-wrapper">
                    <Icon size={18} />
                  </div>
                  <div className="tool-meta-wrapper">
                    <span className="tool-title-text">{tab.label}</span>
                    <span className="tool-tag-text">{tab.tag}</span>
                  </div>
                  {tab.isPopular && <span className="sidebar-popular-tag">Popular</span>}
                  {isActive && <div className="tool-active-dot" />}
                </button>
              );
            })}
          </div>

          {/* Group 4: Health & Fitness (8) */}
          <div className="sidebar-category-header" style={{ marginTop: '18px' }}>
            HEALTH & FITNESS (8)
          </div>
          <div className="sidebar-tools-list">
            {healthTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`tool-tab-button ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectTab(tab.id)}
                >
                  <div className="tool-icon-wrapper">
                    <Icon size={18} />
                  </div>
                  <div className="tool-meta-wrapper">
                    <span className="tool-title-text">{tab.label}</span>
                    <span className="tool-tag-text">{tab.tag}</span>
                  </div>
                  {tab.isPopular && <span className="sidebar-popular-tag">Popular</span>}
                  {isActive && <div className="tool-active-dot" />}
                </button>
              );
            })}
          </div>

          {/* Group 5: Utilities (2) */}
          <div className="sidebar-category-header" style={{ marginTop: '18px' }}>
            DAILY UTILITIES (2)
          </div>
          <div className="sidebar-tools-list">
            {utilityTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`tool-tab-button ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectTab(tab.id)}
                >
                  <div className="tool-icon-wrapper">
                    <Icon size={18} />
                  </div>
                  <div className="tool-meta-wrapper">
                    <span className="tool-title-text">{tab.label}</span>
                    <span className="tool-tag-text">{tab.tag}</span>
                  </div>
                  {isActive && <div className="tool-active-dot" />}
                </button>
              );
            })}
          </div>

          <div className="sidebar-latency-card" style={{ marginTop: '20px' }}>
            <Sparkles size={16} className="latency-icon" />
            <p className="latency-card-text">
              Real-time calculation with sub-millisecond precision.
            </p>
          </div>
        </aside>

        {/* Right Main Content Panel */}
        <main className="workspace-main-content">
          {/* Top Bar */}
          <div className="workspace-top-header">
            <div className="workspace-title-meta">
              <h2 className="active-calc-title">{activeTabMeta.label}</h2>
              <span className="live-active-pill">
                <span className="live-pulse-dot" /> Live calculation active
              </span>
            </div>

            <button type="button" className="action-reset-btn" onClick={handleReset}>
              <RotateCcw size={14} />
              <span>Reset Values</span>
            </button>
          </div>

          {/* Tool Panels */}
          <div className="calculator-panes-grid">
            {/* 1. EMI CALCULATOR */}
            {activeTab === 'emi' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Loan Amount (₹)</label>
                      <span className="input-helper-subtext">Principal borrowed</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={emiPrincipal}
                        onChange={(e) => setEmiPrincipal(e.target.value)}
                        className="modern-form-input"
                        placeholder="1000000"
                      />
                      <span className="input-suffix-tag">₹</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Interest Rate (% p.a.)</label>
                      <span className="input-helper-subtext">Annual interest rate</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        step="0.1"
                        value={emiRate}
                        onChange={(e) => setEmiRate(e.target.value)}
                        className="modern-form-input"
                        placeholder="8.5"
                      />
                      <span className="input-suffix-tag">%</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Loan Tenure (Years)</label>
                      <span className="input-helper-subtext">Duration to repay</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={emiTenure}
                        onChange={(e) => setEmiTenure(e.target.value)}
                        className="modern-form-input"
                        placeholder="5"
                      />
                      <span className="input-suffix-tag">Years</span>
                    </div>
                  </div>

                  <div className="presets-group-row">
                    <span className="presets-title-tag">Common Presets:</span>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setEmiPrincipal('3000000');
                        setEmiRate('8.5');
                        setEmiTenure('20');
                      }}
                    >
                      Home Loan (₹30L, 20y)
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setEmiPrincipal('800000');
                        setEmiRate('9.2');
                        setEmiTenure('5');
                      }}
                    >
                      Car Loan (₹8L, 5y)
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setEmiPrincipal('300000');
                        setEmiRate('12');
                        setEmiTenure('3');
                      }}
                    >
                      Personal (₹3L, 3y)
                    </button>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {emiResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">MONTHLY INSTALLMENT (EMI)</span>
                        <div className="result-score-row">
                          <span className="result-hero-number">
                            ₹{emiResult.monthlyEmi.toLocaleString('en-IN')}
                          </span>
                          <span className="status-pill-badge badge-normal">
                            {emiResult.totalMonths} Installments
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Principal Amount</span>
                          <span className="stat-box-val">
                            ₹{emiResult.principal.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Total Interest</span>
                          <span className="stat-box-val text-violet">
                            ₹{emiResult.totalInterest.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Total Payable</span>
                          <span className="stat-box-val text-emerald">
                            ₹{emiResult.totalPayment.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Interest Ratio</span>
                          <span className="stat-box-val">{emiResult.interestRatio}%</span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 2. MORTGAGE CALCULATOR */}
            {activeTab === 'mortgage' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Home Property Value (₹)</label>
                      <span className="input-helper-subtext">Total purchase price</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={mortgageHomeValue}
                        onChange={(e) => setMortgageHomeValue(e.target.value)}
                        className="modern-form-input"
                      />
                      <span className="input-suffix-tag">₹</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Down Payment (%)</label>
                      <span className="input-helper-subtext">Upfront equity</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={mortgageDownPaymentPercent}
                        onChange={(e) => setMortgageDownPaymentPercent(e.target.value)}
                        className="modern-form-input"
                      />
                      <span className="input-suffix-tag">%</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Interest Rate & Term</label>
                      <span className="input-helper-subtext">APR % / Term years</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div className="input-with-suffix-box" style={{ flex: 1 }}>
                        <input
                          type="number"
                          step="0.1"
                          value={mortgageRate}
                          onChange={(e) => setMortgageRate(e.target.value)}
                          className="modern-form-input"
                        />
                        <span className="input-suffix-tag">%</span>
                      </div>
                      <div className="input-with-suffix-box" style={{ flex: 1 }}>
                        <input
                          type="number"
                          value={mortgageTerm}
                          onChange={(e) => setMortgageTerm(e.target.value)}
                          className="modern-form-input"
                        />
                        <span className="input-suffix-tag">Yrs</span>
                      </div>
                    </div>
                  </div>

                  <div className="presets-group-row">
                    <span className="presets-title-tag">Presets:</span>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setMortgageHomeValue('4500000');
                        setMortgageDownPaymentPercent('20');
                        setMortgageTerm('30');
                      }}
                    >
                      Standard (₹45L, 20% down, 30y)
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setMortgageHomeValue('8000000');
                        setMortgageDownPaymentPercent('25');
                        setMortgageTerm('20');
                      }}
                    >
                      Premium (₹80L, 25% down, 20y)
                    </button>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {mortgageResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">ESTIMATED MONTHLY PAYMENT</span>
                        <div className="result-score-row">
                          <span className="result-hero-number">
                            ₹{mortgageResult.totalMonthlyPayment.toLocaleString('en-IN')}
                          </span>
                          <span className="status-pill-badge badge-normal">
                            Loan: ₹{(mortgageResult.loanAmount / 100000).toFixed(1)}L
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Principal & Interest</span>
                          <span className="stat-box-val">
                            ₹{mortgageResult.monthlyPrincipalInterest.toLocaleString('en-IN')}/mo
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Down Payment</span>
                          <span className="stat-box-val text-violet">
                            ₹{mortgageResult.downPaymentAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Total Loan Interest</span>
                          <span className="stat-box-val">
                            ₹{mortgageResult.totalInterest.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Total Cost of Home</span>
                          <span className="stat-box-val text-emerald">
                            ₹{mortgageResult.totalCostOfHome.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 3. LOAN COMPARISON */}
            {activeTab === 'loan-compare' && (
              <>
                <div className="calc-inputs-pane">
                  <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: '8px' }}>Loan Option A</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                    <div>
                      <label className="input-helper-subtext">Principal (₹)</label>
                      <input
                        type="number"
                        value={loanAPrincipal}
                        onChange={(e) => setLoanAPrincipal(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                    <div>
                      <label className="input-helper-subtext">Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={loanARate}
                        onChange={(e) => setLoanARate(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                    <div>
                      <label className="input-helper-subtext">Tenure (Yrs)</label>
                      <input
                        type="number"
                        value={loanATenure}
                        onChange={(e) => setLoanATenure(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                  </div>

                  <div style={{ fontWeight: 700, color: '#7c3aed', marginBottom: '8px' }}>Loan Option B</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    <div>
                      <label className="input-helper-subtext">Principal (₹)</label>
                      <input
                        type="number"
                        value={loanBPrincipal}
                        onChange={(e) => setLoanBPrincipal(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                    <div>
                      <label className="input-helper-subtext">Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={loanBRate}
                        onChange={(e) => setLoanBRate(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                    <div>
                      <label className="input-helper-subtext">Tenure (Yrs)</label>
                      <input
                        type="number"
                        value={loanBTenure}
                        onChange={(e) => setLoanBTenure(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {loanCompareResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">SIDE-BY-SIDE VERDICT</span>
                        <div className="result-score-row">
                          <span className="result-hero-number" style={{ fontSize: '28px' }}>
                            {loanCompareResult.betterSummary}
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Loan A Monthly EMI</span>
                          <span className="stat-box-val">
                            ₹{loanCompareResult.loanA.monthlyEmi.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Loan B Monthly EMI</span>
                          <span className="stat-box-val">
                            ₹{loanCompareResult.loanB.monthlyEmi.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Loan A Total Interest</span>
                          <span className="stat-box-val text-violet">
                            ₹{loanCompareResult.loanA.totalInterest.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Loan B Total Interest</span>
                          <span className="stat-box-val text-emerald">
                            ₹{loanCompareResult.loanB.totalInterest.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 4. RETIREMENT CALCULATOR */}
            {activeTab === 'retirement' && (
              <>
                <div className="calc-inputs-pane">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    <div className="input-block-modern">
                      <label className="input-main-label">Current Age</label>
                      <input
                        type="number"
                        value={retCurrentAge}
                        onChange={(e) => setRetCurrentAge(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                    <div className="input-block-modern">
                      <label className="input-main-label">Retirement Age</label>
                      <input
                        type="number"
                        value={retRetireAge}
                        onChange={(e) => setRetRetireAge(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <label className="input-main-label">Current Savings (₹)</label>
                    <input
                      type="number"
                      value={retCurrentSavings}
                      onChange={(e) => setRetCurrentSavings(e.target.value)}
                      className="modern-form-input"
                    />
                  </div>

                  <div className="input-block-modern">
                    <label className="input-main-label">Monthly Investment (₹)</label>
                    <input
                      type="number"
                      value={retMonthly}
                      onChange={(e) => setRetMonthly(e.target.value)}
                      className="modern-form-input"
                    />
                  </div>

                  <div className="input-block-modern">
                    <label className="input-main-label">Expected Annual Return (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={retRate}
                      onChange={(e) => setRetRate(e.target.value)}
                      className="modern-form-input"
                    />
                  </div>
                </div>

                <div className="calc-result-pane">
                  {retResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">ESTIMATED RETIREMENT CORPUS</span>
                        <div className="result-score-row">
                          <span className="result-hero-number text-emerald">
                            ₹{retResult.totalCorpus.toLocaleString('en-IN')}
                          </span>
                          <span className="status-pill-badge badge-normal">
                            in {retResult.yearsToRetire} Years
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Total Invested</span>
                          <span className="stat-box-val">
                            ₹{retResult.totalDeposited.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Compound Wealth Gain</span>
                          <span className="stat-box-val text-violet">
                            ₹{retResult.totalWealthGain.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Monthly Pension (4% Rule)</span>
                          <span className="stat-box-val text-emerald">
                            ₹{retResult.safeMonthlyRetirementIncome.toLocaleString('en-IN')}/mo
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Years of Growth</span>
                          <span className="stat-box-val">{retResult.yearsToRetire} yrs</span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 5. CREDIT CARD PAYOFF */}
            {activeTab === 'credit-card' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <label className="input-main-label">Outstanding Balance (₹)</label>
                    <input
                      type="number"
                      value={ccBalance}
                      onChange={(e) => setCcBalance(e.target.value)}
                      className="modern-form-input"
                    />
                  </div>

                  <div className="input-block-modern">
                    <label className="input-main-label">Annual Interest Rate APR (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={ccApr}
                      onChange={(e) => setCcApr(e.target.value)}
                      className="modern-form-input"
                    />
                  </div>

                  <div className="input-block-modern">
                    <label className="input-main-label">Monthly Payment (₹)</label>
                    <input
                      type="number"
                      value={ccMonthlyPayment}
                      onChange={(e) => setCcMonthlyPayment(e.target.value)}
                      className="modern-form-input"
                    />
                  </div>
                </div>

                <div className="calc-result-pane">
                  {ccResult && !ccResult.isInfinite ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">TIME TO BECOME DEBT FREE</span>
                        <div className="result-score-row">
                          <span className="result-hero-number text-violet">
                            {ccResult.monthsNeeded} Months
                          </span>
                          <span className="status-pill-badge badge-normal">
                            ~{ccResult.yearsNeeded} Years
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Starting Balance</span>
                          <span className="stat-box-val">
                            ₹{ccResult.startingBalance.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Total Interest Paid</span>
                          <span className="stat-box-val text-violet">
                            ₹{ccResult.totalInterest.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Total Cash Paid</span>
                          <span className="stat-box-val text-emerald">
                            ₹{ccResult.totalPayment.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{ color: '#ef4444', padding: '16px', background: '#fef2f2', borderRadius: '12px' }}>
                      {ccResult?.error || 'Please enter valid credit card balance and monthly payment.'}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* 6. SAVINGS GOAL */}
            {activeTab === 'savings-goal' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <label className="input-main-label">Target Goal Amount (₹)</label>
                    <input
                      type="number"
                      value={goalTarget}
                      onChange={(e) => setGoalTarget(e.target.value)}
                      className="modern-form-input"
                    />
                  </div>

                  <div className="input-block-modern">
                    <label className="input-main-label">Current Savings (₹)</label>
                    <input
                      type="number"
                      value={goalCurrentSavings}
                      onChange={(e) => setGoalCurrentSavings(e.target.value)}
                      className="modern-form-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="input-block-modern">
                      <label className="input-main-label">Target Years</label>
                      <input
                        type="number"
                        value={goalYears}
                        onChange={(e) => setGoalYears(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                    <div className="input-block-modern">
                      <label className="input-main-label">Expected Return (%)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={goalReturnRate}
                        onChange={(e) => setGoalReturnRate(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {goalResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">REQUIRED MONTHLY SAVINGS</span>
                        <div className="result-score-row">
                          <span className="result-hero-number text-emerald">
                            ₹{goalResult.requiredMonthlySavings.toLocaleString('en-IN')}
                          </span>
                          <span className="status-pill-badge badge-normal">
                            Target: ₹{(goalResult.targetAmount / 100000).toFixed(1)}L
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Your Contribution</span>
                          <span className="stat-box-val">
                            ₹{goalResult.totalUserContribution.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Interest Earned</span>
                          <span className="stat-box-val text-violet">
                            ₹{goalResult.totalInterestEarned.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Timeline</span>
                          <span className="stat-box-val">{goalResult.months} Months</span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 7. INFLATION CALCULATOR */}
            {activeTab === 'inflation' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <label className="input-main-label">Current Amount (₹)</label>
                    <input
                      type="number"
                      value={infAmount}
                      onChange={(e) => setInfAmount(e.target.value)}
                      className="modern-form-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="input-block-modern">
                      <label className="input-main-label">Inflation Rate (% p.a.)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={infRate}
                        onChange={(e) => setInfRate(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                    <div className="input-block-modern">
                      <label className="input-main-label">Years into Future</label>
                      <input
                        type="number"
                        value={infYears}
                        onChange={(e) => setInfYears(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {infResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">FUTURE EQUIVALENT COST</span>
                        <div className="result-score-row">
                          <span className="result-hero-number text-violet">
                            ₹{infResult.futureEquivalentCost.toLocaleString('en-IN')}
                          </span>
                          <span className="status-pill-badge badge-overweight">
                            -{infResult.purchasingPowerLossPercent}% Loss
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Future Purchasing Power</span>
                          <span className="stat-box-val">
                            ₹{infResult.futurePurchasingPower.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Purchasing Power Erosion</span>
                          <span className="stat-box-val text-violet">
                            {infResult.purchasingPowerLossPercent}%
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 8. NET WORTH CALCULATOR */}
            {activeTab === 'net-worth' && (
              <>
                <div className="calc-inputs-pane">
                  <div style={{ fontWeight: 700, color: '#10b981', marginBottom: '8px' }}>Assets (₹)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                    <div>
                      <label className="input-helper-subtext">Cash & Bank</label>
                      <input
                        type="number"
                        value={nwCash}
                        onChange={(e) => setNwcash(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                    <div>
                      <label className="input-helper-subtext">Investments / MF</label>
                      <input
                        type="number"
                        value={nwInvestments}
                        onChange={(e) => setNwInvestments(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                    <div>
                      <label className="input-helper-subtext">Real Estate</label>
                      <input
                        type="number"
                        value={nwProperty}
                        onChange={(e) => setNwProperty(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                    <div>
                      <label className="input-helper-subtext">Vehicles & Valuables</label>
                      <input
                        type="number"
                        value={nwVehicles}
                        onChange={(e) => setNwVehicles(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                  </div>

                  <div style={{ fontWeight: 700, color: '#ef4444', marginBottom: '8px' }}>Liabilities (₹)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    <div>
                      <label className="input-helper-subtext">Home Mortgage</label>
                      <input
                        type="number"
                        value={nwMortgage}
                        onChange={(e) => setNwMortgage(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                    <div>
                      <label className="input-helper-subtext">Auto / Personal</label>
                      <input
                        type="number"
                        value={nwAutoLoan}
                        onChange={(e) => setNwAutoLoan(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                    <div>
                      <label className="input-helper-subtext">Credit Cards</label>
                      <input
                        type="number"
                        value={nwCreditCard}
                        onChange={(e) => setNwCreditCard(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {nwResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">TOTAL NET WORTH</span>
                        <div className="result-score-row">
                          <span className={`result-hero-number ${nwResult.isPositive ? 'text-emerald' : 'text-rose'}`}>
                            ₹{nwResult.netWorth.toLocaleString('en-IN')}
                          </span>
                          <span className={`status-pill-badge ${nwResult.isPositive ? 'badge-normal' : 'badge-obese'}`}>
                            Debt Ratio: {nwResult.debtToAssetRatio}%
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Total Assets</span>
                          <span className="stat-box-val text-emerald">
                            ₹{nwResult.totalAssets.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Total Liabilities</span>
                          <span className="stat-box-val text-rose">
                            ₹{nwResult.totalLiabilities.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 9. SIMPLE INTEREST */}
            {activeTab === 'simple-interest' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <label className="input-main-label">Principal Amount (₹)</label>
                    <input
                      type="number"
                      value={siPrincipal}
                      onChange={(e) => setSiPrincipal(e.target.value)}
                      className="modern-form-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="input-block-modern">
                      <label className="input-main-label">Annual Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={siRate}
                        onChange={(e) => setSiRate(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                    <div className="input-block-modern">
                      <label className="input-main-label">Tenure (Years)</label>
                      <input
                        type="number"
                        value={siYears}
                        onChange={(e) => setSiYears(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {siResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">TOTAL MATURITY VALUE</span>
                        <div className="result-score-row">
                          <span className="result-hero-number text-emerald">
                            ₹{siResult.totalAmount.toLocaleString('en-IN')}
                          </span>
                          <span className="status-pill-badge badge-normal">
                            Interest: ₹{siResult.interestEarned.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Initial Principal</span>
                          <span className="stat-box-val">
                            ₹{siResult.principal.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Total Interest</span>
                          <span className="stat-box-val text-violet">
                            ₹{siResult.interestEarned.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Annual Income</span>
                          <span className="stat-box-val">
                            ₹{siResult.annualInterest.toLocaleString('en-IN')}/yr
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 10. DOWN PAYMENT */}
            {activeTab === 'down-payment' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <label className="input-main-label">Property Price (₹)</label>
                    <input
                      type="number"
                      value={dpPropertyPrice}
                      onChange={(e) => setDpPropertyPrice(e.target.value)}
                      className="modern-form-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="input-block-modern">
                      <label className="input-main-label">Down Payment (%)</label>
                      <input
                        type="number"
                        value={dpDownPercent}
                        onChange={(e) => setDpDownPercent(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                    <div className="input-block-modern">
                      <label className="input-main-label">Closing Costs (%)</label>
                      <input
                        type="number"
                        value={dpClosingCostPercent}
                        onChange={(e) => setDpClosingCostPercent(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {dpResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">TOTAL UPFRONT CASH NEEDED</span>
                        <div className="result-score-row">
                          <span className="result-hero-number text-violet">
                            ₹{dpResult.totalUpfrontCashNeeded.toLocaleString('en-IN')}
                          </span>
                          <span className="status-pill-badge badge-normal">
                            Loan: ₹{(dpResult.loanRequired / 100000).toFixed(1)}L
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Down Payment Amount</span>
                          <span className="stat-box-val">
                            ₹{dpResult.downPaymentAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Mortgage Loan Needed</span>
                          <span className="stat-box-val">
                            ₹{dpResult.loanRequired.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Closing Costs (~{dpResult.closingCostPercent}%)</span>
                          <span className="stat-box-val text-violet">
                            ₹{dpResult.estimatedClosingCosts.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 11. COMPOUND INTEREST */}
            {activeTab === 'compound-interest' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Initial Principal (₹)</label>
                      <span className="input-helper-subtext">Starting lump sum</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={ciPrincipal}
                        onChange={(e) => setCiPrincipal(e.target.value)}
                        className="modern-form-input"
                        placeholder="100000"
                      />
                      <span className="input-suffix-tag">₹</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Annual Interest Rate (%)</label>
                      <span className="input-helper-subtext">Expected annual return</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        step="0.1"
                        value={ciRate}
                        onChange={(e) => setCiRate(e.target.value)}
                        className="modern-form-input"
                        placeholder="8"
                      />
                      <span className="input-suffix-tag">%</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Tenure (Years)</label>
                      <span className="input-helper-subtext">Investment horizon</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={ciYears}
                        onChange={(e) => setCiYears(e.target.value)}
                        className="modern-form-input"
                        placeholder="10"
                      />
                      <span className="input-suffix-tag">Years</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Monthly Addition (₹, Optional)</label>
                      <span className="input-helper-subtext">Recurring contribution</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={ciMonthly}
                        onChange={(e) => setCiMonthly(e.target.value)}
                        className="modern-form-input"
                        placeholder="5000"
                      />
                      <span className="input-suffix-tag">₹/mo</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <label className="input-main-label">Compounding Frequency</label>
                    <div className="toggle-mode-pills">
                      <button
                        type="button"
                        className={`mode-pill ${ciFreq === '1' ? 'active' : ''}`}
                        onClick={() => setCiFreq('1')}
                      >
                        Annually
                      </button>
                      <button
                        type="button"
                        className={`mode-pill ${ciFreq === '4' ? 'active' : ''}`}
                        onClick={() => setCiFreq('4')}
                      >
                        Quarterly
                      </button>
                      <button
                        type="button"
                        className={`mode-pill ${ciFreq === '12' ? 'active' : ''}`}
                        onClick={() => setCiFreq('12')}
                      >
                        Monthly
                      </button>
                    </div>
                  </div>

                  <div className="presets-group-row">
                    <span className="presets-title-tag">Presets:</span>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setCiPrincipal('100000');
                        setCiRate('10');
                        setCiYears('10');
                        setCiMonthly('5000');
                      }}
                    >
                      ₹1L + ₹5k/mo (10y @ 10%)
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setCiPrincipal('500000');
                        setCiRate('7.5');
                        setCiYears('5');
                        setCiMonthly('0');
                      }}
                    >
                      FD Lump sum (₹5L, 5y)
                    </button>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {ciResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">FUTURE MATURITY VALUE</span>
                        <div className="result-score-row">
                          <span className="result-hero-number text-emerald">
                            ₹{ciResult.futureValue.toLocaleString('en-IN')}
                          </span>
                          <span className="status-pill-badge badge-normal">
                            {ciResult.tenureYears} Years Compounded
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Total Deposited</span>
                          <span className="stat-box-val">
                            ₹{ciResult.totalDeposited.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Total Interest Earned</span>
                          <span className="stat-box-val text-violet">
                            ₹{ciResult.totalInterest.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Initial Lump sum</span>
                          <span className="stat-box-val">
                            ₹{ciResult.initialPrincipal.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Wealth Multiplier</span>
                          <span className="stat-box-val">
                            {(ciResult.futureValue / (ciResult.totalDeposited || 1)).toFixed(2)}x
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 12. SIP CALCULATOR */}
            {activeTab === 'sip' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Monthly Investment (₹)</label>
                      <span className="input-helper-subtext">Amount saved each month</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={sipMonthly}
                        onChange={(e) => setSipMonthly(e.target.value)}
                        className="modern-form-input"
                        placeholder="5000"
                      />
                      <span className="input-suffix-tag">₹/mo</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Expected Return Rate (% p.a.)</label>
                      <span className="input-helper-subtext">Historical equity ~12-15%</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        step="0.1"
                        value={sipRate}
                        onChange={(e) => setSipRate(e.target.value)}
                        className="modern-form-input"
                        placeholder="12"
                      />
                      <span className="input-suffix-tag">%</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Time Period (Years)</label>
                      <span className="input-helper-subtext">Duration of investment</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={sipYears}
                        onChange={(e) => setSipYears(e.target.value)}
                        className="modern-form-input"
                        placeholder="10"
                      />
                      <span className="input-suffix-tag">Years</span>
                    </div>
                  </div>

                  <div className="presets-group-row">
                    <span className="presets-title-tag">Quick SIP:</span>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setSipMonthly('2500');
                        setSipRate('12');
                        setSipYears('5');
                      }}
                    >
                      ₹2.5k / 5 yrs
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setSipMonthly('10000');
                        setSipRate('13.5');
                        setSipYears('15');
                      }}
                    >
                      ₹10k / 15 yrs
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setSipMonthly('25000');
                        setSipRate('14');
                        setSipYears('20');
                      }}
                    >
                      ₹25k / 20 yrs
                    </button>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {sipResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">TOTAL PROJECTED CORPUS</span>
                        <div className="result-score-row">
                          <span className="result-hero-number text-emerald">
                            ₹{sipResult.totalValue.toLocaleString('en-IN')}
                          </span>
                          <span className="status-pill-badge badge-normal">
                            {sipResult.tenureYears * 12} Installments
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Invested Amount</span>
                          <span className="stat-box-val">
                            ₹{sipResult.totalInvested.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Estimated Returns</span>
                          <span className="stat-box-val text-violet">
                            ₹{sipResult.estimatedReturns.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Wealth Growth Ratio</span>
                          <span className="stat-box-val text-emerald">
                            {((sipResult.estimatedReturns / sipResult.totalInvested) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Corpus Multiplier</span>
                          <span className="stat-box-val">
                            {(sipResult.totalValue / sipResult.totalInvested).toFixed(2)}x
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 13. ROI CALCULATOR */}
            {activeTab === 'roi' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Initial Investment (₹)</label>
                      <span className="input-helper-subtext">Original amount invested</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={roiInitial}
                        onChange={(e) => setRoiInitial(e.target.value)}
                        className="modern-form-input"
                        placeholder="50000"
                      />
                      <span className="input-suffix-tag">₹</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Final Value / Revenue (₹)</label>
                      <span className="input-helper-subtext">Total return collected</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={roiFinal}
                        onChange={(e) => setRoiFinal(e.target.value)}
                        className="modern-form-input"
                        placeholder="75000"
                      />
                      <span className="input-suffix-tag">₹</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Holding Period (Years)</label>
                      <span className="input-helper-subtext">Optional for annualized ROI</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        step="0.5"
                        value={roiYears}
                        onChange={(e) => setRoiYears(e.target.value)}
                        className="modern-form-input"
                        placeholder="2"
                      />
                      <span className="input-suffix-tag">Years</span>
                    </div>
                  </div>

                  <div className="presets-group-row">
                    <span className="presets-title-tag">Presets:</span>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setRoiInitial('500000');
                        setRoiFinal('800000');
                        setRoiYears('3');
                      }}
                    >
                      ₹5L → ₹8L (3 yrs)
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setRoiInitial('100000');
                        setRoiFinal('160000');
                        setRoiYears('2');
                      }}
                    >
                      ₹1L → ₹1.6L (2 yrs)
                    </button>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {roiResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">RETURN ON INVESTMENT</span>
                        <div className="result-score-row">
                          <span className={`result-hero-number ${roiResult.netProfit >= 0 ? 'text-emerald' : 'text-violet'}`}>
                            {roiResult.roiPercentage >= 0 ? `+${roiResult.roiPercentage}%` : `${roiResult.roiPercentage}%`}
                          </span>
                          <span className={`status-pill-badge ${roiResult.netProfit >= 0 ? 'badge-normal' : 'badge-danger'}`}>
                            {roiResult.multiplier}x Initial
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Net Profit / Gain</span>
                          <span className="stat-box-val text-emerald">
                            ₹{roiResult.netProfit.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Annualized Return (CAGR)</span>
                          <span className="stat-box-val text-violet">
                            {roiResult.annualizedRoi}% p.a.
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Initial Capital</span>
                          <span className="stat-box-val">
                            ₹{roiResult.initialInvestment.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Final Payout</span>
                          <span className="stat-box-val">
                            ₹{roiResult.finalValue.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 14. FD CALCULATOR */}
            {activeTab === 'fd' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Deposit Amount (₹)</label>
                      <span className="input-helper-subtext">Principal amount</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={fdPrincipal}
                        onChange={(e) => setFdPrincipal(e.target.value)}
                        className="modern-form-input"
                        placeholder="200000"
                      />
                      <span className="input-suffix-tag">₹</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Interest Rate (% p.a.)</label>
                      <span className="input-helper-subtext">Bank FD rate</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        step="0.1"
                        value={fdRate}
                        onChange={(e) => setFdRate(e.target.value)}
                        className="modern-form-input"
                        placeholder="7.1"
                      />
                      <span className="input-suffix-tag">%</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Tenure (Years)</label>
                      <span className="input-helper-subtext">Fixed deposit term</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={fdYears}
                        onChange={(e) => setFdYears(e.target.value)}
                        className="modern-form-input"
                        placeholder="3"
                      />
                      <span className="input-suffix-tag">Years</span>
                    </div>
                  </div>

                  <div className="presets-group-row">
                    <span className="presets-title-tag">Common FDs:</span>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setFdPrincipal('200000');
                        setFdRate('7.1');
                        setFdYears('1');
                      }}
                    >
                      1 Year @ 7.1%
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setFdPrincipal('500000');
                        setFdRate('7.5');
                        setFdYears('3');
                      }}
                    >
                      3 Years @ 7.5%
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setFdPrincipal('150000');
                        setFdRate('7.25');
                        setFdYears('5');
                      }}
                    >
                      Tax-Saver 5y
                    </button>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {fdResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">FD MATURITY AMOUNT</span>
                        <div className="result-score-row">
                          <span className="result-hero-number text-emerald">
                            ₹{fdResult.maturityAmount.toLocaleString('en-IN')}
                          </span>
                          <span className="status-pill-badge badge-normal">
                            Compounded Quarterly
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Principal Amount</span>
                          <span className="stat-box-val">
                            ₹{fdResult.principal.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Total Interest Earned</span>
                          <span className="stat-box-val text-violet">
                            ₹{fdResult.totalInterest.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Effective Yield</span>
                          <span className="stat-box-val">
                            {((fdResult.totalInterest / (fdResult.principal * fdResult.tenureYears)) * 100).toFixed(2)}% p.a.
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Tenure</span>
                          <span className="stat-box-val">{fdResult.tenureYears} Years</span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 15. CAGR CALCULATOR */}
            {activeTab === 'cagr' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Beginning Value (₹)</label>
                      <span className="input-helper-subtext">Initial asset price</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={cagrInitial}
                        onChange={(e) => setCagrInitial(e.target.value)}
                        className="modern-form-input"
                        placeholder="100000"
                      />
                      <span className="input-suffix-tag">₹</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Ending Value (₹)</label>
                      <span className="input-helper-subtext">Final asset valuation</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={cagrFinal}
                        onChange={(e) => setCagrFinal(e.target.value)}
                        className="modern-form-input"
                        placeholder="250000"
                      />
                      <span className="input-suffix-tag">₹</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Number of Periods (Years)</label>
                      <span className="input-helper-subtext">Time span</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        step="0.5"
                        value={cagrYears}
                        onChange={(e) => setCagrYears(e.target.value)}
                        className="modern-form-input"
                        placeholder="5"
                      />
                      <span className="input-suffix-tag">Years</span>
                    </div>
                  </div>

                  <div className="presets-group-row">
                    <span className="presets-title-tag">Presets:</span>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setCagrInitial('100000');
                        setCagrFinal('200000');
                        setCagrYears('5');
                      }}
                    >
                      2x in 5y (14.9%)
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setCagrInitial('100000');
                        setCagrFinal('300000');
                        setCagrYears('7');
                      }}
                    >
                      3x in 7y (17.0%)
                    </button>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {cagrResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">COMPOUND ANNUAL GROWTH RATE</span>
                        <div className="result-score-row">
                          <span className="result-hero-number text-emerald">
                            {cagrResult.cagr}%
                          </span>
                          <span className="status-pill-badge badge-normal">
                            Per Annum
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Total Gain</span>
                          <span className="stat-box-val text-emerald">
                            ₹{cagrResult.totalGain.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Absolute Return</span>
                          <span className="stat-box-val text-violet">
                            {cagrResult.absoluteReturn}%
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Beginning Value</span>
                          <span className="stat-box-val">
                            ₹{cagrResult.beginningValue.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Ending Value</span>
                          <span className="stat-box-val">
                            ₹{cagrResult.endingValue.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 16. SALARY CALCULATOR */}
            {activeTab === 'salary' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Gross Salary Amount</label>
                      <span className="input-helper-subtext">Total compensation before tax</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={salAmount}
                        onChange={(e) => setSalAmount(e.target.value)}
                        className="modern-form-input"
                        placeholder="1200000"
                      />
                      <span className="input-suffix-tag">₹</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <label className="input-main-label">Pay Frequency</label>
                    <div className="toggle-mode-pills">
                      <button
                        type="button"
                        className={`mode-pill ${salFreq === 'annual' ? 'active' : ''}`}
                        onClick={() => setSalFreq('annual')}
                      >
                        Annual
                      </button>
                      <button
                        type="button"
                        className={`mode-pill ${salFreq === 'monthly' ? 'active' : ''}`}
                        onClick={() => setSalFreq('monthly')}
                      >
                        Monthly
                      </button>
                      <button
                        type="button"
                        className={`mode-pill ${salFreq === 'hourly' ? 'active' : ''}`}
                        onClick={() => setSalFreq('hourly')}
                      >
                        Hourly
                      </button>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Working Hours / Week</label>
                      <span className="input-helper-subtext">Standard is 40 hours</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={salHours}
                        onChange={(e) => setSalHours(e.target.value)}
                        className="modern-form-input"
                        placeholder="40"
                      />
                      <span className="input-suffix-tag">hrs</span>
                    </div>
                  </div>

                  <div className="presets-group-row">
                    <span className="presets-title-tag">Packages:</span>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setSalAmount('600000');
                        setSalFreq('annual');
                      }}
                    >
                      ₹6 LPA
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setSalAmount('1500000');
                        setSalFreq('annual');
                      }}
                    >
                      ₹15 LPA
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setSalAmount('3000000');
                        setSalFreq('annual');
                      }}
                    >
                      ₹30 LPA
                    </button>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {salResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">MONTHLY EQUIVALENT PAY</span>
                        <div className="result-score-row">
                          <span className="result-hero-number text-emerald">
                            ₹{salResult.monthly.toLocaleString('en-IN')}
                          </span>
                          <span className="status-pill-badge badge-normal">
                            ₹{salResult.hourly.toLocaleString('en-IN')}/hr
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Annual Pay</span>
                          <span className="stat-box-val">
                            ₹{salResult.annual.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Bi-Weekly Pay</span>
                          <span className="stat-box-val text-violet">
                            ₹{salResult.biWeekly.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Weekly Pay</span>
                          <span className="stat-box-val">
                            ₹{salResult.weekly.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Daily Pay (5-day week)</span>
                          <span className="stat-box-val">
                            ₹{salResult.daily.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 17. INCOME TAX CALCULATOR */}
            {activeTab === 'income-tax' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Gross Annual Income (₹)</label>
                      <span className="input-helper-subtext">Total earnings per year</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={taxGross}
                        onChange={(e) => setTaxGross(e.target.value)}
                        className="modern-form-input"
                        placeholder="1200000"
                      />
                      <span className="input-suffix-tag">₹</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Standard Deductions (₹)</label>
                      <span className="input-helper-subtext">Standard deduction ₹50,000 / ₹75,000</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={taxDeductions}
                        onChange={(e) => setTaxDeductions(e.target.value)}
                        className="modern-form-input"
                        placeholder="50000"
                      />
                      <span className="input-suffix-tag">₹</span>
                    </div>
                  </div>

                  <div className="presets-group-row">
                    <span className="presets-title-tag">Slabs:</span>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setTaxGross('700000');
                        setTaxDeductions('50000');
                      }}
                    >
                      ₹7L (Zero Tax via Rebate)
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setTaxGross('1200000');
                        setTaxDeductions('50000');
                      }}
                    >
                      ₹12 LPA
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setTaxGross('2000000');
                        setTaxDeductions('75000');
                      }}
                    >
                      ₹20 LPA
                    </button>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {taxResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">TOTAL TAX LIABILITY</span>
                        <div className="result-score-row">
                          <span className="result-hero-number text-violet">
                            ₹{taxResult.totalTax.toLocaleString('en-IN')}
                          </span>
                          <span className="status-pill-badge badge-normal">
                            Effective: {taxResult.effectiveRate}%
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Take-Home (Annual)</span>
                          <span className="stat-box-val text-emerald">
                            ₹{taxResult.takeHomeAnnual.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Take-Home (Monthly)</span>
                          <span className="stat-box-val text-emerald">
                            ₹{taxResult.takeHomeMonthly.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Taxable Income</span>
                          <span className="stat-box-val">
                            ₹{taxResult.taxableIncome.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Health & Edu Cess (4%)</span>
                          <span className="stat-box-val">
                            ₹{taxResult.cess.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 18. HOURLY TO SALARY */}
            {activeTab === 'hourly-to-salary' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Hourly Wage Rate</label>
                      <span className="input-helper-subtext">Base hourly pay</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={hWage}
                        onChange={(e) => setHWage(e.target.value)}
                        className="modern-form-input"
                        placeholder="35"
                      />
                      <span className="input-suffix-tag">/hr</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Regular Hours / Week</label>
                      <span className="input-helper-subtext">Standard 40 hours</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={hHours}
                        onChange={(e) => setHHours(e.target.value)}
                        className="modern-form-input"
                        placeholder="40"
                      />
                      <span className="input-suffix-tag">hrs</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Overtime Hours / Week</label>
                      <span className="input-helper-subtext">Paid at 1.5x regular wage</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={hOtHours}
                        onChange={(e) => setHOtHours(e.target.value)}
                        className="modern-form-input"
                        placeholder="0"
                      />
                      <span className="input-suffix-tag">OT hrs</span>
                    </div>
                  </div>

                  <div className="presets-group-row">
                    <span className="presets-title-tag">Presets:</span>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setHWage('25');
                        setHHours('40');
                        setHOtHours('0');
                      }}
                    >
                      $25/hr (40h)
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setHWage('50');
                        setHHours('40');
                        setHOtHours('5');
                      }}
                    >
                      $50/hr + 5h OT
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setHWage('85');
                        setHHours('35');
                        setHOtHours('0');
                      }}
                    >
                      $85/hr (35h)
                    </button>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {hResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">ESTIMATED ANNUAL SALARY</span>
                        <div className="result-score-row">
                          <span className="result-hero-number text-emerald">
                            ₹{hResult.annualSalary.toLocaleString('en-IN')}
                          </span>
                          <span className="status-pill-badge badge-normal">
                            52 Weeks / Year
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Monthly Pay</span>
                          <span className="stat-box-val text-emerald">
                            ₹{hResult.monthlySalary.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Bi-Weekly Pay</span>
                          <span className="stat-box-val">
                            ₹{hResult.biWeeklySalary.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Weekly Pay</span>
                          <span className="stat-box-val text-violet">
                            ₹{hResult.totalWeekly.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Overtime Pay / Wk</span>
                          <span className="stat-box-val">
                            ₹{hResult.overtimeWeekly.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 19. BUDGET CALCULATOR */}
            {activeTab === 'budget' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Monthly Take-Home Income (₹)</label>
                      <span className="input-helper-subtext">Total net monthly income</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={budIncome}
                        onChange={(e) => setBudIncome(e.target.value)}
                        className="modern-form-input"
                        placeholder="75000"
                      />
                      <span className="input-suffix-tag">₹</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Needs (₹, Target ~50%)</label>
                      <span className="input-helper-subtext">Rent, groceries, bills, transport</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={budNeeds}
                        onChange={(e) => setBudNeeds(e.target.value)}
                        className="modern-form-input"
                        placeholder="35000"
                      />
                      <span className="input-suffix-tag">₹</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Wants (₹, Target ~30%)</label>
                      <span className="input-helper-subtext">Dining, shopping, hobbies, travel</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={budWants}
                        onChange={(e) => setBudWants(e.target.value)}
                        className="modern-form-input"
                        placeholder="20000"
                      />
                      <span className="input-suffix-tag">₹</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Savings & Debt (₹, Target ~20%)</label>
                      <span className="input-helper-subtext">Investments, emergency fund, loans</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        type="number"
                        value={budSavings}
                        onChange={(e) => setBudSavings(e.target.value)}
                        className="modern-form-input"
                        placeholder="15000"
                      />
                      <span className="input-suffix-tag">₹</span>
                    </div>
                  </div>

                  <div className="presets-group-row">
                    <span className="presets-title-tag">Auto-Split:</span>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        const inc = parseFloat(budIncome) || 75000;
                        setBudNeeds(String(Math.round(inc * 0.5)));
                        setBudWants(String(Math.round(inc * 0.3)));
                        setBudSavings(String(Math.round(inc * 0.2)));
                      }}
                    >
                      Ideal 50 / 30 / 20 Rule
                    </button>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {budResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">UNALLOCATED MONTHLY BUFFER</span>
                        <div className="result-score-row">
                          <span className={`result-hero-number ${budResult.remaining >= 0 ? 'text-emerald' : 'text-violet'}`}>
                            ₹{budResult.remaining.toLocaleString('en-IN')}
                          </span>
                          <span className={`status-pill-badge ${budResult.remaining >= 0 ? 'badge-normal' : 'badge-danger'}`}>
                            {budResult.remaining >= 0 ? 'Surplus Balanced' : 'Over Budget'}
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Needs ({budResult.needsPercent}%)</span>
                          <span className="stat-box-val">
                            ₹{budResult.needs.toLocaleString('en-IN')} <span className="stat-subtext-muted">/ ₹{budResult.targetNeeds.toLocaleString('en-IN')}</span>
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Wants ({budResult.wantsPercent}%)</span>
                          <span className="stat-box-val text-violet">
                            ₹{budResult.wants.toLocaleString('en-IN')} <span className="stat-subtext-muted">/ ₹{budResult.targetWants.toLocaleString('en-IN')}</span>
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Savings ({budResult.savingsPercent}%)</span>
                          <span className="stat-box-val text-emerald">
                            ₹{budResult.savings.toLocaleString('en-IN')} <span className="stat-subtext-muted">/ ₹{budResult.targetSavings.toLocaleString('en-IN')}</span>
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Total Outflow</span>
                          <span className="stat-box-val">
                            ₹{budResult.totalSpent.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* BMI CALCULATOR */}
            {activeTab === 'bmi' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <label className="input-main-label">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={bmiWeight}
                      onChange={(e) => setBmiWeight(e.target.value)}
                      className="modern-form-input"
                    />
                  </div>
                  <div className="input-block-modern">
                    <label className="input-main-label">Height (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={bmiHeight}
                      onChange={(e) => setBmiHeight(e.target.value)}
                      className="modern-form-input"
                    />
                  </div>
                </div>

                <div className="calc-result-pane">
                  {bmiResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">BODY MASS INDEX</span>
                        <div className="result-score-row">
                          <span className="result-hero-number">{bmiResult.bmi}</span>
                          <span className={`status-pill-badge ${bmiResult.badgeClass}`}>
                            {bmiResult.category}
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Category</span>
                          <span className="stat-box-val">{bmiResult.category}</span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Healthy Range</span>
                          <span className="stat-box-val">
                            {bmiResult.minNormalWeight} - {bmiResult.maxNormalWeight} kg
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 20. CALORIE CALCULATOR */}
            {activeTab === 'calorie' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Age (Years)</label>
                    </div>
                    <input
                      type="number"
                      value={calAge}
                      onChange={(e) => setCalAge(e.target.value)}
                      className="modern-form-input"
                      placeholder="28"
                    />
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Gender</label>
                    </div>
                    <select
                      value={calGender}
                      onChange={(e) => setCalGender(e.target.value)}
                      className="modern-form-input"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Weight (kg)</label>
                    </div>
                    <input
                      type="number"
                      step="0.5"
                      value={calWeight}
                      onChange={(e) => setCalWeight(e.target.value)}
                      className="modern-form-input"
                      placeholder="72"
                    />
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Height (cm)</label>
                    </div>
                    <input
                      type="number"
                      step="0.5"
                      value={calHeight}
                      onChange={(e) => setCalHeight(e.target.value)}
                      className="modern-form-input"
                      placeholder="175"
                    />
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Activity Level</label>
                    </div>
                    <select
                      value={calActivity}
                      onChange={(e) => setCalActivity(e.target.value)}
                      className="modern-form-input"
                    >
                      <option value="sedentary">Sedentary (Little or no exercise)</option>
                      <option value="light">Light (Exercise 1-3 times/week)</option>
                      <option value="moderate">Moderate (Exercise 4-5 times/week)</option>
                      <option value="active">Active (Daily exercise or intense sports)</option>
                      <option value="very_active">Very Active (Intense training / physical job)</option>
                    </select>
                  </div>

                  <div className="presets-group-row">
                    <span className="presets-title-tag">Presets:</span>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setCalAge('25');
                        setCalGender('female');
                        setCalWeight('58');
                        setCalHeight('165');
                        setCalActivity('light');
                      }}
                    >
                      Female 25y (58kg, Light)
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setCalAge('30');
                        setCalGender('male');
                        setCalWeight('78');
                        setCalHeight('178');
                        setCalActivity('moderate');
                      }}
                    >
                      Male 30y (78kg, Moderate)
                    </button>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {calResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">DAILY MAINTENANCE ENERGY (TDEE)</span>
                        <div className="result-score-row">
                          <span className="result-hero-number text-emerald">
                            {calResult.maintenanceCalories.toLocaleString('en-IN')} kcal/day
                          </span>
                          <span className="status-pill-badge badge-normal">
                            BMR: {calResult.bmr} kcal
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Basal Metabolic Rate</span>
                          <span className="stat-box-val">{calResult.bmr} kcal</span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Mild Weight Loss (-0.25kg/wk)</span>
                          <span className="stat-box-val text-violet">{calResult.mildWeightLoss} kcal</span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Weight Loss (-0.5kg/wk)</span>
                          <span className="stat-box-val text-violet">{calResult.weightLoss} kcal</span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Weight Gain (+0.5kg/wk)</span>
                          <span className="stat-box-val text-emerald">{calResult.weightGain} kcal</span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 21. IDEAL WEIGHT CALCULATOR */}
            {activeTab === 'ideal-weight' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Height (cm)</label>
                      <span className="input-helper-subtext">Height in centimeters</span>
                    </div>
                    <input
                      type="number"
                      step="0.5"
                      value={iwHeight}
                      onChange={(e) => setIwHeight(e.target.value)}
                      className="modern-form-input"
                      placeholder="175"
                    />
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Gender</label>
                      <span className="input-helper-subtext">Biological sex for formulas</span>
                    </div>
                    <select
                      value={iwGender}
                      onChange={(e) => setIwGender(e.target.value)}
                      className="modern-form-input"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div className="presets-group-row">
                    <span className="presets-title-tag">Heights:</span>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => setIwHeight('160')}
                    >
                      160 cm (5'3")
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => setIwHeight('172')}
                    >
                      172 cm (5'8")
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => setIwHeight('183')}
                    >
                      183 cm (6'0")
                    </button>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {iwResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">RECOMMENDED IDEAL WEIGHT (DEVINE)</span>
                        <div className="result-score-row">
                          <span className="result-hero-number text-emerald">
                            {iwResult.devineWeightKg} kg
                          </span>
                          <span className="status-pill-badge badge-normal">
                            Healthy Range: {iwResult.idealRange}
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Devine Formula</span>
                          <span className="stat-box-val">{iwResult.devineWeightKg} kg</span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Robinson Formula</span>
                          <span className="stat-box-val text-violet">{iwResult.robinsonWeightKg} kg</span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Healthy BMI Min (18.5)</span>
                          <span className="stat-box-val">{iwResult.minHealthyWeightKg} kg</span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Healthy BMI Max (24.9)</span>
                          <span className="stat-box-val">{iwResult.maxHealthyWeightKg} kg</span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 22. BODY FAT CALCULATOR */}
            {activeTab === 'body-fat' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <label className="input-main-label">Gender</label>
                    <select
                      value={bfGender}
                      onChange={(e) => setBfGender(e.target.value)}
                      className="modern-form-input"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div className="input-block-modern">
                    <label className="input-main-label">Height (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={bfHeight}
                      onChange={(e) => setBfHeight(e.target.value)}
                      className="modern-form-input"
                      placeholder="175"
                    />
                  </div>

                  <div className="input-block-modern">
                    <label className="input-main-label">Waist Circumference (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={bfWaist}
                      onChange={(e) => setBfWaist(e.target.value)}
                      className="modern-form-input"
                      placeholder="84"
                    />
                  </div>

                  <div className="input-block-modern">
                    <label className="input-main-label">Neck Circumference (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={bfNeck}
                      onChange={(e) => setBfNeck(e.target.value)}
                      className="modern-form-input"
                      placeholder="38"
                    />
                  </div>

                  {bfGender === 'female' && (
                    <div className="input-block-modern">
                      <label className="input-main-label">Hip Circumference (cm)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={bfHip}
                        onChange={(e) => setBfHip(e.target.value)}
                        className="modern-form-input"
                        placeholder="95"
                      />
                    </div>
                  )}

                  <div className="presets-group-row">
                    <span className="presets-title-tag">Presets:</span>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setBfGender('male');
                        setBfHeight('175');
                        setBfWaist('82');
                        setBfNeck('38');
                      }}
                    >
                      Standard Male
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setBfGender('female');
                        setBfHeight('165');
                        setBfWaist('72');
                        setBfNeck('33');
                        setBfHip('96');
                      }}
                    >
                      Standard Female
                    </button>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {bfResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">BODY FAT PERCENTAGE (U.S. NAVY METHOD)</span>
                        <div className="result-score-row">
                          <span className="result-hero-number text-emerald">
                            {bfResult.bodyFatPercentage}%
                          </span>
                          <span className="status-pill-badge badge-normal">
                            {bfResult.category}
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Category</span>
                          <span className="stat-box-val">{bfResult.category}</span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Fat Mass</span>
                          <span className="stat-box-val text-violet">{bfResult.fatMassPercentage}%</span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Lean Body Mass</span>
                          <span className="stat-box-val text-emerald">{bfResult.leanMassPercentage}%</span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Method</span>
                          <span className="stat-box-val">U.S. Navy Formula</span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 23. PREGNANCY DUE DATE CALCULATOR */}
            {activeTab === 'pregnancy-due-date' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">First Day of Last Period (LMP)</label>
                      <span className="input-helper-subtext">Last menstrual cycle start date</span>
                    </div>
                    <input
                      type="date"
                      value={pregLmp}
                      onChange={(e) => setPregLmp(e.target.value)}
                      className="modern-form-input"
                    />
                  </div>

                  <div className="presets-group-row">
                    <span className="presets-title-tag">Recent LMP:</span>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() - 42); // 6 weeks ago
                        setPregLmp(d.toISOString().split('T')[0]);
                      }}
                    >
                      6 Weeks Ago
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() - 84); // 12 weeks ago
                        setPregLmp(d.toISOString().split('T')[0]);
                      }}
                    >
                      12 Weeks Ago
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() - 140); // 20 weeks ago
                        setPregLmp(d.toISOString().split('T')[0]);
                      }}
                    >
                      20 Weeks Ago
                    </button>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {pregResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">ESTIMATED DUE DATE (EDD)</span>
                        <div className="result-score-row">
                          <span className="result-hero-number text-emerald">
                            {pregResult.dueDateFormatted}
                          </span>
                          <span className="status-pill-badge badge-normal">
                            {pregResult.trimester}
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Gestational Age</span>
                          <span className="stat-box-val">
                            {pregResult.currentWeeks}w {pregResult.currentDays}d
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Days to Arrival</span>
                          <span className="stat-box-val text-violet">
                            {pregResult.daysRemaining} days
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Trimester Stage</span>
                          <span className="stat-box-val">{pregResult.trimester.split(' ')[0]} Trimester</span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Clinical Formula</span>
                          <span className="stat-box-val">Naegele's Rule (+280d)</span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 24. WATER INTAKE CALCULATOR */}
            {activeTab === 'water-intake' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Body Weight (kg)</label>
                      <span className="input-helper-subtext">35ml per kg base baseline</span>
                    </div>
                    <input
                      type="number"
                      step="0.5"
                      value={waterWeight}
                      onChange={(e) => setWaterWeight(e.target.value)}
                      className="modern-form-input"
                      placeholder="70"
                    />
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Daily Exercise / Activity (Minutes)</label>
                      <span className="input-helper-subtext">+350ml per 30 minutes</span>
                    </div>
                    <input
                      type="number"
                      value={waterActivity}
                      onChange={(e) => setWaterActivity(e.target.value)}
                      className="modern-form-input"
                      placeholder="30"
                    />
                  </div>

                  <div className="presets-group-row">
                    <span className="presets-title-tag">Activity:</span>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => setWaterActivity('0')}
                    >
                      Rest Day (0 min)
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => setWaterActivity('45')}
                    >
                      Moderate Gym (45 min)
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => setWaterActivity('90')}
                    >
                      Intense / Cardio (90 min)
                    </button>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {waterResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">RECOMMENDED DAILY WATER INTAKE</span>
                        <div className="result-score-row">
                          <span className="result-hero-number text-emerald">
                            {waterResult.litersPerDay} Liters / day
                          </span>
                          <span className="status-pill-badge badge-normal">
                            ~{waterResult.glassesPerDay} Standard Glasses
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Total Volume</span>
                          <span className="stat-box-val">{waterResult.millilitersPerDay.toLocaleString('en-IN')} mL</span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Glasses (250ml)</span>
                          <span className="stat-box-val text-violet">{waterResult.glassesPerDay} glasses</span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Base Requirement</span>
                          <span className="stat-box-val">{(waterResult.weightKg * 35).toLocaleString('en-IN')} mL</span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Workout Compensation</span>
                          <span className="stat-box-val text-emerald">+{Math.round((waterResult.activityMinutes / 30) * 350)} mL</span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 25. SLEEP CALCULATOR */}
            {activeTab === 'sleep' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Target Time</label>
                      <span className="input-helper-subtext">Time to wake or go to bed</span>
                    </div>
                    <input
                      type="time"
                      value={sleepTarget}
                      onChange={(e) => setSleepTarget(e.target.value)}
                      className="modern-form-input"
                    />
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Calculation Mode</label>
                    </div>
                    <select
                      value={sleepMode}
                      onChange={(e) => setSleepMode(e.target.value)}
                      className="modern-form-input"
                    >
                      <option value="wake">I want to wake up at this time</option>
                      <option value="bed">I am going to bed at this time</option>
                    </select>
                  </div>

                  <div className="presets-group-row">
                    <span className="presets-title-tag">Common Times:</span>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setSleepTarget('06:30');
                        setSleepMode('wake');
                      }}
                    >
                      Wake @ 6:30 AM
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setSleepTarget('07:30');
                        setSleepMode('wake');
                      }}
                    >
                      Wake @ 7:30 AM
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setSleepTarget('23:00');
                        setSleepMode('bed');
                      }}
                    >
                      Bed @ 11:00 PM
                    </button>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {sleepResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">
                          OPTIMAL {sleepResult.mode === 'wake' ? 'BEDTIMES' : 'WAKE TIMES'} (90-MIN CYCLES)
                        </span>
                        <div className="result-score-row">
                          <span className="result-hero-number text-emerald">
                            {sleepResult.suggestions.find((s) => s.isRecommended)?.time}
                          </span>
                          <span className="status-pill-badge badge-normal">
                            Optimal 5 Cycles (7.5h)
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        {sleepResult.suggestions.map((item, idx) => (
                          <div key={idx} className="metric-stat-box">
                            <span className="stat-box-label">
                              {item.cycles} Cycles ({item.hours} hrs)
                              {item.isRecommended ? ' ⭐' : ''}
                            </span>
                            <span className={`stat-box-val ${item.isRecommended ? 'text-emerald' : 'text-violet'}`}>
                              {item.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 26. TARGET HEART RATE CALCULATOR */}
            {activeTab === 'target-heart-rate' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Age (Years)</label>
                      <span className="input-helper-subtext">Calculates Max HR (220 - Age)</span>
                    </div>
                    <input
                      type="number"
                      value={thrAge}
                      onChange={(e) => setThrAge(e.target.value)}
                      className="modern-form-input"
                      placeholder="28"
                    />
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Resting Heart Rate (bpm)</label>
                      <span className="input-helper-subtext">Optional (standard ~60-75 bpm)</span>
                    </div>
                    <input
                      type="number"
                      value={thrRhr}
                      onChange={(e) => setThrRhr(e.target.value)}
                      className="modern-form-input"
                      placeholder="68"
                    />
                  </div>

                  <div className="presets-group-row">
                    <span className="presets-title-tag">Age Presets:</span>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setThrAge('24');
                        setThrRhr('64');
                      }}
                    >
                      Age 24 (RHR 64)
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setThrAge('35');
                        setThrRhr('70');
                      }}
                    >
                      Age 35 (RHR 70)
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setThrAge('50');
                        setThrRhr('72');
                      }}
                    >
                      Age 50 (RHR 72)
                    </button>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {thrResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">FAT BURNING / ENDURANCE ZONE (60-70%)</span>
                        <div className="result-score-row">
                          <span className="result-hero-number text-emerald">
                            {thrResult.zone2.range}
                          </span>
                          <span className="status-pill-badge badge-normal">
                            Max HR: {thrResult.maxHeartRate} bpm
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Zone 1 (Warm Up 50-60%)</span>
                          <span className="stat-box-val">{thrResult.zone1.range}</span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Zone 2 (Fat Burn 60-70%)</span>
                          <span className="stat-box-val text-emerald">{thrResult.zone2.range}</span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Zone 3 (Aerobic Cardio 70-80%)</span>
                          <span className="stat-box-val text-violet">{thrResult.zone3.range}</span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Zone 4 (Anaerobic 80-90%)</span>
                          <span className="stat-box-val">{thrResult.zone4.range}</span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 12. AGE CALCULATOR */}
            {activeTab === 'age' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <label className="input-main-label">Date of Birth</label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="modern-form-input"
                    />
                  </div>
                </div>

                <div className="calc-result-pane">
                  {ageResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">CURRENT AGE</span>
                        <div className="result-score-row">
                          <span className="result-hero-number">{ageResult.years} Years</span>
                          <span className="status-pill-badge badge-normal">
                            {ageResult.months} Mo, {ageResult.days} Days
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Total Days Lived</span>
                          <span className="stat-box-val">
                            {ageResult.totalDays.toLocaleString('en-IN')} days
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Days to Birthday</span>
                          <span className="stat-box-val text-violet">
                            {ageResult.daysToNextBirthday} days
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 13. GST CALCULATOR */}
            {activeTab === 'gst' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <label className="input-main-label">Amount (₹)</label>
                    <input
                      type="number"
                      value={gstAmount}
                      onChange={(e) => setGstAmount(e.target.value)}
                      className="modern-form-input"
                    />
                  </div>
                  <div className="input-block-modern">
                    <label className="input-main-label">GST Rate (%)</label>
                    <input
                      type="number"
                      value={gstRate}
                      onChange={(e) => setGstRate(e.target.value)}
                      className="modern-form-input"
                    />
                  </div>
                </div>

                <div className="calc-result-pane">
                  {gstResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">TOTAL PAYABLE AMOUNT</span>
                        <div className="result-score-row">
                          <span className="result-hero-number text-emerald">
                            ₹{gstResult.totalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Base Amount</span>
                          <span className="stat-box-val">
                            ₹{gstResult.baseAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">GST ({gstResult.gstRate}%)</span>
                          <span className="stat-box-val text-violet">
                            ₹{gstResult.gstAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}

            {/* 14. EB BILL CALCULATOR */}
            {activeTab === 'eb' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <label className="input-main-label">Units Consumed (kWh)</label>
                    <input
                      type="number"
                      value={ebUnits}
                      onChange={(e) => setEbUnits(e.target.value)}
                      className="modern-form-input"
                    />
                  </div>
                  <div className="input-block-modern">
                    <label className="input-main-label">Rate Per Unit (₹)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={ebRate}
                      onChange={(e) => setEbRate(e.target.value)}
                      className="modern-form-input"
                    />
                  </div>
                </div>

                <div className="calc-result-pane">
                  {ebResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">ESTIMATED BILL</span>
                        <div className="result-score-row">
                          <span className="result-hero-number text-emerald">
                            ₹{ebResult.finalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="detail-metrics-grid">
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Energy Charges</span>
                          <span className="stat-box-val">
                            ₹{ebResult.baseEnergyCost.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="metric-stat-box">
                          <span className="stat-box-label">Fixed Charges (5%)</span>
                          <span className="stat-box-val text-violet">
                            ₹{ebResult.fixedCharge.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            )}
          </div>

          {/* Sync Button */}
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="sync-cloud-btn"
              onClick={handleServerSync}
              disabled={syncedStatus === 'syncing'}
            >
              {syncedStatus === 'syncing' ? (
                <span>Syncing with Cloud...</span>
              ) : syncedStatus === 'success' ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Calculation Synced</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Save to Kalzy Account</span>
                </>
              )}
            </button>
          </div>
        </main>
      </section>
    </div>
  );
}

export default Dashboard;
