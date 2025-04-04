import { useState, useEffect } from "react";
import useSWR from "swr";

import { Transaction, TransactionType } from "@/types";
import { useTransactions } from "@/contexts/transactions-context";

interface UseFetchTransactionsOptions {
  startDate?: Date;
  endDate?: Date;
  type?: TransactionType;
  categoryId?: string;
  limit?: number;
}

export function useFetchTransactions(options: UseFetchTransactionsOptions = {}) {
  const { transactions, isLoading } = useTransactions();
  
  // Filtragem local para simular filtros de API
  const filteredData = filterTransactions(transactions, options);

  return {
    data: filteredData,
    isLoading,
    isError: false,
    mutate: () => {},
  };
}

// Função auxiliar para filtrar transações localmente
function filterTransactions(transactions: Transaction[], options: UseFetchTransactionsOptions) {
  let filtered = [...transactions];
  
  if (options.startDate) {
    filtered = filtered.filter(t => new Date(t.date) >= options.startDate!);
  }
  
  if (options.endDate) {
    filtered = filtered.filter(t => new Date(t.date) <= options.endDate!);
  }
  
  if (options.type) {
    filtered = filtered.filter(t => t.type === options.type);
  }
  
  if (options.categoryId) {
    filtered = filtered.filter(t => t.categoryId === options.categoryId);
  }
  
  if (options.limit) {
    filtered = filtered.slice(0, options.limit);
  }
  
  return filtered;
}

// Simula uma requisição à API
async function fetcher(url: string) {
  // No ambiente real, isso seria uma chamada fetch
  // return fetch(url).then((res) => res.json());
  
  console.log(`Mock API call to: ${url}`);
  
  // Simula o tempo de requisição
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Retorna array vazio para simular um novo usuário
  return [];
} 