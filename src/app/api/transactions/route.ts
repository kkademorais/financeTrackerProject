import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        user: {
          email: session.user.email,
        },
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

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { description, amount, type, categoryId, date } = body;

    if (!description || !amount || !type || !categoryId || !date) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount,
        type: type as TransactionType,
        date: new Date(date),
        category: {
          connect: {
            id: categoryId,
          },
        },
        user: {
          connect: {
            email: session.user.email,
          },
        },
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("[TRANSACTIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 