"use client";

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { useFetchTransactions } from "@/hooks/use-fetch-transactions";
import { calculateMonthlyTotals, formatCurrency } from "@/lib/utils";

// Registrar os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyOverviewProps {
  isLoading?: boolean;
  months?: number;
}

export function MonthlyOverview({ isLoading = false, months = 6 }: MonthlyOverviewProps) {
  const { data: transactions, isLoading: isLoadingTransactions } = useFetchTransactions();

  const monthlyData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    return calculateMonthlyTotals(transactions, months);
  }, [transactions, months]);

  const chartData = useMemo(() => {
    if (!monthlyData.length) {
      return {
        labels: [],
        datasets: [],
      };
    }

    return {
      labels: monthlyData.map((d) => d.month),
      datasets: [
        {
          label: "Income",
          data: monthlyData.map((d) => d.income),
          backgroundColor: "rgba(34, 197, 94, 0.6)",
          borderColor: "rgb(34, 197, 94)",
          borderWidth: 1,
        },
        {
          label: "Expenses",
          data: monthlyData.map((d) => d.expense),
          backgroundColor: "rgba(239, 68, 68, 0.6)",
          borderColor: "rgb(239, 68, 68)",
          borderWidth: 1,
        },
        {
          label: "Balance",
          data: monthlyData.map((d) => d.balance),
          backgroundColor: "rgba(59, 130, 246, 0.6)",
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 1,
        },
      ],
    };
  }, [monthlyData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
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
            return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: number) {
            return formatCurrency(value, "USD", "en-US", { 
              notation: "compact",
              compactDisplay: "short",
            });
          },
        },
      },
    },
  };

  const isDataLoading = isLoading || isLoadingTransactions;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
        <CardDescription>Your income and expenses for the last {months} months</CardDescription>
      </CardHeader>
      <CardContent>
        {isDataLoading ? (
          <div className="h-[300px] animate-pulse flex items-center justify-center">
            <div className="w-full h-48 bg-muted rounded"></div>
          </div>
        ) : !monthlyData.length ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No data available for the selected period
          </div>
        ) : (
          <div className="h-[300px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        )}
      </CardContent>
    </Card>
  );
} 