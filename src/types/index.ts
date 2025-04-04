export type TransactionType = "INCOME" | "EXPENSE";

export type IconType = 
  | "Utensils"
  | "Car"
  | "Gamepad2"
  | "Lightbulb"
  | "Home"
  | "Shirt"
  | "Heart"
  | "GraduationCap"
  | "ShoppingBag"
  | "CircleDollarSign"
  | "Briefcase"
  | "Laptop"
  | "TrendingUp"
  | "Gift"
  | "HelpCircle"
  | "User"
  | "Users";

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date | string;
  type: TransactionType;
  categoryId: string;
  category?: Category;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: IconType;
  userId: string;
  transactions?: Transaction[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  emailVerified?: Date | string;
  image?: string;
  password?: string;
  transactions?: Transaction[];
  categories?: Category[];
  settings?: Settings;
  notifications?: Notification[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Settings {
  id: string;
  userId: string;
  user?: User;
  theme: string;
  currency: string;
  notificationsEnabled: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Notification {
  id: string;
  userId: string;
  user?: User;
  title: string;
  message: string;
  isRead: boolean;
  type: "INFO" | "WARNING" | "ERROR" | "SUCCESS";
  createdAt: Date | string;
  readAt?: Date | string;
}

export interface MonthlyTotal {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryTotal {
  total: number;
  transactions: Transaction[];
  category: Category;
}

export interface TransactionFilters {
  startDate?: Date | string;
  endDate?: Date | string;
  type?: TransactionType;
  categoryIds?: string[];
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
} 