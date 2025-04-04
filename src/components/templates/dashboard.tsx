"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useScroll } from "framer-motion";
import { PieChart, BarChart3, Plus } from "lucide-react";

import { TransactionSummary } from "@/components/organisms/dashboard/transaction-summary";
import { RecentTransactions } from "@/components/organisms/dashboard/recent-transactions";
import { ExpensesByCategory } from "@/components/organisms/dashboard/expenses-by-category";
import { MonthlyOverview } from "@/components/organisms/dashboard/monthly-overview";
import { QuickAddTransaction } from "@/components/organisms/dashboard/quick-add-transaction";
import { TransactionCalendar } from "@/components/organisms/dashboard/transaction-calendar";
import { Header } from "@/components/organisms/navigation/header";
import { WelcomeCard } from "@/components/organisms/onboarding/welcome-card";
import { useOnboarding } from "@/hooks/use-onboarding";
import { TransactionsProvider } from "@/contexts/transactions-context";
import { useTransactions } from "@/contexts/transactions-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card";

function EmptyState({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-muted-foreground">
      <Icon className="h-12 w-12 opacity-20" />
      <p className="mt-2 text-sm">Add transactions to see your {title}</p>
    </div>
  );
}

function DashboardContent() {
  const { data: session } = useSession();
  const { showOnboarding, completeOnboarding } = useOnboarding();
  const { transactions } = useTransactions();
  const { scrollY } = useScroll();

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={session?.user || null} />
      <main className="container mx-auto flex-1 space-y-8 p-4 md:p-8 pt-6">
        {showOnboarding ? (
          <WelcomeCard onComplete={completeOnboarding} />
        ) : (
          <>
            <TransactionSummary />
            <div className="grid gap-8 lg:grid-cols-12">
              {/* Coluna da esquerda - Quick Add e Recent Transactions */}
              <div className="lg:col-span-5 space-y-8">
                <motion.div
                  className="shadow-lg hover:shadow-xl transition-shadow rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <QuickAddTransaction />
                </motion.div>
                
                {/* Grid para Recent Transactions e Transaction Activity */}
                <div className="grid gap-8">
                  <motion.div
                    className="shadow-lg hover:shadow-xl transition-shadow rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <RecentTransactions />
                  </motion.div>
                  <motion.div
                    className="shadow-lg hover:shadow-xl transition-shadow rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <TransactionCalendar />
                  </motion.div>
                </div>
              </div>

              {/* Coluna da direita - Gráficos */}
              <div className="lg:col-span-7">
                <div className="grid gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="shadow-lg hover:shadow-xl transition-shadow rounded-lg overflow-hidden h-[400px]"
                  >
                    {transactions.length > 0 ? (
                      <MonthlyOverview />
                    ) : (
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle>Monthly Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <EmptyState icon={BarChart3} title="monthly overview" />
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="shadow-lg hover:shadow-xl transition-shadow rounded-lg overflow-hidden h-[400px]"
                  >
                    {transactions.length > 0 ? (
                      <ExpensesByCategory />
                    ) : (
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle>Expenses by Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <EmptyState icon={PieChart} title="expense breakdown" />
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export function Dashboard() {
  const { data: session } = useSession();
  const { showOnboarding, completeOnboarding } = useOnboarding();

  return (
    <TransactionsProvider>
      <DashboardContent />
    </TransactionsProvider>
  );
} 