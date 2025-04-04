import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cn } from "@/lib/utils";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { WelcomePopup } from "@/components/atoms/welcome-popup";
import { TransactionsProvider } from "@/contexts/transactions-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BudgetBrain",
  description: "Smart financial tracking for smarter decisions",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/brain-money-light.svg",
        href: "/brain-money-light.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/brain-money-dark.svg",
        href: "/brain-money-dark.svg",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/brain-money-light.svg" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/brain-money-dark.svg" media="(prefers-color-scheme: dark)" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider session={session}>
            <TransactionsProvider>
              <ToastProvider>
                <div className="relative flex min-h-screen flex-col">
                  <div className="flex-1">
                    {children}
                  </div>
                  <WelcomePopup />
                </div>
              </ToastProvider>
            </TransactionsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 