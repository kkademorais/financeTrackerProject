import { useState, useEffect } from "react";
import useSWR from "swr";

import { Transaction } from "@/types";

// Simulando dados para desenvolvimento até que a API esteja pronta
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    amount: 3500,
    description: "Salary",
    date: new Date("2023-11-01"),
    type: "INCOME",
    userId: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    amount: 1200,
    description: "Rent",
    date: new Date("2023-11-05"),
    type: "EXPENSE",
    categoryId: "home",
    category: {
      id: "home",
      name: "Housing",
      color: "#FF5722",
      icon: "home",
      userId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    userId: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    amount: 85.99,
    description: "Grocery Shopping",
    date: new Date("2023-11-08"),
    type: "EXPENSE",
    categoryId: "food",
    category: {
      id: "food",
      name: "Food",
      color: "#4CAF50",
      icon: "shopping-cart",
      userId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    userId: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    amount: 45.50,
    description: "Gas",
    date: new Date("2023-11-12"),
    type: "EXPENSE",
    categoryId: "transport",
    category: {
      id: "transport",
      name: "Transportation",
      color: "#2196F3",
      icon: "car",
      userId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    userId: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    amount: 500,
    description: "Freelance Work",
    date: new Date("2023-11-15"),
    type: "INCOME",
    userId: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    amount: 120,
    description: "Electricity Bill",
    date: new Date("2023-11-18"),
    type: "EXPENSE",
    categoryId: "utilities",
    category: {
      id: "utilities",
      name: "Utilities",
      color: "#673AB7",
      icon: "zap",
      userId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    userId: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "7",
    amount: 35.99,
    description: "Netflix Subscription",
    date: new Date("2023-11-20"),
    type: "EXPENSE",
    categoryId: "entertainment",
    category: {
      id: "entertainment",
      name: "Entertainment",
      color: "#E91E63",
      icon: "film",
      userId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    userId: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "8",
    amount: 250,
    description: "Birthday Gift",
    date: new Date("2023-11-22"),
    type: "EXPENSE",
    categoryId: "personal",
    category: {
      id: "personal",
      name: "Personal",
      color: "#9C27B0",
      icon: "user",
      userId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    userId: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Simula uma requisição à API
async function fetcher(url: string) {
  // No ambiente real, isso seria uma chamada fetch
  // return fetch(url).then((res) => res.json());
  
  console.log(`Mock API call to: ${url}`);
  
  // Simula o tempo de requisição
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return MOCK_TRANSACTIONS;
}

interface UseFetchTransactionsOptions {
  startDate?: Date;
  endDate?: Date;
  type?: string;
  categoryId?: string;
  limit?: number;
}

export function useFetchTransactions(options: UseFetchTransactionsOptions = {}) {
  // Em uma implementação real, converteríamos as opções para queryParams
  const url = "/api/transactions";
  
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minuto
  });

  // Filtragem local para simular filtros de API
  const filteredData = data ? filterTransactions(data, options) : [];

  return {
    data: filteredData,
    isLoading,
    isError: error,
    mutate,
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