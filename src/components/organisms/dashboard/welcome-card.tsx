"use client";

import { Button } from "@/components/atoms/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { ArrowRight } from "lucide-react";
import { QuickAddTransaction } from "./quick-add-transaction";
import { cn } from "@/lib/utils";

interface WelcomeCardProps {
  onComplete: () => void;
}

export function WelcomeCard({ onComplete }: WelcomeCardProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Welcome to FinTracker!</CardTitle>
        <CardDescription>
          Let's get started by adding your first transaction. You can categorize it
          to better track your finances.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <QuickAddTransaction onTransactionAdded={onComplete} />
        <div className="mt-4">
          <Button variant="outline" className="w-full" onClick={onComplete}>
            Skip for now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 