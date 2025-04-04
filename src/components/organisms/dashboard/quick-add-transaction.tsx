"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, DollarSign, Calendar as CalendarIcon, FileText, Tag } from "lucide-react";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
import { useCategories } from "@/hooks/use-categories";
import { TransactionType, Category } from "@/types";

const transactionSchema = z.object({
  amount: z.number().min(0.01, "O valor deve ser maior que 0"),
  description: z.string().min(1, "A descrição é obrigatória"),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().min(1, "A categoria é obrigatória"),
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
  const { expenseCategories, incomeCategories, isLoading } = useCategories();
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
  const categories = transactionType === "INCOME" ? incomeCategories : expenseCategories;

  const onSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true);
    try {
      const selectedCategory = transactionType === "INCOME"
        ? incomeCategories.find((c: Category) => c.id === data.categoryId)
        : expenseCategories.find((c: Category) => c.id === data.categoryId);

      if (!selectedCategory) {
        toast({
          title: "Erro",
          description: "Categoria selecionada não encontrada.",
          variant: "destructive",
        });
        return;
      }

      await addTransaction({
        ...data,
        date: new Date(data.date),
        category: selectedCategory,
      });
      
      toast({
        title: "Sucesso! 🎉",
        description: "Sua transação foi registrada com sucesso.",
      });

      reset();
      onTransactionAdded?.();
    } catch (error) {
      toast({
        title: "Ops! Algo deu errado",
        description: "Não foi possível registrar sua transação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={cn("transition-all duration-300 hover:scale-[1.02] hover:shadow-lg", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Plus className="h-6 w-6" />
          Nova Transação
        </CardTitle>
        <CardDescription className="text-base">
          Registre suas movimentações financeiras
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="group space-y-2 transition-all duration-200 hover:scale-[1.02]">
              <Label htmlFor="amount" className="flex items-center gap-2 text-base">
                <DollarSign className="h-4 w-4" />
                Valor
                </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0,00"
                className="transition-all duration-200 group-hover:border-primary"
                {...register("amount", { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>

            <div className="group space-y-2 transition-all duration-200 hover:scale-[1.02]">
              <Label className="flex items-center gap-2 text-base">
                <CalendarIcon className="h-4 w-4" />
                Data
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal transition-all duration-200 group-hover:border-primary",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
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
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="group space-y-2 transition-all duration-200 hover:scale-[1.02]">
            <Label htmlFor="description" className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4" />
              Descrição
            </Label>
            <Input
              id="description"
              placeholder="Ex: Compras do mês, Salário, etc."
              className="transition-all duration-200 group-hover:border-primary"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="group space-y-2 transition-all duration-200 hover:scale-[1.02]">
              <Label className="flex items-center gap-2 text-base">
                <DollarSign className="h-4 w-4" />
                Tipo
              </Label>
              <RadioGroup
                value={transactionType}
                onValueChange={(value) => {
                  setValue("type", value as TransactionType);
                  setValue("categoryId", "");
                }}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center space-x-2 transition-all duration-200 hover:scale-[1.02]">
                  <RadioGroupItem value="EXPENSE" id="expense" />
                  <Label htmlFor="expense" className="cursor-pointer">Saída/Despesa</Label>
                </div>
                <div className="flex items-center space-x-2 transition-all duration-200 hover:scale-[1.02]">
                  <RadioGroupItem value="INCOME" id="income" />
                  <Label htmlFor="income" className="cursor-pointer">Entrada/Receita</Label>
                </div>
              </RadioGroup>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="group space-y-2 transition-all duration-200 hover:scale-[1.02]">
              <Label htmlFor="category" className="flex items-center gap-2 text-base">
                <Tag className="h-4 w-4" />
                Categoria
              </Label>
              <Select 
                value={watch("categoryId")}
                onValueChange={(value) => setValue("categoryId", value)}
              >
                <SelectTrigger className="transition-all duration-200 group-hover:border-primary">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="" disabled>
                      Carregando categorias...
                    </SelectItem>
                  ) : categories.length === 0 ? (
                    <SelectItem value="" disabled>
                      Nenhuma categoria encontrada
                    </SelectItem>
                  ) : (
                    categories.map((category: Category) => (
                      <SelectItem 
                        key={category.id} 
                        value={category.id}
                        className="transition-all duration-200 hover:scale-[1.02]"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-red-500">{errors.categoryId.message}</p>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full transition-all duration-300 hover:scale-[1.02]" 
            disabled={isSubmitting}
          >
            <Plus className="mr-2 h-5 w-5" />
            {isSubmitting ? "Registrando..." : "Registrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 