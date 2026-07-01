"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Principal", icon: "dashboard" },
  { href: "/clients", label: "Clientes", icon: "group" },
  { href: "/loans", label: "Prestamos", icon: "account_balance" },
  { href: "/payments", label: "Pagos", icon: "payments" },
];

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-surface-container-lowest shadow-[0_-4px_12px_rgba(15,23,42,0.08)] flex justify-around items-center h-touch-target px-margin-mobile">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        const isFilled = isActive ? "FILL" : 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center px-4 py-1 active:scale-95 duration-100 transition-colors ${
              isActive
                ? "bg-secondary-container text-on-secondary-container rounded-full"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${isFilled}` }}>
              {item.icon}
            </span>
            <span className="font-label-md text-label-md">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
