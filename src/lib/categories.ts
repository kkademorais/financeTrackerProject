import { prisma } from "./prisma";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "./constants";

export const setupUserCategories = async (userId: string) => {
  try {
    console.log("[setupUserCategories] Iniciando configuração de categorias para o usuário:", userId);
    
    // Verifica se o usuário já tem categorias
    const existingCategories = await prisma.category.findMany({
      where: {
        userId: userId,
      },
    });
    
    console.log("[setupUserCategories] Categorias existentes:", existingCategories.length);

    // Mapeia as categorias existentes por nome para fácil verificação
    const existingCategoryNames = new Set(existingCategories.map(c => c.name));
    
    // Combina todas as categorias padrão
    const defaultCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
    
    // Filtra apenas as categorias que não existem
    const missingCategories = defaultCategories.filter(
      category => !existingCategoryNames.has(category.name)
    );
    
    console.log("[setupUserCategories] Categorias faltantes:", missingCategories.length);

    if (missingCategories.length > 0) {
      // Prepara os dados para criação
      const categoriesToCreate = missingCategories.map(category => ({
        name: category.name,
        color: category.color,
        icon: category.icon,
        userId: userId
      }));

      // Cria as categorias faltantes
      const createdCategories = await prisma.$transaction(
        categoriesToCreate.map(category =>
          prisma.category.create({
            data: category
          })
        )
      );

      console.log("[setupUserCategories] Categorias criadas:", createdCategories.length);

      // Retorna todas as categorias (existentes + novas)
      const allCategories = [...existingCategories, ...createdCategories];
      console.log("[setupUserCategories] Total de categorias:", allCategories.length);
      
      return allCategories;
    }

    console.log("[setupUserCategories] Todas as categorias já existem");
    return existingCategories;
  } catch (error) {
    console.error("[setupUserCategories] Erro ao configurar categorias:", error);
    throw error;
  }
}; 