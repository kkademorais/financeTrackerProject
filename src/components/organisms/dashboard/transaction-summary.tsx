"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { useTransactions } from "@/contexts/transactions-context";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { TransactionType } from "@/types";

const CATEGORIES = [
  { id: "food", name: "Food & Dining", color: "#4CAF50" },
  { id: "transport", name: "Transportation", color: "#2196F3" },
  { id: "entertainment", name: "Entertainment", color: "#E91E63" },
  { id: "utilities", name: "Utilities", color: "#673AB7" },
  { id: "home", name: "Housing", color: "#FF5722" },
  { id: "personal", name: "Personal Care", color: "#9C27B0" },
  { id: "health", name: "Health", color: "#00BCD4" },
  { id: "education", name: "Education", color: "#FFC107" },
  { id: "shopping", name: "Shopping", color: "#795548" },
  { id: "other", name: "Other", color: "#607D8B" },
];

const INCOME_CATEGORIES = [
  { id: "salary", name: "Salary", color: "#4CAF50" },
  { id: "freelance", name: "Freelance", color: "#2196F3" },
  { id: "investments", name: "Investments", color: "#E91E63" },
  { id: "gifts", name: "Gifts", color: "#673AB7" },
  { id: "other", name: "Other", color: "#607D8B" },
];

export function TransactionSummary() {
  const { transactions } = useTransactions();

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-card p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Receitas</h2>
        <p className="text-2xl font-bold text-green-600">
          {formatCurrency(totalIncome)}
        </p>
      </div>
      <div className="bg-card p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Despesas</h2>
        <p className="text-2xl font-bold text-red-600">
          {formatCurrency(totalExpenses)}
        </p>
      </div>
      <div className="bg-card p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Saldo</h2>
        <p
          className={`text-2xl font-bold ${
            balance >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {formatCurrency(balance)}
        </p>
      </div>
    </div>
  );
} 