import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Indica que esta rota é dinâmica
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.error("[CATEGORIES_GET] Usuário não autenticado");
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

    console.log("[CATEGORIES_GET] Buscando categorias para o usuário:", session.user.id);

    const categories = await prisma.category.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        transactions: {
          select: {
            type: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    console.log("[CATEGORIES_GET] Categorias encontradas:", categories.length);

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
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