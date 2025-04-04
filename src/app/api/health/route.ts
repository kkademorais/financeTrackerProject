import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Testa a conexão com o banco
    await prisma.$connect();
    console.log("[HEALTH] Database connection successful");

    // Tenta buscar algumas estatísticas básicas
    const [usersCount, categoriesCount, transactionsCount] = await Promise.all([
      prisma.user.count(),
      prisma.category.count(),
      prisma.transaction.count()
    ]);

    console.log("[HEALTH] Database stats:", {
      users: usersCount,
      categories: categoriesCount,
      transactions: transactionsCount
    });

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      stats: {
        users: usersCount,
        categories: categoriesCount,
        transactions: transactionsCount
      },
      env: {
        nodeEnv: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      }
    });
  } catch (error: any) {
    console.error("[HEALTH] Error:", error);
    return NextResponse.json({
      status: "unhealthy",
      error: error.message,
      env: {
        nodeEnv: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      }
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 