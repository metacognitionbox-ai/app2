
import { Debt, StrategyType } from "../types";

export const calculateTotalDebt = (debts: Debt[]) => {
  return debts.reduce((acc, debt) => acc + debt.remainingAmount, 0);
};

export const calculateTotalInitialDebt = (debts: Debt[]) => {
  return debts.reduce((acc, debt) => acc + debt.totalAmount, 0);
};

export const calculateProgressPercentage = (debts: Debt[]) => {
  const initial = calculateTotalInitialDebt(debts);
  const remaining = calculateTotalDebt(debts);
  if (initial === 0) return 0;
  return Math.round(((initial - remaining) / initial) * 100);
};

export const getSortedDebts = (debts: Debt[], strategy: StrategyType) => {
  return [...debts].sort((a, b) => {
    if (strategy === 'snowball') {
      return a.remainingAmount - b.remainingAmount;
    } else {
      return b.interestRate - a.interestRate;
    }
  });
};
