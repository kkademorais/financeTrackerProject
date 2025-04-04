import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export function useOnboarding() {
  const { data: session } = useSession();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Em uma implementação real, isso seria uma verificação no banco de dados
    // para ver se o usuário já tem transações
    const hasTransactions = true; // Simulando um usuário existente
    setShowOnboarding(!hasTransactions);
  }, [session]);

  const completeOnboarding = () => {
    setShowOnboarding(false);
    // Em uma implementação real, isso seria uma chamada à API
    // para marcar o usuário como tendo completado o onboarding
  };

  return {
    showOnboarding,
    completeOnboarding,
  };
} 