import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { compare } from "bcryptjs";
import { setupUserCategories } from "./categories";
import NextAuth from "next-auth";
import { authConfig } from "./auth-config";

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
    signIn: "/login",
    error: "/login",
    newUser: "/register",
  },
  debug: true, // Habilitar debug em produção temporariamente
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
      console.log("[Auth] JWT Callback - Token:", token, "User:", user?.id);
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("[Auth] Session Callback - Session:", session?.user?.email, "Token:", token.sub);
      if (session?.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      console.log("[Auth] SignIn Callback - User:", user.id, "Account:", account?.provider);
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
    async redirect({ url, baseUrl }) {
      console.log("[Auth] Redirect Callback - URL:", url, "BaseURL:", baseUrl);
      
      // Se a URL começar com a baseUrl, permita o redirecionamento
      if (url.startsWith(baseUrl)) {
        console.log("[Auth] URL começa com baseUrl, permitindo redirecionamento");
        return url;
      }
      
      // Se a URL for relativa, adicione a baseUrl
      if (url.startsWith("/")) {
        const redirectUrl = `${baseUrl}${url}`;
        console.log("[Auth] URL relativa, redirecionando para:", redirectUrl);
        return redirectUrl;
      }
      
      // Se a URL for externa e começar com http, permita
      if (url.startsWith("http")) {
        console.log("[Auth] URL externa, permitindo redirecionamento");
        return url;
      }
      
      // Por padrão, redirecione para o dashboard
      const defaultUrl = `${baseUrl}/dashboard`;
      console.log("[Auth] Redirecionando para URL padrão:", defaultUrl);
      return defaultUrl;
    },
  },
  events: {
    async signIn({ user, account }) {
      console.log("[Auth] SignIn Event - User:", user.id, "Account:", account?.provider);
    },
    async signOut({ token }) {
      console.log("[Auth] SignOut Event - Token:", token.sub);
    },
  },
};

export const { auth, signIn, signOut } = NextAuth(authConfig); 