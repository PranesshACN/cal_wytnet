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
