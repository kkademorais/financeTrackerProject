"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/types";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants";

export interface UseCategoriesReturn {
  categories: Category[];
  expenseCategories: Category[];
  incomeCategories: Category[];
  isLoading: boolean;
  refreshCategories: () => Promise<void>;
}

export function useCategories(): UseCategoriesReturn {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar categorias",
        description: "Não foi possível carregar suas categorias. Tente novamente mais tarde.",
      });
      // Em caso de erro, use as categorias padrão
      setCategories([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].map(cat => ({
        ...cat,
        transactions: [],
      })));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchCategories();
    } else {
      // Se não estiver autenticado, use as categorias padrão
      setCategories([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].map(cat => ({
        ...cat,
        transactions: [],
      })));
      setIsLoading(false);
    }
  }, [status]);

  // Filtra as categorias por tipo
  const expenseCategories = categories.length > 0 
    ? categories.filter(cat => 
        EXPENSE_CATEGORIES.some(ec => ec.id === cat.id) || // Verifica se é uma categoria de despesa padrão
        cat.transactions?.some(t => t.type === "EXPENSE") || // Ou se tem transações de despesa
        (!cat.transactions?.length && cat.id.startsWith('expense_')) // Ou se é uma nova categoria de despesa
      )
    : EXPENSE_CATEGORIES.map(cat => ({
        ...cat,
        transactions: [],
      }));

  const incomeCategories = categories.length > 0
    ? categories.filter(cat => 
        INCOME_CATEGORIES.some(ic => ic.id === cat.id) || // Verifica se é uma categoria de receita padrão
        cat.transactions?.some(t => t.type === "INCOME") || // Ou se tem transações de receita
        (!cat.transactions?.length && cat.id.startsWith('income_')) // Ou se é uma nova categoria de receita
      )
    : INCOME_CATEGORIES.map(cat => ({
        ...cat,
        transactions: [],
      }));

  return {
    categories,
    expenseCategories,
    incomeCategories,
    isLoading,
    refreshCategories: fetchCategories,
  };
} 