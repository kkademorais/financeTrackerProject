"use client";

import { useTransactions } from "@/contexts/transactions-context";
import { QuickAddTransaction } from "@/components/molecules/quick-add-transaction";
import { Button } from "@/components/atoms/ui/button";
import { Plus } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useState } from "react";
import { TransactionType } from "@/types";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants";

export default function HomePage() {
  const { transactions, isLoading, addTransaction } = useTransactions();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="container mx-auto py-8">
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

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Últimas Transações</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma transação encontrada.</p>
        </div>
      ) : (
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
                {transactions.slice(0, 5).map((transaction) => {
                  const category = transaction.type === "INCOME"
                    ? INCOME_CATEGORIES.find(c => c.id === transaction.categoryId)
                    : EXPENSE_CATEGORIES.find(c => c.id === transaction.categoryId);
                  
                  return (
                    <tr key={transaction.id} className="border-b">
                      <td className="py-4 px-6">{formatDate(transaction.date)}</td>
                      <td className="py-4 px-6">{transaction.description}</td>
                      <td className="py-4 px-6">{category?.name || "Outros"}</td>
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
      )}

      <QuickAddTransaction
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddTransaction={addTransaction}
      />
    </div>
  );
} 