import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  console.log("[PRISMA] Initializing Prisma Client with URL:", 
    process.env.DATABASE_URL?.replace(/\/\/.*@/, "//***@")
  );
  
  return new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
};

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
} 