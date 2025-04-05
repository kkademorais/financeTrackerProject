import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  // Determinar qual URL de banco de dados usar com base no ambiente
  const databaseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.DATABASE_URL_PROD || process.env.DATABASE_URL
    : process.env.DATABASE_URL;
  
  console.log("[PRISMA] Initializing Prisma Client with URL:", 
    databaseUrl?.replace(/\/\/.*@/, "//***@")
  );
  
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: databaseUrl
      }
    }
  });
};

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
} 