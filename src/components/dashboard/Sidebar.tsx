"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { House, Wrench, Users, Gear, CurrencyCircleDollar, Shield } from "@phosphor-icons/react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: House },
  { label: "Jobs", href: "/jobs", icon: Wrench },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Invoice Tracker", href: "/invoice-tracker", icon: CurrencyCircleDollar },
  { label: "Settings", href: "/settings", icon: Gear },
  { label: "Admin", href: "/admin", icon: Shield },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col z-40">
      <div className="p-4 border-b border-[var(--border)]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[var(--primary)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="font-display text-lg font-semibold text-[var(--text-primary)]">Mash</span>
        </Link>
      </div>
      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[var(--primary-muted)] text-[var(--primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-blue-50/50"
              )}
            >
              <Icon weight={isActive ? "fill" : "regular"} className="text-lg" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-2 px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
          <span className="text-xs text-[var(--text-muted)]">All systems operational</span>
        </div>
      </div>
    </aside>
  );
}
