"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import { createPrestamo } from "@/app/actions";

interface SimpleClient {
  _id: string;
  nombre: string;
}

export default function NewLoan() {
  const [clients, setClients] = useState<SimpleClient[]>([]);
  const [pending, setPending] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SimpleClient | null>(null);
  const [open, setOpen] = useState(false);
  const [dbError, setDbError] = useState(false);
  const [clientError, setClientError] = useState(false);
  const [error, setError] = useState("");
  const [monto, setMonto] = useState("");
  const [interest, setinterest] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/clients/simple")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setClients)
      .catch(() => setDbError(true));
  }, []);

  const filtered = clients.filter((c) =>
    c.nombre.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) { setClientError(true); return; }
    if (!interest || parseFloat(interest) < 3) { setError("El interes no puede estar vacio y debe ser al menos 3%"); return; }
    setPending(true);
    setDbError(false);
    try {
      const fd = new FormData(e.currentTarget);
      fd.set("clienteId", selected._id);
      fd.set("interes", interest);
      const capital = monto && interest ? String(parseFloat(monto) + (parseFloat(monto) * parseFloat(interest) / 100)) : monto;
      fd.set("capital", capital);
      await createPrestamo(fd);
      router.push("/loans");
    } catch {
      setDbError(true);
      setPending(false);
    }
  }

  return (
    <>
      <TopAppBar />
      <main className="max-w-md mx-auto px-margin-mobile py-stack-lg pb-32">
        <section className="mb-stack-lg">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">Registrar Nuevo Prestamo</h2>
          {/* <p className="font-body-md text-on-surface-variant">&nbsp;</p> */}
        </section>

        {dbError && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <p className="font-body-md text-body-md">Problema con la Base de Datos</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-[0_4px_12px_rgba(15,23,42,0.08)] space-y-stack-md">
            <div className="space-y-1 relative">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Cliente
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">&nbsp;</span>
                <input
                  className="w-full h-touch-target pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-lg font-body-lg text-body-lg focus:border-secondary focus:shadow-[0_0_0_4px_rgba(49,107,243,0.1)] outline-none transition-all"
                  placeholder="Buscar clientes..."
                  value={selected ? selected.nombre : search}
                  onChange={(e) => { setSearch(e.target.value); setSelected(null); setOpen(true); setClientError(false); }}
                  onFocus={() => setOpen(true)}
                  onBlur={() => setTimeout(() => setOpen(false), 200)}
                />
                {selected && (
                  <button type="button" onClick={() => { setSelected(null); setSearch(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                )}
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
                </span>
              </div>
              {clientError && (
                <p className="font-body-md text-body-md text-error mt-1">Selecciona un cliente</p>
              )}
              {open && (
                <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filtered.length === 0 && (
                    <p className="p-3 text-center text-on-surface-variant font-body-md text-body-md">No cliente encontrado.</p>
                  )}
                  {filtered.map((c) => (
                    <button
                      type="button"
                      key={c._id}
                      className={`w-full text-left px-4 py-3 font-body-lg text-body-lg hover:bg-surface-container-low transition-colors ${selected?._id === c._id ? "bg-secondary-container/30" : ""}`}
                      onClick={() => { setSelected(c); setSearch(c.nombre); setOpen(false); setClientError(false); }}
                    >
                      {c.nombre}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-gutter">
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="monto">
                  Monto ($)
                </label>
                <div className="relative rounded-lg border border-outline-variant transition-all focus-within:border-secondary focus-within:shadow-[0_0_0_4px_rgba(49,107,243,0.1)]">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">attach_money</span>
                  <input
                    className="w-full h-touch-target pl-12 pr-4 bg-transparent border-none rounded-lg focus:ring-0 font-body-lg text-body-lg text-on-surface placeholder:text-outline-variant"
                    id="monto"
                    name="monto"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="interest">
                  % Interés <span className="text-error">* min 3</span>
                </label>
                <div className="relative rounded-lg border border-outline-variant transition-all focus-within:border-secondary focus-within:shadow-[0_0_0_4px_rgba(49,107,243,0.1)]">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">percent</span>
                  <input
                    className="w-full h-touch-target pl-12 pr-4 bg-transparent border-none rounded-lg focus:ring-0 font-body-lg text-body-lg text-on-surface placeholder:text-outline-variant"
                    id="interest"
                    type="number"
                    step="0.01"
                    min="3"
                    required
                    placeholder="0"
                    value={interest}
                    onChange={(e) => { setinterest(e.target.value); setError(""); }}
                  />
                </div>
                {error && <p className="font-body-md text-body-md text-error mt-1">{error}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Monto Total (Capital)
              </label>
              <div className="relative rounded-lg border border-outline-variant bg-surface-container-low">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">payments</span>
                <input
                  className="w-full h-touch-target pl-12 pr-4 bg-transparent border-none rounded-lg focus:ring-0 font-body-lg text-body-lg text-on-surface font-bold"
                  type="text"
                  readOnly
                  value={monto && interest ? `$${(parseFloat(monto) + (parseFloat(monto) * parseFloat(interest) / 100)).toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "$0.00"}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-gutter">
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="cuotas">
                  Cuotas
                </label>
                <div className="relative rounded-lg border border-outline-variant transition-all focus-within:border-secondary focus-within:shadow-[0_0_0_4px_rgba(49,107,243,0.1)]">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-sm">format_list_numbered</span>
                  <input
                    className="w-full h-touch-target pl-12 pr-4 bg-transparent border-none rounded-lg focus:ring-0 font-body-lg text-body-lg text-on-surface placeholder:text-outline-variant"
                    id="cuotas"
                    name="cuotas"
                    type="number"
                    min="1"
                    required
                    placeholder="12"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="periodicidad">
                  Periodo
                </label>
                <div className="relative rounded-lg border border-outline-variant transition-all focus-within:border-secondary focus-within:shadow-[0_0_0_4px_rgba(49,107,243,0.1)]">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-sm">&nbsp;</span>
                  <select
                    id="periodicidad"
                    name="periodicidad"
                    className="w-full h-touch-target pl-12 pr-4 bg-transparent border-none rounded-lg focus:ring-0 font-body-lg text-body-lg text-on-surface appearance-none"
                  >
                    <option value="mensual">Mensual</option>
                    <option value="semanal">Semanal</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="fecha">
                Fecha
              </label>
              <div className="relative rounded-lg border border-outline-variant transition-all focus-within:border-secondary focus-within:shadow-[0_0_0_4px_rgba(49,107,243,0.1)]">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">calendar_today</span>
                <input
                  className="w-full h-touch-target pl-12 pr-4 bg-transparent border-none rounded-lg focus:ring-0 font-body-lg text-body-lg text-on-surface"
                  id="fecha"
                  name="fecha"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="descripcion">
                Descripción
              </label>
              <div className="relative rounded-lg border border-outline-variant transition-all focus-within:border-secondary focus-within:shadow-[0_0_0_4px_rgba(49,107,243,0.1)]">
                <span className="absolute left-4 top-4 material-symbols-outlined text-outline">description</span>
                <textarea
                  className="w-full pl-12 pr-4 py-3 bg-transparent border-none rounded-lg focus:ring-0 font-body-lg text-body-lg text-on-surface placeholder:text-outline-variant resize-none"
                  id="descripcion"
                  name="descripcion"
                  placeholder="Descripción del prestamo..."
                  rows={2}
                />
              </div>
            </div>

            <div className="pt-stack-md">
              <button
                type="submit"
                disabled={pending}
                className="w-full h-touch-target bg-secondary text-on-secondary rounded-lg font-title-md text-title-md hover:bg-on-secondary-fixed-variant active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined">add_card</span>
                {pending ? "Creando..." : "Registrar Prestamo"}
              </button>
            </div>
          </div>
        </form>
      </main>
      <BottomNavBar />
    </>
  );
}
