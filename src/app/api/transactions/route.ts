import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.error("[TRANSACTIONS_GET] No session or user ID");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("[TRANSACTIONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("[TRANSACTIONS_POST] Session:", {
      id: session?.user?.id,
      email: session?.user?.email
    });

    if (!session?.user?.id) {
      console.error("[TRANSACTIONS_POST] No session or user ID");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    console.log("[TRANSACTIONS_POST] Request body:", {
      ...body,
      amount: typeof body.amount === 'number' ? body.amount : Number(body.amount)
    });
    
    const { description, amount, type, categoryId, date } = body;

    if (!description || amount === undefined || !type || !categoryId || !date) {
      console.error("[TRANSACTIONS_POST] Missing or invalid fields:", {
        hasDescription: !!description,
        hasAmount: amount !== undefined,
        hasType: !!type,
        hasCategoryId: !!categoryId,
        hasDate: !!date
      });
      return new NextResponse("Missing or invalid fields", { status: 400 });
    }

    // Validar o tipo da transação
    if (!Object.values(TransactionType).includes(type)) {
      console.error("[TRANSACTIONS_POST] Invalid transaction type:", type);
      return new NextResponse("Invalid transaction type", { status: 400 });
    }

    // Converter e validar o valor
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      console.error("[TRANSACTIONS_POST] Invalid amount:", amount);
      return new NextResponse("Invalid amount", { status: 400 });
    }

    // Validar a data
    const transactionDate = new Date(date);
    if (isNaN(transactionDate.getTime())) {
      console.error("[TRANSACTIONS_POST] Invalid date:", date);
      return new NextResponse("Invalid date", { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount: numericAmount,
        type,
        date: transactionDate,
        categoryId,
        userId: session.user.id
      },
      include: {
        category: true,
      },
    });

    console.log("[TRANSACTIONS_POST] Transaction created successfully:", {
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type
    });
    
    return NextResponse.json(transaction);
  } catch (error: any) {
    console.error("[TRANSACTIONS_POST] Detailed error:", {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    
    // Retornar erro mais específico
    if (error.code === 'P2003') {
      return new NextResponse(
        JSON.stringify({ error: "Category or user not found" }), 
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to create transaction",
        details: {
          message: error.message,
          code: error.code
        }
      }), 
      { status: 500 }
    );
  }
} 