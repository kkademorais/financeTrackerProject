"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/types";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants";
import { api } from "@/lib/api";

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
      console.log("[useCategories] Iniciando busca de categorias");
      console.log("[useCategories] Session:", session);
      
      if (!session?.user?.id) {
        console.log("[useCategories] Usuário não autenticado, usando categorias padrão");
        const defaultCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].map(cat => ({
          ...cat,
          transactions: [],
        }));
        console.log("[useCategories] Categorias padrão:", defaultCategories);
        setCategories(defaultCategories);
        setIsLoading(false);
        return;
      }
      
      try {
        const data = await api.getCategories();
        console.log("[useCategories] Categorias recebidas do servidor:", data);
        
        if (!Array.isArray(data) || data.length === 0) {
          console.log("[useCategories] Nenhuma categoria recebida, tentando criar categorias padrão");
          await api.seedCategories();
          
          // Busca novamente após criar as categorias
          const refreshedData = await api.getCategories();
          console.log("[useCategories] Categorias após seed:", refreshedData);
          
          if (!Array.isArray(refreshedData) || refreshedData.length === 0) {
            console.log("[useCategories] Ainda não há categorias, usando categorias padrão");
            const defaultCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].map(cat => ({
              ...cat,
              transactions: [],
            }));
            setCategories(defaultCategories);
          } else {
            setCategories(refreshedData);
          }
        } else {
          setCategories(data);
        }
      } catch (error) {
        console.error("[useCategories] Erro ao buscar categorias:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar categorias",
          description: "Não foi possível carregar suas categorias. Tente novamente mais tarde.",
        });
        // Em caso de erro, use as categorias padrão
        const defaultCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].map(cat => ({
          ...cat,
          transactions: [],
        }));
        setCategories(defaultCategories);
      }
    } catch (error) {
      console.error("[useCategories] Erro ao buscar categorias:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar categorias",
        description: "Não foi possível carregar suas categorias. Tente novamente mais tarde.",
      });
      // Em caso de erro, use as categorias padrão
      const defaultCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].map(cat => ({
        ...cat,
        transactions: [],
      }));
      setCategories(defaultCategories);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("[useCategories] Status de autenticação:", status);
    console.log("[useCategories] Session no useEffect:", session);
    
    if (status === "authenticated") {
      fetchCategories();
    } else {
      // Se não estiver autenticado, use as categorias padrão
      const defaultCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].map(cat => ({
        ...cat,
        transactions: [],
      }));
      console.log("[useCategories] Usando categorias padrão no useEffect:", defaultCategories);
      setCategories(defaultCategories);
      setIsLoading(false);
    }
  }, [status, session]);

  // Filtra as categorias por tipo
  const expenseCategories = categories.filter(cat => {
    const isExpenseCategory = EXPENSE_CATEGORIES.some(ec => ec.name === cat.name);
    console.log(`[useCategories] Verificando categoria ${cat.name}: isExpenseCategory=${isExpenseCategory}`);
    return isExpenseCategory;
  });

  const incomeCategories = categories.filter(cat => {
    const isIncomeCategory = INCOME_CATEGORIES.some(ic => ic.name === cat.name);
    console.log(`[useCategories] Verificando categoria ${cat.name}: isIncomeCategory=${isIncomeCategory}`);
    return isIncomeCategory;
  });

  console.log("[useCategories] Categorias filtradas:", {
    todas: categories.length,
    despesas: expenseCategories.length,
    receitas: incomeCategories.length
  });

  return {
    categories,
    expenseCategories,
    incomeCategories,
    isLoading,
    refreshCategories: fetchCategories,
  };
} 