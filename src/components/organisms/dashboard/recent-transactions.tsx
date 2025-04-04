"use client";

import { useTransactions } from "@/contexts/transactions-context";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useCategories } from "@/hooks/use-categories";
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
import { Skeleton } from "@/components/atoms/ui/skeleton";

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

export function RecentTransactions() {
  const { transactions, isLoading } = useTransactions();
  const { expenseCategories, incomeCategories } = useCategories();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhuma transação encontrada.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Adicione uma nova transação para começar.
        </p>
      </div>
    );
  }

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4">
      {recentTransactions.map((transaction) => {
        const category = transaction.type === "INCOME"
          ? incomeCategories.find(c => c.id === transaction.categoryId)
          : expenseCategories.find(c => c.id === transaction.categoryId);

        const Icon = category?.icon ? ICONS[category.icon as keyof typeof ICONS] : HelpCircle;

        return (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className="p-2 rounded-full"
                style={{ backgroundColor: category?.color + "20" }}
              >
                <Icon
                  className="h-5 w-5"
                  style={{ color: category?.color }}
                />
              </div>
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-muted-foreground">
                  {category?.name} • {formatDate(transaction.date)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-medium ${
                transaction.type === "INCOME"
                  ? "text-green-600"
                  : "text-red-600"
              }`}>
                {transaction.type === "INCOME" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </p>
              <p className="text-xs text-muted-foreground">
                {transaction.type === "INCOME" ? "Receita" : "Despesa"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
} 