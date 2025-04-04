"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/ui/dialog";
import { BrainMoney } from "@/components/atoms/icons/brain-money";
import { useSession } from "next-auth/react";

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      const hasSeenWelcome = localStorage.getItem(`hasSeenWelcome_${session.user.id}`);
      if (!hasSeenWelcome) {
        setIsOpen(true);
        localStorage.setItem(`hasSeenWelcome_${session.user.id}`, "true");
      }
    }
  }, [session]);

  if (!session?.user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4 ring-2 ring-primary/20">
              <BrainMoney className="h-12 w-12 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Bem-vindo ao BudgetBrain!</DialogTitle>
          <DialogDescription className="text-center text-base">
            Sua plataforma inteligente para gerenciar suas finanças pessoais.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Com o BudgetBrain, você pode:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Acompanhar suas despesas e receitas</li>
            <li>• Definir metas financeiras</li>
            <li>• Visualizar relatórios detalhados</li>
            <li>• Receber insights sobre seus gastos</li>
          </ul>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} className="w-full">
            Começar a usar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 