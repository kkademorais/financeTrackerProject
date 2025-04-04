"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useToast } from "@/components/atoms/ui/use-toast";

function AuthStateChanged() {
  const { data: session, status } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    const initializeUser = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          // Tenta criar as categorias padrão
          const response = await fetch("/api/seed");
          if (!response.ok) {
            console.error("[AuthProvider] Error initializing user:", await response.text());
          } else {
            const data = await response.json();
            console.log("[AuthProvider] User initialized:", data);
          }
        } catch (error) {
          console.error("[AuthProvider] Error initializing user:", error);
        }
      }
    };

    initializeUser();
  }, [status, session?.user?.id]);

  return null;
}

export function AuthProvider({ children, session }: { children: React.ReactNode, session: any }) {
  return (
    <SessionProvider session={session}>
      <AuthStateChanged />
      {children}
    </SessionProvider>
  );
} 