"use client";

import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useFetchTransactions } from "@/hooks/use-fetch-transactions";
import { Transaction } from "@/types";

interface RecentTransactionsProps {
  isLoading?: boolean;
  limit?: number;
}

export function RecentTransactions({ isLoading = false, limit = 5 }: RecentTransactionsProps) {
  const { data: transactions, isLoading: isLoadingTransactions } = useFetchTransactions({
    limit,
  });

  const isDataLoading = isLoading || isLoadingTransactions;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest financial activities</CardDescription>
      </CardHeader>
      <CardContent>
        {isDataLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b last:border-0 animate-pulse"
            >
              <div className="flex flex-col gap-1">
                <div className="h-4 w-40 bg-muted rounded"></div>
                <div className="h-3 w-20 bg-muted rounded"></div>
              </div>
              <div className="h-5 w-16 bg-muted rounded"></div>
            </div>
          ))
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions found.
          </div>
        ) : (
          <>
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </>
        )}
      </CardContent>
      <CardFooter>
        <Link
          href="/transactions"
          className="flex items-center text-sm text-primary hover:underline"
        >
          View all transactions
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const isIncome = transaction.type === "INCOME";
  const formattedDate = formatDate(transaction.date, { month: "short", day: "numeric" });

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex gap-3 items-center">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            isIncome
              ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {isIncome ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
        </div>
        <div>
          <p className="text-sm font-medium">{transaction.description}</p>
          <p className="text-xs text-muted-foreground">
            {formattedDate} • {transaction.category?.name || (isIncome ? "Income" : "Expense")}
          </p>
        </div>
      </div>
      <div
        className={`text-sm font-medium ${
          isIncome ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
        }`}
      >
        {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
      </div>
    </div>
  );
} 