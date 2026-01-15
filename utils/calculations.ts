
import { SimulationInputs, SimulationResult, SummaryData } from '../types';

export const calculateCompoundInterest = (inputs: SimulationInputs): SimulationResult[] => {
  const { initialAmount, monthlyContribution, interestRate, rateType, period, periodType } = inputs;

  const totalMonths = periodType === 'years' ? period * 12 : period;
  
  // Convert interest rate to monthly decimal
  let monthlyRate: number;
  if (rateType === 'yearly') {
    // Equivalent monthly rate from yearly: (1 + i_a)^(1/12) - 1
    monthlyRate = Math.pow(1 + interestRate / 100, 1 / 12) - 1;
  } else {
    monthlyRate = interestRate / 100;
  }

  const results: SimulationResult[] = [];
  let currentTotal = initialAmount;
  let currentInvested = initialAmount;
  let currentInterest = 0;

  // Month 0
  results.push({
    month: 0,
    totalInvested: currentInvested,
    totalInterest: currentInterest,
    totalAmount: currentTotal,
    monthlyContribution: 0,
  });

  for (let i = 1; i <= totalMonths; i++) {
    const interestThisMonth = currentTotal * monthlyRate;
    currentTotal += interestThisMonth + monthlyContribution;
    currentInvested += monthlyContribution;
    currentInterest += interestThisMonth;

    results.push({
      month: i,
      totalInvested: Number(currentInvested.toFixed(2)),
      totalInterest: Number(currentInterest.toFixed(2)),
      totalAmount: Number(currentTotal.toFixed(2)),
      monthlyContribution: monthlyContribution,
    });
  }

  return results;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const getSummary = (results: SimulationResult[]): SummaryData => {
  const last = results[results.length - 1];
  return {
    totalAmount: last.totalAmount,
    totalInvested: last.totalInvested,
    totalInterest: last.totalInterest,
    yieldPercentage: (last.totalInterest / last.totalInvested) * 100,
  };
};
