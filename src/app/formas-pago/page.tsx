"use client";

import { useState, useEffect } from "react";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";

interface FormaPago {
  _id: string;
  nombre: string;
  activo: boolean;
}

export default function FormasPagoPage() {
  const [formas, setFormas] = useState<FormaPago[]>([]);
  const [nombre, setNombre] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await fetch("/api/formas-pago");
    if (res.ok) setFormas(await res.json());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    setPending(true);
    await fetch("/api/formas-pago", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nombre.trim() }),
    });
    setNombre("");
    setPending(false);
    load();
  }

  async function toggle(id: string) {
    await fetch(`/api/formas-pago`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <>
      <TopAppBar />
      <main className="px-margin-mobile pt-stack-lg pb-24 flex flex-col gap-stack-lg">
        <section>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Formas de Pago</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Administra las formas de pago</p>
        </section>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className="flex-1 h-touch-target px-4 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-lg text-body-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
            placeholder="Nueva forma de pago..."
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <button
            type="submit"
            disabled={pending || !nombre.trim()}
            className="h-touch-target px-6 bg-secondary text-on-secondary rounded-lg font-title-md text-title-md disabled:opacity-50 active:scale-95 transition-transform"
          >
            Agregar
          </button>
        </form>

        <div className="space-y-stack-md">
          {formas.length === 0 && (
            <p className="text-center text-on-surface-variant py-10">No hay formas de pago registradas.</p>
          )}
          {formas.map((f) => (
            <div
              key={f._id}
              className="flex items-center justify-between bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30"
            >
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${f.activo ? "bg-green-500" : "bg-on-surface-variant/40"}`} />
                <p className={`font-body-lg text-body-lg ${f.activo ? "text-on-surface" : "text-on-surface-variant line-through"}`}>
                  {f.nombre}
                </p>
              </div>
              <button
                onClick={() => toggle(f._id)}
                className={`px-3 py-1.5 rounded-lg font-label-md text-label-md active:scale-95 transition-all ${
                  f.activo
                    ? "bg-error-container text-on-error-container"
                    : "bg-secondary-container text-on-secondary-container"
                }`}
              >
                {f.activo ? "Desactivar" : "Activar"}
              </button>
            </div>
          ))}
        </div>
      </main>
      <BottomNavBar />
    </>
  );
}
