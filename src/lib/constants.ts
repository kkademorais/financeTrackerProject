import type { IconType } from "@/types";

export interface CategoryConstant {
  id: string;
  name: string;
  color: string;
  icon: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const EXPENSE_CATEGORIES: CategoryConstant[] = [
  { 
    id: "food", 
    name: "Food & Dining", 
    color: "#4CAF50", 
    icon: "Utensils",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "transport", 
    name: "Transportation", 
    color: "#2196F3", 
    icon: "Car",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "entertainment", 
    name: "Entertainment", 
    color: "#E91E63", 
    icon: "Gamepad2",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "utilities", 
    name: "Utilities", 
    color: "#673AB7", 
    icon: "Lightbulb",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "home", 
    name: "Housing", 
    color: "#FF5722", 
    icon: "Home",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "personal", 
    name: "Personal Care", 
    color: "#9C27B0", 
    icon: "Shirt",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "health", 
    name: "Health", 
    color: "#00BCD4", 
    icon: "Heart",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "education", 
    name: "Education", 
    color: "#FFC107", 
    icon: "GraduationCap",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "shopping", 
    name: "Shopping", 
    color: "#795548", 
    icon: "ShoppingBag",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "other", 
    name: "Other", 
    color: "#607D8B", 
    icon: "HelpCircle",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INCOME_CATEGORIES: CategoryConstant[] = [
  { 
    id: "salary", 
    name: "Salary", 
    color: "#4CAF50", 
    icon: "Briefcase",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "freelance", 
    name: "Freelance", 
    color: "#2196F3", 
    icon: "Laptop",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "investments", 
    name: "Investments", 
    color: "#E91E63", 
    icon: "TrendingUp",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "gifts", 
    name: "Gifts", 
    color: "#673AB7", 
    icon: "Gift",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "other", 
    name: "Other", 
    color: "#607D8B", 
    icon: "CircleDollarSign",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]; 