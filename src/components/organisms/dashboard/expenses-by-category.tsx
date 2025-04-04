"use client";

import { useTransactions } from "@/contexts/transactions-context";
import { formatCurrency } from "@/lib/utils";
import { TransactionType } from "@/types";
import { EXPENSE_CATEGORIES, CategoryConstant } from "@/lib/constants";
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
  HelpCircle,
};

export function ExpensesByCategory() {
  const { transactions } = useTransactions();

  const expensesByCategory = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, t) => {
      const categoryId = t.categoryId || "other";
      const category = EXPENSE_CATEGORIES.find((c: CategoryConstant) => c.id === categoryId);
      if (!category) return acc;
      
      if (!acc[category.id]) {
        acc[category.id] = {
          name: category.name,
          amount: 0,
          color: category.color,
          icon: category.icon,
        };
      }
      acc[category.id].amount += t.amount;
      return acc;
    }, {} as Record<string, { name: string; amount: number; color: string; icon: string }>);

  const totalExpenses = Object.values(expensesByCategory).reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <div className="bg-card p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Despesas por Categoria</h2>
      <div className="space-y-4">
        {Object.entries(expensesByCategory).map(([categoryId, { name, amount, color, icon }]) => {
          const percentage = ((amount / totalExpenses) * 100).toFixed(1);
          const Icon = ICONS[icon as keyof typeof ICONS];
          return (
            <div key={categoryId} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" style={{ color }} />
                  <span className="text-sm font-medium">{name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(amount)} ({percentage}%)
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${percentage}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 