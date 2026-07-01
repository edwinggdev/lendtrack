"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function TopAppBar() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  function handleCerrar() {
    setOpen(false);
    logout();
  }

  return (
    <header className="bg-surface sticky top-0 z-50 flex justify-between items-center h-touch-target px-margin-mobile w-full">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden">
          <span className="material-symbols-outlined text-on-secondary-container">account_balance</span>
        </div>
        <h1 className="font-display text-display text-secondary text-[20px] leading-tight">PrestaTrack</h1>
      </Link>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-10 h-10 flex items-center justify-center text-primary active:opacity-70 transition-opacity"
        >
          <span className="material-symbols-outlined">more_vert</span>
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-full mt-1 z-50 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg min-w-[160px] overflow-hidden">
              <Link
                href="/formas-pago"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 font-body-lg text-body-lg text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-on-surface-variant">payments</span>
                F pago
              </Link>
              <button
                onClick={handleCerrar}
                className="w-full flex items-center gap-3 px-4 py-3 font-body-lg text-body-lg text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-on-surface-variant">logout</span>
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
