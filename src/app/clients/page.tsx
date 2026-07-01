"use client";

import { useState, useEffect } from "react";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import Link from "next/link";

const avatarBgOptions = [
  "bg-primary-fixed text-on-primary-fixed",
  "bg-error-container text-on-error-container",
  "bg-secondary-fixed text-on-secondary-fixed",
  "bg-surface-container-high text-on-surface",
  "bg-secondary-container text-on-secondary-container",
];

interface Client {
  _id: string;
  nombre: string;
  balance: number;
  totalLoan: number;
  totalPaid: number;
  lastPaymentDate: string | null;
  isDelinquent: boolean;
  initials: string;
}

const PAGE_SIZE = 20;

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setClients)
      .catch(() => setDbError(true));
  }, []);

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return c.nombre.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <>
      <TopAppBar />
      <main className="pt-4 pb-24 px-margin-mobile min-h-screen">
        <section className="flex justify-between items-center">
          <div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Clientes</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">{filtered.length} de {clients.length} clientes</p>
          </div>
        </section>

        {dbError && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <p className="font-body-md text-body-md">Problema con la Base de Datos</p>
          </div>
        )}

        <div className="sticky top-14 py-stack-md z-40 -mx-margin-mobile px-margin-mobile bg-background/80 backdrop-blur-md">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              className="w-full h-touch-target pl-10 pr-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all font-body-md text-body-md"
              placeholder="Buscar cliente..."
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            />
          </div>
        </div>

        <div className="flex gap-2 mb-stack-lg overflow-x-auto no-scrollbar py-2">
          {["Todos", "Al dia", "Atrasado"].map((chip) => (
            <button
              key={chip}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-label-md text-label-md transition-colors ${
                chip === "Todos"
                  ? "bg-secondary-container text-on-secondary-container"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="space-y-stack-md">
          {paged.length === 0 && (
            <p className="text-center text-on-surface-variant py-10">No clientes registrados. Registra tu primer cliente.</p>
          )}
          {paged.map((client, i) => {
            return <Link
              key={client._id}
              href={`/clients/${client._id}`}
              className="block bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-transform active:scale-[0.98]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full ${avatarBgOptions[i % avatarBgOptions.length]} flex items-center justify-center font-title-md`}>
                    {client.initials}
                  </div>
                  <div>
                    <h3 className="font-title-md text-title-md">{client.nombre}</h3>
                    <p className="text-on-surface-variant text-label-md">ID: #{client._id.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  client.isDelinquent
                    ? "bg-error-container text-on-error-container"
                    : "bg-green-100 text-green-700"
                }`}>
                  {client.isDelinquent ? "Atrasado" : "Al dia"}
                </span>
              </div>
              <div className={`grid grid-cols-2 gap-4 p-3 rounded-lg ${
                client.isDelinquent ? "bg-error-container/10" : "bg-surface-container-low"
              }`}>
                <div>
                  <p className="text-on-surface-variant text-label-md mb-1">Active Balance</p>
                  <p className={`font-title-md ${client.isDelinquent ? "text-error" : "text-secondary"}`}>
                    ${client.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-on-surface-variant text-label-md mb-1">
                    {client.isDelinquent ? "Con Atraso Desde" : "Ultimo Pago"}
                  </p>
                  <p className={`font-title-md ${client.isDelinquent ? "text-error" : "text-on-surface"}`}>
                    {client.lastPaymentDate
                      ? new Date(client.lastPaymentDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "Sin Pagos"}
                  </p>
                </div>
              </div>
            </Link>;
          })}
        </div>

        <Link
          href="/clients/new"
          className="fixed right-6 bottom-24 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40"
        >
          <span className="material-symbols-outlined text-[32px]">person_add</span>
        </Link>
      </main>
      <BottomNavBar />
    </>
  );
}