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
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Preparar dados para o gráfico
  const chartData = daysInMonth.map(date => {
    const dayTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return format(transactionDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
    });

    const income = dayTransactions
      .filter(t => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = dayTransactions
      .filter(t => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      date: format(date, "dd/MM", { locale: ptBR }),
      income,
      expense,
    };
  });

  // Calcular totais do mês
  const monthlyIncome = transactions
    .filter(t => {
      const date = new Date(t.date);
      return date >= monthStart && date <= monthEnd && t.type === "INCOME";
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = transactions
    .filter(t => {
      const date = new Date(t.date);
      return date >= monthStart && date <= monthEnd && t.type === "EXPENSE";
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = monthlyIncome - monthlyExpense;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Receitas do Mês</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(monthlyIncome)}
          </p>
        </div>
        <div className="rounded-lg bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Despesas do Mês</p>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(monthlyExpense)}
          </p>
        </div>
        <div className="rounded-lg bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Saldo do Mês</p>
          <p className={`text-2xl font-bold ${
            balance >= 0 ? "text-green-600" : "text-red-600"
          }`}>
            {formatCurrency(balance)}
          </p>
        </div>
          </div>

      <div className="rounded-lg bg-card p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis 
              dataKey="date" 
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$${value}`}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Data: ${label}`}
            />
            <Legend />
            <Bar
              dataKey="income"
              name="Receitas"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="expense"
              name="Despesas"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
          </div>
          </div>
  );
} 