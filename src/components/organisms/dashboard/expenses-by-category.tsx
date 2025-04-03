"use client";

import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { useFetchTransactions } from "@/hooks/use-fetch-transactions";
import { formatCurrency, groupTransactionsByCategory } from "@/lib/utils";

// Registrar os componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpensesByCategoryProps {
  isLoading?: boolean;
}

export function ExpensesByCategory({ isLoading = false }: ExpensesByCategoryProps) {
  const { data: transactions, isLoading: isLoadingTransactions } = useFetchTransactions({
    type: "EXPENSE",
  });

  const categoryData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        grouped: {},
        total: 0,
      };
    }

    const grouped = groupTransactionsByCategory(transactions);
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);

    return {
      grouped,
      total,
    };
  }, [transactions]);

  const chartData = useMemo(() => {
    const categories = Object.values(categoryData.grouped);
    
    return {
      labels: categories.map((c) => c.category.name),
      datasets: [
        {
          data: categories.map((c) => c.total),
          backgroundColor: categories.map((c) => c.category.color || "#ccc"),
          borderColor: "hsl(var(--background))",
          borderWidth: 2,
        },
      ],
    };
  }, [categoryData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          boxHeight: 10,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.raw;
            const percentage = ((value / categoryData.total) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "65%",
  };

  const isDataLoading = isLoading || isLoadingTransactions;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
        <CardDescription>
          How you have spent your money
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isDataLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="w-32 h-32 rounded-full animate-pulse bg-muted"></div>
          </div>
        ) : !transactions.length ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No expense data available
          </div>
        ) : (
          <div className="h-[300px] relative">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold">
                {formatCurrency(categoryData.total)}
              </span>
              <span className="text-sm text-muted-foreground">Total Expenses</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 