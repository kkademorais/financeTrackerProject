"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/atoms/ui/button";
import { Input } from "@/components/atoms/ui/input";
import { useToast } from "@/components/atoms/ui/use-toast";
import { BrainMoney } from "@/components/atoms/icons/brain-money";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/ui/form";

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("[Login] Tentando login com email:", form.getValues("email"));
      
      const result = await signIn("credentials", {
        email: form.getValues("email"),
        password: form.getValues("password"),
        redirect: false,
        callbackUrl: "/dashboard",
      });

      console.log("[Login] Resultado do login:", result);

      if (result?.error) {
        console.error("[Login] Erro no login:", result.error);
        toast({
          variant: "destructive",
          title: "Erro no Login",
          description: result.error,
        });
        return;
      }

      if (result?.ok) {
        console.log("[Login] Login bem-sucedido, redirecionando para /dashboard");
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o dashboard...",
        });
        
        // Aguardar um momento para o toast ser exibido
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Forçar o redirecionamento
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("[Login] Error:", error);
      toast({
        variant: "destructive",
        title: "Erro no Login",
        description: "Erro ao fazer login. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    try {
      console.log(`[Login] Iniciando login com ${provider}`);
      // Usar window.location.href para forçar o redirecionamento
      const callbackUrl = encodeURIComponent("/dashboard");
      window.location.href = `/api/auth/signin/${provider}?callbackUrl=${callbackUrl}`;
    } catch (error) {
      console.error(`[Login] Error signing in with ${provider}:`, error);
      toast({
        variant: "destructive",
        title: "Erro na Autenticação",
        description: `Erro ao fazer login com ${provider}. Tente novamente.`,
      });
    }
  };

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <BrainMoney className="mr-2 h-6 w-6" />
          BudgetBrain
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "O BudgetBrain transformou completamente minha forma de gerenciar minhas finanças. Agora tenho total controle sobre meus gastos e receitas."
            </p>
            <footer className="text-sm">Sofia Oliveira</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Bem-vindo de volta
            </h1>
            <p className="text-sm text-muted-foreground">
              Digite suas credenciais para acessar sua conta
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </Form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link
              href="/register"
              className="underline underline-offset-4 hover:text-primary"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 