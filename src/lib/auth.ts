import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { compare } from "bcryptjs";
import { setupUserCategories } from "./categories";

import { prisma } from "@/lib/prisma";

// Adicionando tipos personalizados para o NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Credenciais inválidas");
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user || !user.password) {
            throw new Error("Usuário não encontrado");
          }

          const passwordsMatch = await compare(
            credentials.password,
            user.password
          );

          if (!passwordsMatch) {
            throw new Error("Senha incorreta");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("[Auth] Erro no authorize:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async signIn({ user }) {
      if (user.id) {
        console.log("[AUTH] User signed in, setting up categories:", user.id);
        try {
          await setupUserCategories(user.id);
        } catch (error) {
          console.error("[AUTH] Error setting up categories:", error);
        }
      }
      return true;
    },
  },
  events: {
    async signIn({ user, account }) {
      if (!process.env.NEXTAUTH_SECRET) {
        console.error("[Auth] NEXTAUTH_SECRET não está definido!");
      }
      console.log("[Auth] SignIn Event - User:", user.id, "Account type:", account?.provider);
      
      if (user.id) {
        try {
          await setupUserCategories(user.id);
          console.log("[Auth] Categorias configuradas com sucesso para o usuário:", user.id);
        } catch (error) {
          console.error("[Auth] Erro ao configurar categorias:", error);
        }
      }
    },
    async signOut({ token }) {
      console.log("[Auth] SignOut Event - Token:", token.id);
    },
  },
}; 