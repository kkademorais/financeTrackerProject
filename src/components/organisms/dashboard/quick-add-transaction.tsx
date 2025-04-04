"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { z } from "zod";
import { format } from "date-fns";

import { Button } from "@/components/atoms/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Input } from "@/components/atoms/ui/input";
import { Label } from "@/components/atoms/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/atoms/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useTransactions } from "@/contexts/transactions-context";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/ui/select";
import { Calendar } from "@/components/atoms/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/atoms/ui/popover";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants";
import { TransactionType } from "@/types";

const transactionSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().min(1, "Category is required"),
  date: z.date(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface QuickAddTransactionProps {
  onTransactionAdded?: () => void;
  className?: string;
}

export function QuickAddTransaction({ onTransactionAdded, className }: QuickAddTransactionProps) {
  const { toast } = useToast();
  const { addTransaction } = useTransactions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE",
      categoryId: "",
      date: new Date(),
    },
  });

  const transactionType = watch("type");
  const categories = transactionType === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const onSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true);
    try {
      await addTransaction({
        ...data,
        date: new Date(data.date),
      });
      
      toast({
        title: "Transaction added!",
        description: "Your transaction has been successfully added.",
      });

      reset();
      onTransactionAdded?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error adding your transaction.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Quick Add Transaction</CardTitle>
        <CardDescription>Add a new income or expense quickly</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...register("amount", { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate || new Date());
                      setValue("date", newDate || new Date());
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Type</Label>
              <RadioGroup
                value={transactionType}
                onValueChange={(value) => {
                  setValue("type", value as TransactionType);
                  setValue("categoryId", ""); // Reset category when type changes
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="EXPENSE" id="expense" />
                  <Label htmlFor="expense">Expense</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="INCOME" id="income" />
                  <Label htmlFor="income">Income</Label>
                </div>
              </RadioGroup>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value) => setValue("categoryId", value)}
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-red-500">{errors.categoryId.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <Plus className="mr-2 h-4 w-4" />
            {isSubmitting ? "Adding..." : "Add Transaction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 