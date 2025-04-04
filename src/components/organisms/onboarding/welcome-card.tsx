"use client";

import { useState } from "react";
import { useTransactions } from "@/contexts/transactions-context";
import { QuickAddTransaction } from "@/components/organisms/dashboard/quick-add-transaction";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Button } from "@/components/atoms/ui/button";
import { ArrowRight, DollarSign, PieChart, BarChart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeCardProps {
  onComplete: () => void;
}

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ElementType;
}

export function WelcomeCard({ onComplete }: WelcomeCardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const { transactions } = useTransactions();

  const steps: OnboardingStep[] = [
    {
      title: "Welcome to Finance Tracker! ✨",
      description: "Your personal finance companion. Let's set you up for success with a guided tour of the main features.",
      icon: Sparkles,
    },
    {
      title: "Start Your Journey",
      description: "Begin by adding your first transaction. This will help you understand how the tracking system works.",
      icon: DollarSign,
    },
    {
      title: "Visual Insights",
      description: "Watch as your financial data comes to life through interactive charts and detailed breakdowns.",
      icon: PieChart,
    },
    {
      title: "Track Your Growth",
      description: "Monitor your progress over time and make informed financial decisions.",
      icon: BarChart,
    },
  ];

  const handleTransactionAdded = () => {
    if (transactions.length > 0) {
      setCurrentStep(3);
    }
  };

  const CurrentStepIcon = steps[currentStep - 1].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto max-w-4xl"
    >
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
          >
            <CurrentStepIcon className="h-6 w-6 text-primary" />
          </motion.div>
          <CardTitle className="text-2xl font-bold">
            {steps[currentStep - 1].title}
          </CardTitle>
          <CardDescription className="text-lg">
            {steps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 2 ? (
                <div className="mx-auto max-w-md">
                  <QuickAddTransaction
                    className="border-2 border-primary/50 shadow-lg"
                    onTransactionAdded={handleTransactionAdded}
                  />
                </div>
              ) : (
                <div className="flex justify-center gap-4">
                  {currentStep < steps.length ? (
                    <Button
                      size="lg"
                      onClick={() => setCurrentStep((prev) => prev + 1)}
                      className="group"
                    >
                      {currentStep === 1 ? "Get Started" : "Next"}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={onComplete}
                      className="group bg-primary hover:bg-primary/90"
                    >
                      Start Using Finance Tracker
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
} 