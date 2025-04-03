"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import { Dashboard } from "@/components/templates/dashboard";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  return <Dashboard />;
} 