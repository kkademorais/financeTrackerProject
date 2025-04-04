import { prisma } from "./prisma";

export const setupUserCategories = async (userId: string) => {
  try {
    console.log("[setupUserCategories] Iniciando configuração de categorias para o usuário:", userId);
    
    // Verifica se o usuário já tem categorias
    const existingCategories = await prisma.category.findMany({
      where: {
        userId: userId,
      },
    });
    
    // Se o usuário já tem categorias, não cria novas
    if (existingCategories.length > 0) {
      console.log("[setupUserCategories] Usuário já possui categorias:", existingCategories.length);
      return existingCategories;
    }
    
    console.log("[setupUserCategories] Criando categorias para o usuário");
    
    const now = new Date().toISOString();
    
    const EXPENSE_CATEGORIES = [
      { 
        id: `moradia_${userId}`, 
        name: "Moradia", 
        color: "#118AB2",
        icon: "Home",
        userId,
        createdAt: now,
        updatedAt: now,
      },
      { 
        id: `alimentacao_${userId}`, 
        name: "Alimentação", 
        color: "#FF6B6B",
        icon: "Utensils",
        userId,
        createdAt: now,
        updatedAt: now,
      },
      { 
        id: `transporte_${userId}`, 
        name: "Transporte", 
        color: "#4ECDC4",
        icon: "Car",
        userId,
        createdAt: now,
        updatedAt: now,
      },
      { 
        id: `saude_${userId}`, 
        name: "Saúde", 
        color: "#FF9A8B",
        icon: "Heart",
        userId,
        createdAt: now,
        updatedAt: now,
      },
      { 
        id: `educacao_${userId}`, 
        name: "Educação", 
        color: "#A78BFA",
        icon: "GraduationCap",
        userId,
        createdAt: now,
        updatedAt: now,
      },
      { 
        id: `lazer_${userId}`, 
        name: "Lazer", 
        color: "#FFD166",
        icon: "Gamepad2",
        userId,
        createdAt: now,
        updatedAt: now,
      },
      { 
        id: `despesas_pessoais_${userId}`, 
        name: "Despesas Pessoais", 
        color: "#F472B6",
        icon: "User",
        userId,
        createdAt: now,
        updatedAt: now,
      },
      { 
        id: `financas_${userId}`, 
        name: "Finanças", 
        color: "#06D6A0",
        icon: "CircleDollarSign",
        userId,
        createdAt: now,
        updatedAt: now,
      },
      { 
        id: `dependentes_${userId}`, 
        name: "Dependentes", 
        color: "#38BDF8",
        icon: "Users",
        userId,
        createdAt: now,
        updatedAt: now,
      },
      { 
        id: `outros_${userId}`, 
        name: "Outros", 
        color: "#94A3B8",
        icon: "HelpCircle",
        userId,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const INCOME_CATEGORIES = [
      { 
        id: `salario_${userId}`, 
        name: "Salário", 
        color: "#4CAF50",
        icon: "Briefcase",
        userId,
        createdAt: now,
        updatedAt: now,
      },
      { 
        id: `freelance_${userId}`, 
        name: "Freelance", 
        color: "#2196F3",
        icon: "Laptop",
        userId,
        createdAt: now,
        updatedAt: now,
      },
      { 
        id: `investimentos_${userId}`, 
        name: "Investimentos", 
        color: "#FFC107",
        icon: "TrendingUp",
        userId,
        createdAt: now,
        updatedAt: now,
      },
    ];

    // Cria todas as categorias em uma única transação
    await prisma.category.createMany({
      data: [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES],
      skipDuplicates: true, // Pula categorias que já existem
    });
    
    // Busca todas as categorias criadas
    const createdCategories = await prisma.category.findMany({
      where: {
        userId: userId,
      },
    });
    
    console.log("[setupUserCategories] Categorias criadas:", createdCategories.length);
    
    return createdCategories;
  } catch (error) {
    console.error("[setupUserCategories] Erro ao configurar categorias:", error);
    throw error;
  }
}; 