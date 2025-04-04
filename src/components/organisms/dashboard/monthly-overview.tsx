"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { useTransactions } from "@/contexts/transactions-context";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { TransactionType } from "@/types";
import {
  Utensils,
  Car,
  Gamepad2,
  Lightbulb,
  Home,
  Shirt,
  Heart,
  GraduationCap,
  ShoppingBag,
  CircleDollarSign,
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  HelpCircle,
} from "lucide-react";

const ICONS = {
  Utensils,
  Car,
  Gamepad2,
  Lightbulb,
  Home,
  Shirt,
  Heart,
  GraduationCap,
  ShoppingBag,
  CircleDollarSign,
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  HelpCircle,
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-4 shadow-lg">
        <p className="mb-2 font-semibold">{label}</p>
        {payload.map((entry: any, index: number) => {
          const isIncome = entry.name === "Income";
          const Icon = isIncome ? ICONS[INCOME_CATEGORIES[0].icon as keyof typeof ICONS] : ICONS[EXPENSE_CATEGORIES[0].icon as keyof typeof ICONS];
          
          return (
            <div key={index} className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div style={{ color: entry.color }}>
                  <Icon size={16} />
                </div>
                <span className="text-sm text-muted-foreground">
                  {entry.name}
                </span>
              </div>
              <span className="font-medium" style={{ color: entry.color }}>
                ${entry.value.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export function MonthlyOverview() {
  const { transactions } = useTransactions();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const totalIncome = monthlyTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthlyTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-card p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Receitas do Mês</h2>
        <p className="text-2xl font-bold text-green-600">
          {formatCurrency(totalIncome)}
        </p>
      </div>
      <div className="bg-card p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Despesas do Mês</h2>
        <p className="text-2xl font-bold text-red-600">
          {formatCurrency(totalExpenses)}
        </p>
      </div>
      <div className="bg-card p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Saldo do Mês</h2>
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