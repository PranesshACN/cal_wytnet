/**
 * Core calculation logic matching the backend and frontend standards of Kalzy.
 */

export const calculateBMILogic = (weightKg, heightCm) => {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
    return null;
  }
  const heightM = heightCm / 100;
  const bmi = +(weightKg / (heightM * heightM)).toFixed(2);

  let category = '';
  let color = '#10B981';
  let badgeClass = 'badge-normal';

  if (bmi < 18.5) {
    category = 'Underweight';
    color = '#3B82F6';
    badgeClass = 'badge-underweight';
  } else if (bmi < 25) {
    category = 'Normal weight';
    color = '#10B981';
    badgeClass = 'badge-normal';
  } else if (bmi < 30) {
    category = 'Overweight';
    color = '#F59E0B';
    badgeClass = 'badge-overweight';
  } else {
    category = 'Obese';
    color = '#EF4444';
    badgeClass = 'badge-obese';
  }

  // Healthy weight range for this height
  const minNormalWeight = +(18.5 * heightM * heightM).toFixed(1);
  const maxNormalWeight = +(24.9 * heightM * heightM).toFixed(1);

  return {
    bmi,
    category,
    color,
    badgeClass,
    weight: weightKg,
    height: heightCm,
    minNormalWeight,
    maxNormalWeight,
  };
};

export const calculateAgeLogic = (birthDateStr) => {
  if (!birthDateStr) return null;
  const birthDate = new Date(birthDateStr);
  const today = new Date();

  if (isNaN(birthDate.getTime()) || birthDate > today) {
    return null;
  }

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    // Days in previous month
    const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffTime = Math.abs(today - birthDate);
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;

  // Next birthday calculation
  const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  const daysUntilNextBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalHours,
    daysUntilNextBirthday,
    birthDate: birthDateStr,
  };
};

export const calculateGSTLogic = (amount, gstRate, isInclusive = false) => {
  const numericAmount = parseFloat(amount);
  const rate = parseFloat(gstRate);

  if (isNaN(numericAmount) || numericAmount <= 0 || isNaN(rate) || rate < 0) {
    return null;
  }

  let baseAmount;
  let gstAmount;
  let totalAmount;

  if (isInclusive) {
    // Amount includes GST: base = amount / (1 + rate/100)
    baseAmount = +(numericAmount / (1 + rate / 100)).toFixed(2);
    gstAmount = +(numericAmount - baseAmount).toFixed(2);
    totalAmount = +numericAmount.toFixed(2);
  } else {
    // Exclusive mode: base = amount, gst = amount * rate / 100
    baseAmount = +numericAmount.toFixed(2);
    gstAmount = +((numericAmount * rate) / 100).toFixed(2);
    totalAmount = +(baseAmount + gstAmount).toFixed(2);
  }

  const halfGst = +(gstAmount / 2).toFixed(2);

  return {
    originalAmount: numericAmount,
    baseAmount,
    gstRate: rate,
    gstAmount,
    totalAmount,
    cgst: halfGst,
    sgst: halfGst,
    isInclusive,
  };
};

export const calculateEBBillLogic = (units, ratePerUnit = 6.5) => {
  const numericUnits = parseFloat(units);
  const rate = parseFloat(ratePerUnit);

  if (isNaN(numericUnits) || numericUnits < 0 || isNaN(rate) || rate <= 0) {
    return null;
  }

  // Energy charges = units * rate
  const energyCharges = +(numericUnits * rate).toFixed(2);
  // Fixed charges standard 5% as implemented in existing backend
  const fixedCharges = +(energyCharges * 0.05).toFixed(2);
  const totalAmount = +(energyCharges + fixedCharges).toFixed(2);

  return {
    units: numericUnits,
    ratePerUnit: rate,
    energyCharges,
    baseEnergyCost: energyCharges,
    fixedCharges,
    fixedCharge: fixedCharges,
    totalAmount,
    finalAmount: totalAmount,
    isEstimate: true,
  };
};

// ==============================================================================
// 10 FINANCE & LOAN CALCULATORS
// ==============================================================================

// 1. EMI Calculator
export const calculateEMILogic = (principal, annualRate, tenureYears) => {
  const P = parseFloat(principal);
  const R = parseFloat(annualRate);
  const Y = parseFloat(tenureYears);

  if (isNaN(P) || P <= 0 || isNaN(R) || R <= 0 || isNaN(Y) || Y <= 0) {
    return null;
  }

  const r = R / (12 * 100); // monthly interest rate
  const n = Y * 12; // total months
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - P;

  return {
    principal: P,
    annualRate: R,
    tenureYears: Y,
    totalMonths: n,
    monthlyEmi: +emi.toFixed(2),
    totalInterest: +totalInterest.toFixed(2),
    totalPayment: +totalPayment.toFixed(2),
    interestRatio: +((totalInterest / totalPayment) * 100).toFixed(1),
  };
};

// 2. Mortgage Calculator
export const calculateMortgageLogic = (
  homeValue,
  downPaymentPercent = 20,
  annualRate = 6.5,
  termYears = 30,
  propertyTaxRate = 1.2,
  annualInsurance = 1200
) => {
  const V = parseFloat(homeValue);
  const DP = parseFloat(downPaymentPercent);
  const R = parseFloat(annualRate);
  const Y = parseFloat(termYears);
  const Tax = parseFloat(propertyTaxRate) || 0;
  const Ins = parseFloat(annualInsurance) || 0;

  if (isNaN(V) || V <= 0 || isNaN(R) || R <= 0 || isNaN(Y) || Y <= 0) {
    return null;
  }

  const downPaymentAmount = (V * DP) / 100;
  const loanAmount = V - downPaymentAmount;

  const r = R / (12 * 100);
  const n = Y * 12;
  const monthlyPrincipalInterest = loanAmount > 0
    ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    : 0;

  const monthlyPropertyTax = (V * (Tax / 100)) / 12;
  const monthlyInsurance = Ins / 12;
  const totalMonthlyPayment = monthlyPrincipalInterest + monthlyPropertyTax + monthlyInsurance;
  const totalLoanRepayment = monthlyPrincipalInterest * n;
  const totalInterest = totalLoanRepayment - loanAmount;

  return {
    homeValue: V,
    downPaymentAmount: +downPaymentAmount.toFixed(2),
    downPaymentPercent: DP,
    loanAmount: +loanAmount.toFixed(2),
    monthlyPrincipalInterest: +monthlyPrincipalInterest.toFixed(2),
    monthlyPropertyTax: +monthlyPropertyTax.toFixed(2),
    monthlyInsurance: +monthlyInsurance.toFixed(2),
    totalMonthlyPayment: +totalMonthlyPayment.toFixed(2),
    totalInterest: +totalInterest.toFixed(2),
    totalCostOfHome: +(downPaymentAmount + totalLoanRepayment + (monthlyPropertyTax + monthlyInsurance) * n).toFixed(2),
  };
};

// 3. Loan Comparison Calculator
export const calculateLoanComparisonLogic = (loanA, loanB) => {
  const resultA = calculateEMILogic(loanA.principal, loanA.rate, loanA.tenureYears);
  const resultB = calculateEMILogic(loanB.principal, loanB.rate, loanB.tenureYears);

  if (!resultA || !resultB) return null;

  const monthlySavings = +(resultA.monthlyEmi - resultB.monthlyEmi).toFixed(2);
  const totalInterestDiff = +(resultA.totalInterest - resultB.totalInterest).toFixed(2);
  const cheaperLoan = totalInterestDiff > 0 ? 'B' : totalInterestDiff < 0 ? 'A' : 'Equal';

  return {
    loanA: resultA,
    loanB: resultB,
    monthlySavings: Math.abs(monthlySavings),
    monthlyLowerLoan: monthlySavings > 0 ? 'B' : 'A',
    totalInterestDiff: Math.abs(totalInterestDiff),
    cheaperLoan,
    betterSummary: cheaperLoan === 'Equal'
      ? 'Both loans cost the same overall.'
      : `Loan ${cheaperLoan} saves ₹${Math.abs(totalInterestDiff).toLocaleString('en-IN')} in total interest.`,
  };
};

// 4. Retirement Calculator
export const calculateRetirementLogic = (
  currentAge,
  retirementAge,
  currentSavings,
  monthlyContribution,
  annualReturnRate = 8
) => {
  const age = parseFloat(currentAge);
  const retAge = parseFloat(retirementAge);
  const savings = parseFloat(currentSavings) || 0;
  const monthly = parseFloat(monthlyContribution) || 0;
  const rAnnual = parseFloat(annualReturnRate) || 0;

  if (isNaN(age) || isNaN(retAge) || retAge <= age) {
    return null;
  }

  const yearsToRetire = retAge - age;
  const months = yearsToRetire * 12;
  const rMonthly = rAnnual / (12 * 100);

  // Future value of current savings: PV * (1 + r)^n
  const futureSavings = savings * Math.pow(1 + rMonthly, months);

  // Future value of monthly contributions: PMT * [((1 + r)^n - 1) / r]
  const futureContributions = rMonthly > 0
    ? monthly * ((Math.pow(1 + rMonthly, months) - 1) / rMonthly)
    : monthly * months;

  const totalCorpus = futureSavings + futureContributions;
  const totalDeposited = savings + (monthly * months);
  const totalWealthGain = totalCorpus - totalDeposited;

  // 4% safe withdrawal rule (annual and monthly)
  const safeMonthlyRetirementIncome = (totalCorpus * 0.04) / 12;

  return {
    currentAge: age,
    retirementAge: retAge,
    yearsToRetire,
    totalDeposited: +totalDeposited.toFixed(2),
    totalWealthGain: +totalWealthGain.toFixed(2),
    totalCorpus: +totalCorpus.toFixed(2),
    safeMonthlyRetirementIncome: +safeMonthlyRetirementIncome.toFixed(2),
  };
};

// 5. Credit Card Payoff Calculator
export const calculateCreditCardPayoffLogic = (balance, rateApr, monthlyPayment) => {
  const B = parseFloat(balance);
  const APR = parseFloat(rateApr);
  const PMT = parseFloat(monthlyPayment);

  if (isNaN(B) || B <= 0 || isNaN(APR) || APR < 0 || isNaN(PMT) || PMT <= 0) {
    return null;
  }

  const monthlyRate = APR / (12 * 100);
  const firstMonthInterest = B * monthlyRate;

  if (PMT <= firstMonthInterest) {
    return {
      isInfinite: true,
      error: 'Monthly payment must be greater than monthly interest charges (₹' + firstMonthInterest.toFixed(2) + ').',
      monthsNeeded: Infinity,
      totalInterest: Infinity,
      totalPayment: Infinity,
    };
  }

  let currentBalance = B;
  let totalInterest = 0;
  let months = 0;

  while (currentBalance > 0.01 && months < 600) { // cap at 50 years
    const interest = currentBalance * monthlyRate;
    totalInterest += interest;
    currentBalance = currentBalance + interest - PMT;
    months++;
  }

  return {
    isInfinite: false,
    startingBalance: B,
    monthlyPayment: PMT,
    monthsNeeded: months,
    yearsNeeded: +(months / 12).toFixed(1),
    totalInterest: +totalInterest.toFixed(2),
    totalPayment: +(B + totalInterest).toFixed(2),
  };
};

// 6. Savings Goal Calculator
export const calculateSavingsGoalLogic = (
  targetAmount,
  currentSavings = 0,
  years = 3,
  expectedReturnRate = 7
) => {
  const Target = parseFloat(targetAmount);
  const Initial = parseFloat(currentSavings) || 0;
  const Y = parseFloat(years);
  const R = parseFloat(expectedReturnRate) || 0;

  if (isNaN(Target) || Target <= 0 || isNaN(Y) || Y <= 0) {
    return null;
  }

  const n = Y * 12;
  const r = R / (12 * 100);

  // Future value of current savings
  const fvInitial = Initial * Math.pow(1 + r, n);
  const remainingNeeded = Math.max(0, Target - fvInitial);

  // PMT = FV_needed / [((1 + r)^n - 1) / r]
  const requiredMonthlySavings = r > 0
    ? (remainingNeeded * r) / (Math.pow(1 + r, n) - 1)
    : remainingNeeded / n;

  const totalUserContribution = Initial + (requiredMonthlySavings * n);
  const totalInterestEarned = Target - totalUserContribution;

  return {
    targetAmount: Target,
    currentSavings: Initial,
    years: Y,
    months: n,
    requiredMonthlySavings: +requiredMonthlySavings.toFixed(2),
    totalUserContribution: +totalUserContribution.toFixed(2),
    totalInterestEarned: +Math.max(0, totalInterestEarned).toFixed(2),
  };
};

// 7. Inflation Calculator
export const calculateInflationLogic = (currentAmount, inflationRate = 6, years = 10) => {
  const A = parseFloat(currentAmount);
  const I = parseFloat(inflationRate);
  const Y = parseFloat(years);

  if (isNaN(A) || A <= 0 || isNaN(I) || isNaN(Y) || Y <= 0) {
    return null;
  }

  const i = I / 100;
  // Future cost for same goods
  const futureEquivalentCost = A * Math.pow(1 + i, Y);
  // Purchasing power of current A in Y years
  const futurePurchasingPower = A / Math.pow(1 + i, Y);
  const purchasingPowerLossPercent = ((1 - (futurePurchasingPower / A)) * 100);

  return {
    currentAmount: A,
    inflationRate: I,
    years: Y,
    futureEquivalentCost: +futureEquivalentCost.toFixed(2),
    futurePurchasingPower: +futurePurchasingPower.toFixed(2),
    purchasingPowerLossPercent: +purchasingPowerLossPercent.toFixed(1),
  };
};

// 8. Net Worth Calculator
export const calculateNetWorthLogic = (assets = {}, liabilities = {}) => {
  const parseSum = (obj) =>
    Object.values(obj).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);

  const totalAssets = parseSum(assets);
  const totalLiabilities = parseSum(liabilities);
  const netWorth = totalAssets - totalLiabilities;
  const debtToAssetRatio = totalAssets > 0 ? +((totalLiabilities / totalAssets) * 100).toFixed(1) : 0;

  return {
    totalAssets: +totalAssets.toFixed(2),
    totalLiabilities: +totalLiabilities.toFixed(2),
    netWorth: +netWorth.toFixed(2),
    debtToAssetRatio,
    isPositive: netWorth >= 0,
  };
};

// 9. Simple Interest Calculator
export const calculateSimpleInterestLogic = (principal, annualRate, tenureYears) => {
  const P = parseFloat(principal);
  const R = parseFloat(annualRate);
  const T = parseFloat(tenureYears);

  if (isNaN(P) || P <= 0 || isNaN(R) || R < 0 || isNaN(T) || T <= 0) {
    return null;
  }

  const interest = (P * R * T) / 100;
  const totalAmount = P + interest;
  const annualInterest = interest / T;

  return {
    principal: P,
    annualRate: R,
    tenureYears: T,
    interestEarned: +interest.toFixed(2),
    totalAmount: +totalAmount.toFixed(2),
    annualInterest: +annualInterest.toFixed(2),
  };
};

// 10. Down Payment Calculator
export const calculateDownPaymentLogic = (
  propertyPrice,
  downPaymentPercent = 20,
  closingCostPercent = 3
) => {
  const Price = parseFloat(propertyPrice);
  const DownPct = parseFloat(downPaymentPercent);
  const ClosePct = parseFloat(closingCostPercent) || 0;

  if (isNaN(Price) || Price <= 0 || isNaN(DownPct) || DownPct < 0) {
    return null;
  }

  const downPaymentAmount = (Price * DownPct) / 100;
  const loanRequired = Price - downPaymentAmount;
  const estimatedClosingCosts = (Price * ClosePct) / 100;
  const totalUpfrontCashNeeded = downPaymentAmount + estimatedClosingCosts;

  return {
    propertyPrice: Price,
    downPaymentPercent: DownPct,
    downPaymentAmount: +downPaymentAmount.toFixed(2),
    loanRequired: +loanRequired.toFixed(2),
    closingCostPercent: ClosePct,
    estimatedClosingCosts: +estimatedClosingCosts.toFixed(2),
    totalUpfrontCashNeeded: +totalUpfrontCashNeeded.toFixed(2),
  };
};

// -------------------------------------------------------------
// INVESTMENT CALCULATORS
// -------------------------------------------------------------

// 11. Compound Interest Calculator
export const calculateCompoundInterestLogic = (
  principal,
  annualRate,
  tenureYears,
  frequency = 1,
  monthlyDeposit = 0
) => {
  const P = parseFloat(principal);
  const R = parseFloat(annualRate);
  const Y = parseFloat(tenureYears);
  const N = parseInt(frequency, 10) || 1;
  const PMT = parseFloat(monthlyDeposit) || 0;

  if (isNaN(P) || P < 0 || isNaN(R) || R < 0 || isNaN(Y) || Y <= 0) {
    return null;
  }

  const r = R / 100;
  const totalMonths = Math.round(Y * 12);
  const mRate = Math.pow(1 + r / N, N / 12) - 1;

  let currentBalance = P;
  for (let m = 1; m <= totalMonths; m++) {
    currentBalance = currentBalance * (1 + mRate) + PMT;
  }

  const totalDeposited = P + PMT * totalMonths;
  const totalInterest = Math.max(0, currentBalance - totalDeposited);

  return {
    initialPrincipal: P,
    monthlyDeposit: PMT,
    totalDeposited: +totalDeposited.toFixed(2),
    futureValue: +currentBalance.toFixed(2),
    totalInterest: +totalInterest.toFixed(2),
    tenureYears: Y,
    annualRate: R,
    frequency: N,
  };
};

// 12. SIP Calculator (Systematic Investment Plan)
export const calculateSIPLogic = (monthlyInvestment, expectedReturnRate, tenureYears) => {
  const P = parseFloat(monthlyInvestment);
  const R = parseFloat(expectedReturnRate);
  const Y = parseFloat(tenureYears);

  if (isNaN(P) || P <= 0 || isNaN(R) || R <= 0 || isNaN(Y) || Y <= 0) {
    return null;
  }

  const i = R / 100 / 12;
  const n = Y * 12;
  const totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const totalInvested = P * n;
  const estimatedReturns = totalValue - totalInvested;

  return {
    monthlyInvestment: P,
    tenureYears: Y,
    expectedReturnRate: R,
    totalInvested: +totalInvested.toFixed(2),
    estimatedReturns: +estimatedReturns.toFixed(2),
    totalValue: +totalValue.toFixed(2),
  };
};

// 13. ROI Calculator (Return on Investment)
export const calculateROILogic = (initialInvestment, finalValue, durationYears = 1) => {
  const I = parseFloat(initialInvestment);
  const F = parseFloat(finalValue);
  const Y = parseFloat(durationYears) || 1;

  if (isNaN(I) || I <= 0 || isNaN(F) || F < 0) {
    return null;
  }

  const netProfit = F - I;
  const roiPercentage = (netProfit / I) * 100;
  const multiplier = F / I;
  const annualizedRoi = Y > 0 && F > 0 ? (Math.pow(F / I, 1 / Y) - 1) * 100 : roiPercentage;

  return {
    initialInvestment: I,
    finalValue: F,
    durationYears: Y,
    netProfit: +netProfit.toFixed(2),
    roiPercentage: +roiPercentage.toFixed(2),
    annualizedRoi: +annualizedRoi.toFixed(2),
    multiplier: +multiplier.toFixed(2),
  };
};

// 14. FD Calculator (Fixed Deposit)
export const calculateFDLogic = (principal, annualRate, tenureYears, frequency = 4) => {
  const P = parseFloat(principal);
  const R = parseFloat(annualRate);
  const Y = parseFloat(tenureYears);
  const N = parseInt(frequency, 10) || 4;

  if (isNaN(P) || P <= 0 || isNaN(R) || R < 0 || isNaN(Y) || Y <= 0) {
    return null;
  }

  const r = R / 100 / N;
  const totalPeriods = N * Y;
  const maturityAmount = P * Math.pow(1 + r, totalPeriods);
  const totalInterest = maturityAmount - P;

  return {
    principal: P,
    annualRate: R,
    tenureYears: Y,
    compoundingFrequency: N,
    maturityAmount: +maturityAmount.toFixed(2),
    totalInterest: +totalInterest.toFixed(2),
  };
};

// 15. CAGR Calculator (Compound Annual Growth Rate)
export const calculateCAGRLogic = (beginningValue, endingValue, tenureYears) => {
  const BV = parseFloat(beginningValue);
  const EV = parseFloat(endingValue);
  const Y = parseFloat(tenureYears);

  if (isNaN(BV) || BV <= 0 || isNaN(EV) || EV <= 0 || isNaN(Y) || Y <= 0) {
    return null;
  }

  const cagr = (Math.pow(EV / BV, 1 / Y) - 1) * 100;
  const totalGain = EV - BV;
  const absoluteReturn = ((EV - BV) / BV) * 100;

  return {
    beginningValue: BV,
    endingValue: EV,
    tenureYears: Y,
    cagr: +cagr.toFixed(2),
    totalGain: +totalGain.toFixed(2),
    absoluteReturn: +absoluteReturn.toFixed(2),
  };
};

// -------------------------------------------------------------
// TAX & SALARY CALCULATORS
// -------------------------------------------------------------

// 16. Salary Calculator
export const calculateSalaryLogic = (
  grossAmount,
  frequency = 'annual',
  hoursPerWeek = 40,
  weeksPerYear = 52
) => {
  const gross = parseFloat(grossAmount);
  const hours = parseFloat(hoursPerWeek) || 40;
  const weeks = parseFloat(weeksPerYear) || 52;

  if (isNaN(gross) || gross <= 0) {
    return null;
  }

  let annual = gross;
  if (frequency === 'monthly') annual = gross * 12;
  else if (frequency === 'semi-monthly') annual = gross * 24;
  else if (frequency === 'bi-weekly') annual = gross * 26;
  else if (frequency === 'weekly') annual = gross * weeks;
  else if (frequency === 'hourly') annual = gross * hours * weeks;

  const monthly = annual / 12;
  const semiMonthly = annual / 24;
  const biWeekly = annual / 26;
  const weekly = annual / weeks;
  const daily = annual / (weeks * 5);
  const hourly = annual / (weeks * hours);

  return {
    annual: +annual.toFixed(2),
    monthly: +monthly.toFixed(2),
    semiMonthly: +semiMonthly.toFixed(2),
    biWeekly: +biWeekly.toFixed(2),
    weekly: +weekly.toFixed(2),
    daily: +daily.toFixed(2),
    hourly: +hourly.toFixed(2),
    hoursPerWeek: hours,
    weeksPerYear: weeks,
  };
};

// 17. Income Tax Calculator (Progressive Tax Slabs with Cess)
export const calculateIncomeTaxLogic = (grossIncome, deductions = 50000) => {
  const I = parseFloat(grossIncome);
  const D = parseFloat(deductions) || 0;

  if (isNaN(I) || I <= 0) {
    return null;
  }

  const taxableIncome = Math.max(0, I - D);
  let tax = 0;

  // Modern progressive tax brackets (0-3L 0%, 3-7L 5%, 7-10L 10%, 10-12L 15%, 12-15L 20%, >15L 30%)
  if (taxableIncome <= 300000) {
    tax = 0;
  } else if (taxableIncome <= 700000) {
    tax = (taxableIncome - 300000) * 0.05;
    // Full rebate up to 7L
    if (taxableIncome <= 700000) tax = 0;
  } else {
    // 3L - 7L @ 5% = 20,000
    tax += 400000 * 0.05;
    if (taxableIncome <= 1000000) {
      tax += (taxableIncome - 700000) * 0.1;
    } else {
      tax += 300000 * 0.1; // 7L - 10L @ 10% = 30,000
      if (taxableIncome <= 1200000) {
        tax += (taxableIncome - 1000000) * 0.15;
      } else {
        tax += 200000 * 0.15; // 10L - 12L @ 15% = 30,000
        if (taxableIncome <= 1500000) {
          tax += (taxableIncome - 1200000) * 0.2;
        } else {
          tax += 300000 * 0.2; // 12L - 15L @ 20% = 60,000
          tax += (taxableIncome - 1500000) * 0.3; // > 15L @ 30%
        }
      }
    }
  }

  const cess = tax * 0.04;
  const totalTax = tax + cess;
  const effectiveRate = (totalTax / I) * 100;
  const takeHomeAnnual = I - totalTax;
  const takeHomeMonthly = takeHomeAnnual / 12;

  return {
    grossIncome: I,
    deductions: D,
    taxableIncome: +taxableIncome.toFixed(2),
    baseTax: +tax.toFixed(2),
    cess: +cess.toFixed(2),
    totalTax: +totalTax.toFixed(2),
    effectiveRate: +effectiveRate.toFixed(2),
    takeHomeAnnual: +takeHomeAnnual.toFixed(2),
    takeHomeMonthly: +takeHomeMonthly.toFixed(2),
  };
};

// 18. Hourly to Salary Calculator
export const calculateHourlyToSalaryLogic = (
  hourlyWage,
  hoursPerWeek = 40,
  paidWeeks = 52,
  overtimeHours = 0,
  overtimeMultiplier = 1.5
) => {
  const wage = parseFloat(hourlyWage);
  const hours = parseFloat(hoursPerWeek) || 40;
  const weeks = parseFloat(paidWeeks) || 52;
  const otHours = parseFloat(overtimeHours) || 0;
  const otMult = parseFloat(overtimeMultiplier) || 1.5;

  if (isNaN(wage) || wage <= 0) {
    return null;
  }

  const regularWeekly = wage * hours;
  const overtimeWeekly = otHours * (wage * otMult);
  const totalWeekly = regularWeekly + overtimeWeekly;
  const annualSalary = totalWeekly * weeks;
  const monthlySalary = annualSalary / 12;
  const biWeeklySalary = annualSalary / 26;

  return {
    hourlyWage: wage,
    regularWeekly: +regularWeekly.toFixed(2),
    overtimeWeekly: +overtimeWeekly.toFixed(2),
    totalWeekly: +totalWeekly.toFixed(2),
    annualSalary: +annualSalary.toFixed(2),
    monthlySalary: +monthlySalary.toFixed(2),
    biWeeklySalary: +biWeeklySalary.toFixed(2),
  };
};

// 19. Budget Calculator (50 / 30 / 20 Framework)
export const calculateBudgetLogic = (
  monthlyIncome,
  needsAmount = 0,
  wantsAmount = 0,
  savingsAmount = 0
) => {
  const income = parseFloat(monthlyIncome);
  const needs = parseFloat(needsAmount) || 0;
  const wants = parseFloat(wantsAmount) || 0;
  const savings = parseFloat(savingsAmount) || 0;

  if (isNaN(income) || income <= 0) {
    return null;
  }

  const totalSpent = needs + wants + savings;
  const remaining = income - totalSpent;
  const needsPercent = (needs / income) * 100;
  const wantsPercent = (wants / income) * 100;
  const savingsPercent = (savings / income) * 100;

  // Ideal 50/30/20 targets
  const targetNeeds = income * 0.5;
  const targetWants = income * 0.3;
  const targetSavings = income * 0.2;

  return {
    monthlyIncome: income,
    needs: +needs.toFixed(2),
    wants: +wants.toFixed(2),
    savings: +savings.toFixed(2),
    totalSpent: +totalSpent.toFixed(2),
    remaining: +remaining.toFixed(2),
    needsPercent: +needsPercent.toFixed(1),
    wantsPercent: +wantsPercent.toFixed(1),
    savingsPercent: +savingsPercent.toFixed(1),
    targetNeeds: +targetNeeds.toFixed(2),
    targetWants: +targetWants.toFixed(2),
    targetSavings: +targetSavings.toFixed(2),
  };
};

// -------------------------------------------------------------
// HEALTH & FITNESS CALCULATORS
// -------------------------------------------------------------

// 20. Calorie Calculator (Mifflin-St Jeor Formula for BMR & TDEE)
export const calculateCalorieLogic = (
  age,
  gender = 'male',
  weightKg,
  heightCm,
  activityLevel = 'moderate'
) => {
  const A = parseFloat(age);
  const W = parseFloat(weightKg);
  const H = parseFloat(heightCm);

  if (isNaN(A) || A <= 0 || isNaN(W) || W <= 0 || isNaN(H) || H <= 0) {
    return null;
  }

  // BMR Calculation (Mifflin-St Jeor)
  let bmr = 10 * W + 6.25 * H - 5 * A;
  if (gender.toLowerCase() === 'female') {
    bmr -= 161;
  } else {
    bmr += 5;
  }

  // Activity multipliers
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  const mult = multipliers[activityLevel.toLowerCase()] || 1.55;
  const maintenance = Math.round(bmr * mult);

  return {
    bmr: Math.round(bmr),
    maintenanceCalories: maintenance,
    mildWeightLoss: Math.round(maintenance - 250),
    weightLoss: Math.round(maintenance - 500),
    mildWeightGain: Math.round(maintenance + 250),
    weightGain: Math.round(maintenance + 500),
    activityMultiplier: mult,
  };
};

// 21. Ideal Weight Calculator (Devine & Robinson Formulas + Healthy BMI Range)
export const calculateIdealWeightLogic = (heightCm, gender = 'male') => {
  const H = parseFloat(heightCm);
  if (isNaN(H) || H <= 0) return null;

  const heightInches = H / 2.54;
  const inchesOver5Ft = Math.max(0, heightInches - 60);

  // Devine formula
  const devineKg = gender.toLowerCase() === 'female'
    ? 45.5 + 2.3 * inchesOver5Ft
    : 50.0 + 2.3 * inchesOver5Ft;

  // Robinson formula
  const robinsonKg = gender.toLowerCase() === 'female'
    ? 49.0 + 1.7 * inchesOver5Ft
    : 52.0 + 1.9 * inchesOver5Ft;

  // Healthy BMI bounds (18.5 - 24.9)
  const heightM = H / 100;
  const minBmiWeight = 18.5 * (heightM * heightM);
  const maxBmiWeight = 24.9 * (heightM * heightM);

  return {
    heightCm: H,
    devineWeightKg: +devineKg.toFixed(1),
    robinsonWeightKg: +robinsonKg.toFixed(1),
    minHealthyWeightKg: +minBmiWeight.toFixed(1),
    maxHealthyWeightKg: +maxBmiWeight.toFixed(1),
    idealRange: `${minBmiWeight.toFixed(1)} - ${maxBmiWeight.toFixed(1)} kg`,
  };
};

// 22. Body Fat Calculator (U.S. Navy Method)
export const calculateBodyFatLogic = (
  gender = 'male',
  heightCm,
  waistCm,
  neckCm,
  hipCm = 0
) => {
  const H = parseFloat(heightCm);
  const W = parseFloat(waistCm);
  const N = parseFloat(neckCm);
  const Hip = parseFloat(hipCm) || 0;

  if (isNaN(H) || H <= 0 || isNaN(W) || W <= 0 || isNaN(N) || N <= 0) {
    return null;
  }

  let bodyFatPct = 0;
  if (gender.toLowerCase() === 'female') {
    if (W + Hip - N <= 0) return null;
    bodyFatPct =
      495 / (1.29579 - 0.35004 * Math.log10(W + Hip - N) + 0.22100 * Math.log10(H)) - 450;
  } else {
    if (W - N <= 0) return null;
    bodyFatPct =
      495 / (1.0324 - 0.19077 * Math.log10(W - N) + 0.15456 * Math.log10(H)) - 450;
  }

  bodyFatPct = Math.max(2, Math.min(65, bodyFatPct));

  // Category determination
  let category = 'Normal';
  if (gender.toLowerCase() === 'female') {
    if (bodyFatPct < 14) category = 'Essential Fat';
    else if (bodyFatPct < 21) category = 'Athletes';
    else if (bodyFatPct < 25) category = 'Fitness';
    else if (bodyFatPct < 32) category = 'Average';
    else category = 'Obese';
  } else {
    if (bodyFatPct < 6) category = 'Essential Fat';
    else if (bodyFatPct < 14) category = 'Athletes';
    else if (bodyFatPct < 18) category = 'Fitness';
    else if (bodyFatPct < 25) category = 'Average';
    else category = 'Obese';
  }

  return {
    bodyFatPercentage: +bodyFatPct.toFixed(1),
    category,
    fatMassPercentage: +bodyFatPct.toFixed(1),
    leanMassPercentage: +(100 - bodyFatPct).toFixed(1),
  };
};

// 23. Pregnancy Due Date Calculator (Naegele's Rule: LMP + 280 Days)
export const calculatePregnancyDueDateLogic = (lmpDateString) => {
  if (!lmpDateString) return null;
  const lmp = new Date(lmpDateString);
  if (isNaN(lmp.getTime())) return null;

  // Add 280 days (40 weeks)
  const dueDate = new Date(lmp);
  dueDate.setDate(dueDate.getDate() + 280);

  const today = new Date();
  const diffMs = today.getTime() - lmp.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const currentWeeks = Math.max(0, Math.floor(diffDays / 7));
  const currentDaysRem = Math.max(0, diffDays % 7);

  const daysRemaining = Math.max(0, 280 - diffDays);

  let trimester = 'First Trimester (Weeks 1-12)';
  if (currentWeeks >= 27) {
    trimester = 'Third Trimester (Weeks 27-40)';
  } else if (currentWeeks >= 13) {
    trimester = 'Second Trimester (Weeks 13-26)';
  }

  return {
    dueDate: dueDate.toISOString().split('T')[0],
    dueDateFormatted: dueDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    currentWeeks,
    currentDays: currentDaysRem,
    daysRemaining,
    trimester,
  };
};

// 24. Water Intake Calculator
export const calculateWaterIntakeLogic = (weightKg, activityMinutes = 30) => {
  const W = parseFloat(weightKg);
  const act = parseFloat(activityMinutes) || 0;

  if (isNaN(W) || W <= 0) return null;

  // Base requirement: 35ml per kg of body weight
  const baseMl = W * 35;
  // Exercise extra: 350ml for every 30 minutes of activity
  const exerciseMl = (act / 30) * 350;
  const totalMl = baseMl + exerciseMl;
  const totalLiters = totalMl / 1000;
  const totalGlasses = Math.round(totalMl / 250); // 250ml per glass

  return {
    weightKg: W,
    activityMinutes: act,
    litersPerDay: +totalLiters.toFixed(2),
    millilitersPerDay: Math.round(totalMl),
    glassesPerDay: totalGlasses,
  };
};

// 25. Sleep Calculator (90-Minute Sleep Cycles & 15m Fall-Asleep Latency)
export const calculateSleepLogic = (timeString = '07:00', mode = 'wake') => {
  // mode: 'wake' => calculate when to sleep to wake up at timeString
  // mode: 'bed' => calculate when to wake up if going to bed at timeString
  if (!timeString) return null;

  const [hours, minutes] = timeString.split(':').map((v) => parseInt(v, 10));
  if (isNaN(hours) || isNaN(minutes)) return null;

  const targetDate = new Date();
  targetDate.setHours(hours, minutes, 0, 0);

  const cycleMinutes = 90;
  const latencyMinutes = 15;

  const cycles = [6, 5, 4, 3]; // 9 hrs, 7.5 hrs, 6 hrs, 4.5 hrs
  const suggestions = cycles.map((c) => {
    const calcDate = new Date(targetDate);
    if (mode === 'wake') {
      // Subtract (c * 90m + 15m)
      calcDate.setMinutes(calcDate.getMinutes() - (c * cycleMinutes + latencyMinutes));
    } else {
      // Add 15m + (c * 90m)
      calcDate.setMinutes(calcDate.getMinutes() + (latencyMinutes + c * cycleMinutes));
    }

    const timeStr = calcDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return {
      cycles: c,
      hours: (c * 1.5).toFixed(1),
      time: timeStr,
      isRecommended: c === 5,
    };
  });

  return {
    targetTime: timeString,
    mode,
    suggestions,
  };
};

// 26. Target Heart Rate Calculator (Karvonen & Haskell-Fox Formulas)
export const calculateTargetHeartRateLogic = (age, restingHeartRate = 70) => {
  const A = parseFloat(age);
  const RHR = parseFloat(restingHeartRate) || 70;

  if (isNaN(A) || A <= 0 || A > 120) return null;

  const maxHeartRate = 220 - A;
  const hrr = Math.max(0, maxHeartRate - RHR);

  const zone1Min = Math.round(RHR + hrr * 0.50);
  const zone1Max = Math.round(RHR + hrr * 0.60);

  const zone2Min = Math.round(RHR + hrr * 0.60);
  const zone2Max = Math.round(RHR + hrr * 0.70);

  const zone3Min = Math.round(RHR + hrr * 0.70);
  const zone3Max = Math.round(RHR + hrr * 0.80);

  const zone4Min = Math.round(RHR + hrr * 0.80);
  const zone4Max = Math.round(RHR + hrr * 0.90);

  const zone5Min = Math.round(RHR + hrr * 0.90);
  const zone5Max = maxHeartRate;

  return {
    age: A,
    restingHeartRate: RHR,
    maxHeartRate,
    zone1: { name: 'Warm Up / Recovery (50-60%)', range: `${zone1Min} - ${zone1Max} bpm` },
    zone2: { name: 'Fat Burn / Base Endurance (60-70%)', range: `${zone2Min} - ${zone2Max} bpm`, isHighlight: true },
    zone3: { name: 'Aerobic / Cardio (70-80%)', range: `${zone3Min} - ${zone3Max} bpm` },
    zone4: { name: 'Anaerobic / Threshold (80-90%)', range: `${zone4Min} - ${zone4Max} bpm` },
    zone5: { name: 'VO2 Max / Redline (90-100%)', range: `${zone5Min} - ${zone5Max} bpm` },
  };
};
