import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth-config";

export default async function Home() {
  console.log("[Home] Verificando sessão...");
  
  const session = await getServerSession(authConfig);
  
  console.log("[Home] Session:", session?.user?.email);

  if (!session) {
    console.log("[Home] No session, redirecting to /register");
    redirect("/register");
  }

  console.log("[Home] Session found, redirecting to /dashboard");
  redirect("/dashboard");
} 