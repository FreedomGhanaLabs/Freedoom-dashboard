// src/lib/types/Finance.ts

export interface FinancialMetrics {
  totalTransactions: number;
  totalExpenseEntries: number;
  totalDays: number;
  averageDailyEarnings: number;
  averageDailyExpenses: number;
  profitMargin: number;
}

export interface MonthlyTrend {
  month: string;
  earnings: number;
  expenses: number;
  netProfit: number;
}

export interface FinancialData {
  totalEarnings: number;
  totalExpenses: number;
  netProfit: number;
  metrics: FinancialMetrics;
  monthlyTrends: MonthlyTrend[];
}

export interface FinancialApiResponse {
  data: FinancialData;
  success: boolean;
  message?: string;
}

// Utility functions for financial calculations
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

export const getStatusColor = (value: number): string => {
  if (value > 0) return 'text-emerald-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-600';
};

export const getBackgroundColor = (value: number): string => {
  if (value > 0) return 'bg-emerald-50 border-emerald-200';
  if (value < 0) return 'bg-red-50 border-red-200';
  return 'bg-gray-50 border-gray-200';
};