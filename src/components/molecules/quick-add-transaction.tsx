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
  onAddTransaction: (transaction: Omit<Transaction, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<void>;
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
    const selectedCategory = type === "INCOME" 
      ? incomeCategories.find(c => c.id === categoryId)
      : expenseCategories.find(c => c.id === categoryId);

    if (!selectedCategory) {
      return;
    }

    await onAddTransaction({
      description,
      amount: Number(amount),
      type,
      categoryId,
      category: selectedCategory as Category,
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
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={type} onValueChange={(value: TransactionType) => {
              setType(value);
              setCategoryId("");
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Receita</SelectItem>
                <SelectItem value="EXPENSE">Despesa</SelectItem>
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
                {isLoading ? (
                  <SelectItem value="" disabled>
                    Carregando categorias...
                  </SelectItem>
                ) : categories.length === 0 ? (
                  <SelectItem value="" disabled>
                    Nenhuma categoria encontrada
                  </SelectItem>
                ) : (
                  categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))
                )}
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            Adicionar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 