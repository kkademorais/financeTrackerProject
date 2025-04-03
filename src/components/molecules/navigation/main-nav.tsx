"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
  },
  {
    title: "Transactions",
    href: "/transactions",
  },
  {
    title: "Calendar",
    href: "/calendar",
  },
  {
    title: "Categories",
    href: "/categories",
  },
  {
    title: "Reports",
    href: "/reports",
  },
];

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex items-center gap-6 text-sm", className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === item.href
              ? "text-foreground font-medium"
              : "text-foreground/60"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}