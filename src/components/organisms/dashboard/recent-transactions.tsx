"use client";

import { useTransactions } from "@/contexts/transactions-context";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TransactionType } from "@/types";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, CategoryConstant } from "@/lib/constants";
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

export function RecentTransactions() {
  const { transactions, isLoading } = useTransactions();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhuma transação encontrada.</p>
      </div>
    );
  }

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="bg-card rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-4 px-6">Data</th>
              <th className="text-left py-4 px-6">Descrição</th>
              <th className="text-left py-4 px-6">Categoria</th>
              <th className="text-left py-4 px-6">Tipo</th>
              <th className="text-right py-4 px-6">Valor</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((transaction) => {
              const category = transaction.type === "INCOME"
                ? INCOME_CATEGORIES.find((c: CategoryConstant) => c.id === transaction.categoryId)
                : EXPENSE_CATEGORIES.find((c: CategoryConstant) => c.id === transaction.categoryId);

              const Icon = category ? ICONS[category.icon as keyof typeof ICONS] : HelpCircle;

              return (
                <tr key={transaction.id} className="border-b">
                  <td className="py-4 px-6">{formatDate(transaction.date)}</td>
                  <td className="py-4 px-6">{transaction.description}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" style={{ color: category?.color }} />
                      <span>{category?.name || "Outros"}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        transaction.type === "INCOME"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.type === "INCOME" ? "Receita" : "Despesa"}
                    </span>
                  </td>
                  <td
                    className={`py-4 px-6 text-right ${
                      transaction.type === "INCOME"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(transaction.amount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 