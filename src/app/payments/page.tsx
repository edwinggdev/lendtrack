"use client";

import { useState, useEffect } from "react";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";

interface Payment {
  _id: string;
  consecutivo: number;
  fecha: string;
  valor: number;
  descripcion: string;
  clienteNombre: string;
  prestamoMonto: number;
  registradoPor: string;
}

const PAGE_SIZE = 20;

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    fetch("/api/pagos")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setPayments)
      .catch(() => setDbError(true));
  }, []);

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.clienteNombre.toLowerCase().includes(q) ||
      p.descripcion.toLowerCase().includes(q) ||
      `$${p.valor}`.includes(q) ||
      `#${String(p.consecutivo).padStart(5, '0')}`.includes(q)
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
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Payments</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">{payments.length} total payments</p>
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
              placeholder="Search by client, description, or amount..."
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            />
          </div>
        </div>

        <div className="space-y-stack-md">
          {paged.length === 0 && (
            <p className="text-center text-on-surface-variant py-10">
              {payments.length === 0 ? "No payments recorded yet." : "No payments match your search."}
            </p>
          )}
          {paged.map((p) => (
            <div
              key={p._id}
              className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-[0_4px_12px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-start gap-2 mb-3">
                <span className="mt-0.5 px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed rounded-md font-label-md text-label-md font-bold tabular-nums">#{String(p.consecutivo).padStart(5, '0')}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-title-md text-title-md text-on-surface truncate">{p.clienteNombre}</h3>
                  <p className="font-label-md text-label-md text-on-surface-variant truncate">{p.descripcion}</p>
                </div>
                <span className="shrink-0 px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase tracking-wider">
                  ${p.valor.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {new Date(p.fecha).toLocaleDateString("es-MX", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                </p>
                <p className="font-label-md text-label-md text-on-surface-variant">
                  Prestamo: ${p.prestamoMonto.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant">person</span>
                <p className="font-label-md text-label-md text-on-surface-variant">{p.registradoPor || "—"}</p>
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

        
      </main>
      <BottomNavBar />
    </>
  );
}
