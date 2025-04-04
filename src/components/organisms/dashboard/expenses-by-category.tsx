"use client";

import { useTransactions } from "@/contexts/transactions-context";
import { formatCurrency } from "@/lib/utils";
import { useCategories } from "@/hooks/use-categories";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
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

interface ChartDataItem {
  id: string;
  name: string;
  value: number;
  color: string;
  icon: string;
  percentage?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const Icon = ICONS[data.icon as keyof typeof ICONS] || HelpCircle;
    
    return (
      <div className="rounded-lg border bg-background p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-4 w-4" style={{ color: data.color }} />
          <span className="font-semibold">{data.name}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {formatCurrency(data.value)} ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

export function ExpensesByCategory() {
  const { transactions } = useTransactions();
  const { expenseCategories } = useCategories();

  const expensesByCategory = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, t) => {
      const category = expenseCategories.find(c => c.id === t.categoryId);
      if (!category) return acc;
      
      if (!acc[category.id]) {
        acc[category.id] = {
          id: category.id,
          name: category.name,
          value: 0,
          color: category.color,
          icon: category.icon,
        };
      }
      acc[category.id].value += t.amount;
      return acc;
    }, {} as Record<string, ChartDataItem>);

  const chartData = Object.values(expensesByCategory);
  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0);

  // Adicionar porcentagem aos dados
  chartData.forEach(item => {
    item.percentage = ((item.value / totalExpenses) * 100).toFixed(1);
  });

  // Ordenar por valor (maior para menor)
  chartData.sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      {/* Gráfico de Pizza */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell key={entry.id} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
          </div>

      {/* Lista de Categorias */}
      <div className="space-y-4">
        {chartData.map(({ id, name, value, color, icon, percentage }) => {
          const Icon = ICONS[icon as keyof typeof ICONS] || HelpCircle;
          return (
            <div key={id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" style={{ color }} />
                  <span className="text-sm font-medium">{name}</span>
          </div>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(value)} ({percentage}%)
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