import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
  locale: string = "en-US"
): string {
  const dateToFormat = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateToFormat);
}

export function calculateTotalsByType(transactions: any[]) {
  return transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "INCOME") {
        acc.income += transaction.amount;
      } else {
        acc.expense += transaction.amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );
}

export function calculateBalance(transactions: any[]) {
  const totals = calculateTotalsByType(transactions);
  return totals.income - totals.expense;
}

export function groupTransactionsByDate(transactions: any[]) {
  return transactions.reduce((grouped, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString();
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
    return grouped;
  }, {});
}

export function groupTransactionsByCategory(transactions: any[]) {
  return transactions.reduce((grouped, transaction) => {
    const categoryId = transaction.categoryId || "uncategorized";
    if (!grouped[categoryId]) {
      grouped[categoryId] = {
        total: 0,
        transactions: [],
        category: transaction.category || { id: "uncategorized", name: "Uncategorized" },
      };
    }
    grouped[categoryId].total += transaction.amount;
    grouped[categoryId].transactions.push(transaction);
    return grouped;
  }, {});
}

export function calculateMonthlyTotals(transactions: any[], months: number = 6) {
  const now = new Date();
  const result = [];

  for (let i = 0; i < months; i++) {
    const currentMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = currentMonth.toLocaleString("default", { month: "short" });
    const year = currentMonth.getFullYear();

    const monthTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === currentMonth.getMonth() &&
        transactionDate.getFullYear() === currentMonth.getFullYear()
      );
    });

    const { income, expense } = calculateTotalsByType(monthTransactions);

    result.push({
      month: `${monthName} ${year}`,
      income,
      expense,
      balance: income - expense,
    });
  }

  return result.reverse();
} 