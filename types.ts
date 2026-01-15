
export type RateType = 'monthly' | 'yearly';
export type PeriodType = 'months' | 'years';

export interface SimulationInputs {
  initialAmount: number;
  monthlyContribution: number;
  interestRate: number;
  rateType: RateType;
  period: number;
  periodType: PeriodType;
}

export interface SimulationResult {
  month: number;
  totalInvested: number;
  totalInterest: number;
  totalAmount: number;
  monthlyContribution: number;
}

export interface SummaryData {
  totalAmount: number;
  totalInvested: number;
  totalInterest: number;
  yieldPercentage: number;
}
