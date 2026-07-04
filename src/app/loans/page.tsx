"use client";

import { useState, useEffect } from "react";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import Link from "next/link";

interface Loan {
  _id: string;
  consecutivo: number;
  fecha: string;
  monto: number;
  capital: number;
  descripcion: string;
  clienteId: string;
  clienteNombre: string;
  totalPaid: number;
  balance: number;
  isFullyPaid: boolean;
}

const PAGE_SIZE = 20;

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    fetch("/api/loans")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setLoans)
      .catch(() => setDbError(true));
  }, []);

  const filtered = loans.filter((loan) => {
    const q = search.toLowerCase();
    return (
      loan.clienteNombre.toLowerCase().includes(q) ||
      loan.descripcion.toLowerCase().includes(q) ||
      `$${loan.capital}`.includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <>
      <TopAppBar />
      <main className="px-margin-mobile pt-stack-lg pb-24 flex flex-col gap-stack-lg">
        <section className="flex justify-between items-center">
          <div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Prestamos</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">{filtered.length} de {loans.length} prestamos</p>
          </div>
        </section>

        {dbError && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <p className="font-body-md text-body-md">Problema con la Base de Datos</p>
          </div>
        )}

        <div className="sticky top-14 z-40 -mx-margin-mobile px-margin-mobile bg-background/80 backdrop-blur-md">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              className="w-full h-touch-target pl-10 pr-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all font-body-md text-body-md"
              placeholder="Busca por cliente, descripcion, o monto..."
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            />
          </div>
        </div>

        <div className="space-y-stack-md">
          {paged.length === 0 && (
            <p className="text-center text-on-surface-variant py-10">
              {loans.length === 0 ? "No prestamos registrados." : "Prestamos no encontrados."}
            </p>
          )}
          {paged.map((loan) => (
            <div
              key={loan._id}
              className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-[0_4px_12px_rgba(15,23,42,0.08)]"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-title-md text-title-md text-on-surface">{loan.clienteNombre}</h3>
                  <p className="font-label-md text-label-md text-on-surface-variant">#{String(loan.consecutivo).padStart(5, '0')} &middot; {loan.descripcion}</p>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  loan.isFullyPaid ? "bg-green-100 text-green-700" : loan.balance > 0 && loan.totalPaid > 0 ? "bg-yellow-100 text-yellow-700" : "bg-error-container text-on-error-container"
                }`}>
                  {loan.isFullyPaid ? "Paid" : loan.totalPaid > 0 ? "Parcial" : "No Pago"}
                </span>
              </div>
              <Link href={`/loans/${loan._id}`} className="block active:scale-[0.98] transition-transform">
                <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-surface-container-low rounded-lg cursor-pointer hover:bg-surface-container transition-colors">
                  <div>
                    <p className="text-on-surface-variant text-label-md mb-1">Capital</p>
                    <p className="font-title-md text-on-surface">
                      ${loan.capital.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant text-label-md mb-1">Pago</p>
                    <p className="font-title-md text-secondary">
                      ${loan.totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-on-surface-variant text-label-md mb-1">Restante</p>
                    <p className={`font-title-md ${loan.isFullyPaid ? "text-green-600" : "text-error"}`}>
                      ${loan.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="flex items-center justify-between">
                <p className="font-label-md text-label-md text-on-surface-variant">
                  {new Date(loan.fecha).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
                <div className="h-2 flex-1 max-w-[120px] bg-surface-container rounded-full overflow-hidden mx-3">
                  <div
                    className={`h-full rounded-full transition-all ${
                      loan.isFullyPaid ? "bg-green-500" : loan.totalPaid > 0 ? "bg-secondary-container" : "bg-error/40"
                    }`}
                    style={{ width: `${Math.min((loan.totalPaid / loan.capital) * 100, 100)}%` }}
                  />
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  {loan.capital > 0 ? Math.round((loan.totalPaid / loan.capital) * 100) : 0}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-stack-md">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-lowest border border-outline-variant disabled:opacity-30 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-10 h-10 rounded-lg font-title-md text-title-md active:scale-95 transition-all ${
                  i === page
                    ? "bg-secondary-container text-on-secondary-container"
                    : "bg-surface-container-lowest text-on-surface-variant border border-outline-variant"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-lowest border border-outline-variant disabled:opacity-30 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        )}

        <Link
          href="/loans/new"
          className="fixed right-6 bottom-24 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40"
        >
          <span className="material-symbols-outlined text-[32px]">add</span>
        </Link>
      </main>
      <BottomNavBar />
    </>
  );
}
