import type { IconType } from "@/types";

export interface CategoryConstant {
  id: string;
  name: string;
  color: string;
  icon: IconType;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const EXPENSE_CATEGORIES: CategoryConstant[] = [
  { 
    id: "moradia", 
    name: "Moradia", 
    color: "#118AB2",
    icon: "Home",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "alimentacao", 
    name: "Alimentação", 
    color: "#FF6B6B",
    icon: "Utensils",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "transporte", 
    name: "Transporte", 
    color: "#4ECDC4",
    icon: "Car",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "saude", 
    name: "Saúde", 
    color: "#FF9A8B",
    icon: "Heart",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "educacao", 
    name: "Educação", 
    color: "#A78BFA",
    icon: "GraduationCap",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "lazer", 
    name: "Lazer", 
    color: "#FFD166",
    icon: "Gamepad2",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "despesas_pessoais", 
    name: "Despesas Pessoais", 
    color: "#F472B6",
    icon: "Shirt",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "financas", 
    name: "Finanças", 
    color: "#06D6A0",
    icon: "CircleDollarSign",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "dependentes", 
    name: "Dependentes", 
    color: "#38BDF8",
    icon: "ShoppingBag",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "outros", 
    name: "Outros", 
    color: "#94A3B8",
    icon: "HelpCircle",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INCOME_CATEGORIES: CategoryConstant[] = [
  { 
    id: "salario", 
    name: "Salário", 
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
    id: "investimentos", 
    name: "Investimentos", 
    color: "#FFC107",
    icon: "TrendingUp",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]; 