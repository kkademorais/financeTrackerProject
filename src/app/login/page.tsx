"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
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

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      console.log("[Login] Attempting login for:", data.email);

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      console.log("[Login] SignIn result:", result);

      if (!result) {
        console.error("[Login] No response from server");
        toast({
          variant: "destructive",
          title: "Erro no Login",
          description: "Não foi possível conectar ao servidor. Tente novamente.",
          duration: 5000,
        });
        return;
      }

      if (result.error) {
        console.error("[Login] Authentication error:", result.error);
        toast({
          variant: "destructive",
          title: "Erro no Login",
          description: result.error === "Invalid password" 
            ? "Senha incorreta. Tente novamente."
            : result.error === "No user found with this email"
            ? "Email não encontrado. Verifique ou crie uma conta."
            : "Ocorreu um erro durante o login. Tente novamente.",
          duration: 5000,
        });
        return;
      }

      if (result.ok) {
        console.log("[Login] Login successful for:", data.email);
        toast({
          title: "Login realizado com sucesso! 🎉",
          description: "Bem-vindo de volta! Você será redirecionado para a página inicial.",
          duration: 5000,
        });

        await new Promise(resolve => setTimeout(resolve, 2000));
        router.push("/");
        router.refresh();
      } else {
        console.error("[Login] Unexpected result:", result);
        toast({
          variant: "destructive",
          title: "Erro no Login",
          description: "Ocorreu um erro inesperado. Tente novamente.",
          duration: 5000,
        });
      }

    } catch (error) {
      console.error("[Login] Error during login:", error);
      toast({
        variant: "destructive",
        title: "Erro no Login",
        description: "Ocorreu um erro durante o login. Tente novamente.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleOAuthSignIn = async (provider: string) => {
    try {
      setIsLoading(true);
      console.log("[Login] Attempting OAuth login with:", provider);
      
      const result = await signIn(provider, { 
        callbackUrl: "/",
        redirect: false 
      });

      console.log("[Login] OAuth result:", result);

      if (result?.error) {
        console.error("[Login] OAuth error:", result.error);
        toast({
          variant: "destructive",
          title: "Erro na Autenticação",
          description: `Não foi possível fazer login com ${provider}. Tente novamente.`,
        });
      }
    } catch (error) {
      console.error("[Login] OAuth error:", error);
      toast({
        variant: "destructive",
        title: "Erro na Autenticação",
        description: `Não foi possível fazer login com ${provider}. Tente novamente.`,
      });
    } finally {
      setIsLoading(false);
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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