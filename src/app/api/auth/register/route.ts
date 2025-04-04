import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    if (password.length < 8) {
      return new NextResponse("Password must be at least 8 characters", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("Email already in use", { status: 400 });
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        categories: {
          create: [
            ...EXPENSE_CATEGORIES.map(cat => ({
              name: cat.name,
              color: cat.color,
              icon: cat.icon,
            })),
            ...INCOME_CATEGORIES.map(cat => ({
              name: cat.name,
              color: cat.color,
              icon: cat.icon,
            })),
          ],
        },
      },
      include: {
        categories: true,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("[REGISTER_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 