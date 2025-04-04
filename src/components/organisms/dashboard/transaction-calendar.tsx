"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Button } from "@/components/atoms/ui/button";
import { useTransactions } from "@/contexts/transactions-context";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, isSameMonth, isSameYear } from "date-fns";

function getActivityLevel(count: number, maxCount: number): number {
  if (count === 0) return 0;
  const ratio = count / maxCount;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

export function TransactionCalendar() {
  const { transactions } = useTransactions();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Navegar para o mês anterior
  const previousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  // Navegar para o próximo mês
  const nextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };
  
  // Criar array com todos os dias do mês atual
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
    return {
      date,
      dayOfMonth: i + 1,
      transactions: transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getDate() === (i + 1) && 
               isSameMonth(tDate, currentDate) && 
               isSameYear(tDate, currentDate);
      })
    };
  });

  // Encontrar o dia com mais transações para calcular a intensidade relativa
  const maxTransactions = Math.max(...days.map(day => day.transactions.length));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Transaction Activity</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={previousMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {/* Cabeçalho com dias da semana */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          
          {/* Espaços vazios para alinhar com o dia da semana correto */}
          {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          
          {/* Dias do mês */}
          {days.map(({ date, dayOfMonth, transactions }) => {
            const isToday = isSameMonth(date, new Date()) && date.getDate() === new Date().getDate();
            const activityLevel = getActivityLevel(transactions.length, maxTransactions);
            
            return (
              <div
                key={dayOfMonth}
                className={cn(
                  "aspect-square rounded-md flex items-center justify-center relative group",
                  isToday && "ring-2 ring-primary ring-offset-2",
                )}
              >
                <div
                  className={cn(
                    "w-full h-full absolute rounded-md opacity-20 transition-opacity",
                    activityLevel === 0 && "bg-transparent",
                    activityLevel === 1 && "bg-primary opacity-25",
                    activityLevel === 2 && "bg-primary opacity-50",
                    activityLevel === 3 && "bg-primary opacity-75",
                    activityLevel === 4 && "bg-primary",
                  )}
                />
                <span className="text-sm relative z-10">
                  {dayOfMonth}
                </span>
                {transactions.length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 text-[10px] text-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {transactions.length} tx
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 