"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/atoms/ui/dialog";
import { Button } from "@/components/atoms/ui/button";
import { Input } from "@/components/atoms/ui/input";
import { Label } from "@/components/atoms/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/ui/select";
import { Transaction, TransactionType, Category } from "@/types";
import { useCategories } from "@/hooks/use-categories";

interface QuickAddTransactionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTransaction: (transaction: {
    description: string;
    amount: number;
    type: TransactionType;
    categoryId: string;
    date: Date;
  }) => Promise<void>;
}

export function QuickAddTransaction({
  open,
  onOpenChange,
  onAddTransaction,
}: QuickAddTransactionProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const { expenseCategories, incomeCategories, isLoading } = useCategories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryId) {
      console.error("[QuickAddTransaction] Nenhuma categoria selecionada");
      return;
    }
    
    const selectedCategory = type === "INCOME" 
      ? incomeCategories.find(c => c.id === categoryId)
      : expenseCategories.find(c => c.id === categoryId);

    if (!selectedCategory) {
      console.error("[QuickAddTransaction] Categoria não encontrada:", {
        categoryId,
        type,
        availableCategories: type === "INCOME" ? incomeCategories : expenseCategories
      });
      return;
    }

    console.log("[QuickAddTransaction] Adicionando transação com categoria:", {
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name
    });

    await onAddTransaction({
      description,
      amount: Number(amount),
      type,
      categoryId: selectedCategory.id,
      date: new Date(date),
    });

    setDescription("");
    setAmount("");
    setType("EXPENSE");
    setCategoryId("");
    setDate(new Date().toISOString().split("T")[0]);
    onOpenChange(false);
  };

  const categories = type === "INCOME" ? incomeCategories : expenseCategories;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Salário, Aluguel, etc."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={type} onValueChange={(value) => setType(value as TransactionType)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXPENSE">Despesa</SelectItem>
                <SelectItem value="INCOME">Receita</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Adicionar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 