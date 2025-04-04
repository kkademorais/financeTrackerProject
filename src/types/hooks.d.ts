import { Category } from "@/types";

export interface UseCategoriesReturn {
  categories: Category[];
  expenseCategories: Category[];
  incomeCategories: Category[];
  isLoading: boolean;
  refreshCategories: () => Promise<void>;
}

declare module "@/hooks/use-categories" {
  export function useCategories(): UseCategoriesReturn;
} 