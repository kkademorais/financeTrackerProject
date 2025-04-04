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

    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }), 
        { 
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("[SEED] Iniciando seed para usuário:", session.user.id);

    // Verifica se o usuário já tem categorias
    const existingCategories = await prisma.category.findMany({
      where: { userId: session.user.id }
    });

    if (existingCategories.length > 0) {
      console.log("[SEED] Usuário já possui categorias");
      return NextResponse.json({ message: "Categories already exist" });
    }

    // Cria as categorias padrão
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

    console.log("[SEED] Categorias criadas com sucesso:", categories.length);

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[SEED]", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }), 
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
} 