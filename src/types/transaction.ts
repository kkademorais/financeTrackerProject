export type TransactionType = "INCOME" | "EXPENSE";

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: TransactionType;
  categoryId: string;
  date: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
} 