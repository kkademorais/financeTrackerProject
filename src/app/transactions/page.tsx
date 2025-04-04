"use client";

import { useState } from "react";
import { useTransactions } from "@/contexts/transactions-context";
import { QuickAddTransaction } from "@/components/molecules/quick-add-transaction";
import { Button } from "@/components/atoms/ui/button";
import { Plus } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants";

export default function TransactionsPage() {
  const { transactions, isLoading, addTransaction } = useTransactions();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Transações</h1>
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
                {transactions.map((transaction) => {
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