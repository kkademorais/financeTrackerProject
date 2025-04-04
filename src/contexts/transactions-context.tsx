"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/atoms/ui/use-toast";
import { Transaction, TransactionType } from "@/types";
import { api } from "@/lib/api";

interface TransactionsContextType {
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (transaction: Omit<Transaction, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      console.log("[TransactionsProvider] Fetching transactions...");
      
      const data = await api.getTransactions();
      console.log("[TransactionsProvider] Transactions fetched:", data);

      setTransactions(data.map((t: any) => ({
        ...t,
        date: new Date(t.date),
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt)
      })));
    } catch (error) {
      console.error("[TransactionsProvider] Error fetching transactions:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar transações",
        description: "Não foi possível carregar suas transações. Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetchTransactions();
    }
  }, [status, session?.user?.email]);

  const addTransaction = async (transaction: Omit<Transaction, "id" | "userId" | "createdAt" | "updatedAt">) => {
    try {
      console.log("[TransactionsProvider] Adding transaction:", transaction);
      
      const newTransaction = await api.addTransaction(transaction);
      console.log("[TransactionsProvider] Transaction added:", newTransaction);

      setTransactions((prev) => [...prev, {
        ...newTransaction,
        date: new Date(newTransaction.date),
        createdAt: new Date(newTransaction.createdAt),
        updatedAt: new Date(newTransaction.updatedAt)
      }]);

      toast({
        title: "Transação adicionada com sucesso!",
        description: "Sua transação foi registrada com sucesso.",
      });
    } catch (error) {
      console.error("[TransactionsProvider] Error adding transaction:", error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar transação",
        description: "Não foi possível adicionar a transação. Tente novamente mais tarde.",
      });
      throw error;
    }
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        isLoading,
        addTransaction,
        refreshTransactions: fetchTransactions,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionsProvider");
  }
  return context;
} 