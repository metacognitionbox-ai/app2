
export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  interestRate: number;
  minimumPayment: number;
  category: 'Credit Card' | 'Loan' | 'Mortgage' | 'Other';
}

export interface PaymentPlan {
  totalMonths: number;
  totalInterestPaid: number;
  payoffDate: Date;
  monthlySchedule: Array<{
    month: number;
    payment: number;
    remaining: number;
  }>;
}

export type StrategyType = 'snowball' | 'avalanche';

export interface AIAdvice {
  summary: string;
  recommendations: string[];
  estimatedFreedomDate: string;
}
