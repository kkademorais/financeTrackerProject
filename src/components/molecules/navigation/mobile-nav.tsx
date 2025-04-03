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

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col space-y-3 p-4">
      <Link href="/" className="flex items-center space-x-2 mb-6">
        <span className="text-xl font-bold">Finance Tracker</span>
      </Link>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex w-full items-center rounded-md p-2 text-sm font-medium transition-colors",
            pathname === item.href
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
} 