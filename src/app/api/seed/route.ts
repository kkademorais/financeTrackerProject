import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const defaultCategories = [
  { name: "Alimentação", color: "#FF6B6B", icon: "🍽️" },
  { name: "Transporte", color: "#4ECDC4", icon: "🚗" },
  { name: "Moradia", color: "#45B7D1", icon: "🏠" },
  { name: "Saúde", color: "#96CEB4", icon: "⚕️" },
  { name: "Educação", color: "#FFEEAD", icon: "📚" },
  { name: "Lazer", color: "#D4A5A5", icon: "🎮" },
  { name: "Compras", color: "#9B6B6B", icon: "🛍️" },
  { name: "Contas", color: "#FF9999", icon: "📄" },
  { name: "Salário", color: "#77DD77", icon: "💰" },
  { name: "Investimentos", color: "#FFB366", icon: "📈" },
  { name: "Outros", color: "#B8B8B8", icon: "📌" }
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("[SEED] Session:", {
      id: session?.user?.id,
      email: session?.user?.email
    });

    if (!session?.user?.id) {
      console.error("[SEED] No session or user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verifica se o usuário já tem categorias
    const existingCategories = await prisma.category.findMany({
      where: { userId: session.user.id }
    });

    console.log("[SEED] Existing categories:", existingCategories.length);

    // Mesmo que existam categorias, vamos garantir que todas as padrões existam
    const existingNames = new Set(existingCategories.map(c => c.name));
    const missingCategories = defaultCategories.filter(c => !existingNames.has(c.name));

    console.log("[SEED] Missing categories:", missingCategories.length);

    if (missingCategories.length > 0) {
      // Cria as categorias que faltam
      const newCategories = await Promise.all(
        missingCategories.map(category =>
          prisma.category.create({
            data: {
              ...category,
              userId: session.user.id
            }
          })
        )
      );

      console.log("[SEED] Created new categories:", newCategories.length);

      // Retorna todas as categorias
      const allCategories = [...existingCategories, ...newCategories];
      return NextResponse.json(allCategories);
    }

    return NextResponse.json(existingCategories);
  } catch (error: any) {
    console.error("[SEED] Error:", error);
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
}

// Adiciona rota POST para forçar recriação das categorias
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    console.log("[SEED] Force recreate - Session:", {
      id: session?.user?.id,
      email: session?.user?.email
    });

    if (!session?.user?.id) {
      console.error("[SEED] Force recreate - No session or user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Deleta todas as categorias existentes do usuário
    await prisma.category.deleteMany({
      where: { userId: session.user.id }
    });

    console.log("[SEED] Force recreate - Deleted existing categories");

    // Cria todas as categorias padrão
    const categories = await Promise.all(
      defaultCategories.map(category =>
        prisma.category.create({
          data: {
            ...category,
            userId: session.user.id
          }
        })
      )
    );

    console.log("[SEED] Force recreate - Created categories:", categories.length);

    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("[SEED] Force recreate - Error:", error);
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
} 