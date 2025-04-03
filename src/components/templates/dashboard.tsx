"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

import { TransactionSummary } from "@/components/organisms/dashboard/transaction-summary";
import { RecentTransactions } from "@/components/organisms/dashboard/recent-transactions";
import { ExpensesByCategory } from "@/components/organisms/dashboard/expenses-by-category";
import { MonthlyOverview } from "@/components/organisms/dashboard/monthly-overview";
import { QuickAddTransaction } from "@/components/organisms/dashboard/quick-add-transaction";
import { Header } from "@/components/organisms/navigation/header";

export function Dashboard() {
  const { data: session } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTransactionAdded = async () => {
    setIsRefreshing(true);
    // In a real app, this would refresh the data
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={session?.user} />
      
      <main className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Financial Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <TransactionSummary isLoading={isRefreshing} />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <div className="col-span-2">
            <MonthlyOverview isLoading={isRefreshing} />
          </div>
          <div>
            <QuickAddTransaction onTransactionAdded={handleTransactionAdded} />
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <div>
            <ExpensesByCategory isLoading={isRefreshing} />
          </div>
          <div>
            <RecentTransactions isLoading={isRefreshing} />
          </div>
        </div>
      </main>
    </div>
  );
} 