"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePrestamo } from "@/app/actions";

interface Props {
  prestamoId: string;
  initialMonto: number;
  initialDescripcion: string;
  initialInteres: number;
  initialCapital: number;
  initialCuotas: number;
  initialPeriodicidad: "mensual" | "semanal";
}

export default function EditableLoanInfo({ prestamoId, initialMonto, initialDescripcion, initialInteres, initialCapital, initialCuotas, initialPeriodicidad }: Props) {
  const [editing, setEditing] = useState(false);
  const [monto, setMonto] = useState(initialMonto.toString());
  const [interes, setInteres] = useState(initialInteres.toString());
  const [capital, setCapital] = useState(initialCapital.toString());
  const [descripcion, setDescripcion] = useState(initialDescripcion);
  const [cuotas, setCuotas] = useState(initialCuotas.toString());
  const [periodicidad, setPeriodicidad] = useState(initialPeriodicidad);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  function recalcCapital(m: string, i: string) {
    const montoVal = parseFloat(m) || 0;
    const interesVal = parseFloat(i) || 0;
    setCapital(String(montoVal + (montoVal * interesVal / 100)));
  }

  async function handleSave() {
    setSaving(true);
    await updatePrestamo(prestamoId, {
      monto: parseFloat(monto),
      descripcion,
      capital: parseFloat(capital),
      interes: parseFloat(interes),
      cuotas: parseInt(cuotas),
      periodicidad,
    });
    setSaving(false);
    setEditing(false);
    router.refresh();
  }

  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2 });

  return (
    <div>
      <div className="flex items-center gap-2">
        <p className="font-body-md text-body-md text-on-surface-variant">{initialDescripcion}</p>
        <button
          onClick={() => setEditing(!editing)}
          className="text-secondary hover:text-on-secondary-fixed-variant transition-colors"
        >
          <span className="material-symbols-outlined text-sm">{editing ? "close" : "edit"}</span>
        </button>
      </div>
      {editing && (
        <div className="mt-3 space-y-3 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant">Monto</label>
              <input
                type="number"
                step="0.01"
                value={monto}
                onChange={(e) => { setMonto(e.target.value); recalcCapital(e.target.value, interes); }}
                className="w-full h-touch-target px-3 mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg font-title-md text-title-md focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
              />
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant">Interes %</label>
              <input
                type="number"
                step="0.01"
                value={interes}
                onChange={(e) => { setInteres(e.target.value); recalcCapital(monto, e.target.value); }}
                className="w-full h-touch-target px-3 mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg font-title-md text-title-md focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
              />
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant">Capital</label>
              <div className="w-full h-touch-target px-3 mt-1 bg-surface-container-low border border-outline-variant rounded-lg font-title-md text-title-md flex items-center text-on-surface">
                ${fmt(parseFloat(capital) || 0)}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="font-label-md text-label-md text-on-surface-variant">Descripcion</label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full h-touch-target px-3 mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-lg text-body-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
              />
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant">Cuotas</label>
              <input
                type="number"
                min="1"
                value={cuotas}
                onChange={(e) => setCuotas(e.target.value)}
                className="w-full h-touch-target px-3 mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg font-title-md text-title-md focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
              />
            </div>
          </div>
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant">Periodicidad</label>
            <div className="flex gap-3 mt-1">
              <label className={`flex-1 flex items-center justify-center gap-2 h-touch-target rounded-lg border cursor-pointer active:scale-95 transition-all font-title-md text-title-md ${periodicidad === "mensual" ? "bg-secondary-container text-on-secondary-container border-secondary" : "bg-surface-container-lowest border-outline-variant text-on-surface"}`}>
                <input type="radio" name="periodicidad" value="mensual" checked={periodicidad === "mensual"} onChange={() => setPeriodicidad("mensual")} className="sr-only" />
                <span className="material-symbols-outlined text-sm">calendar_month</span>
                Mensual
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 h-touch-target rounded-lg border cursor-pointer active:scale-95 transition-all font-title-md text-title-md ${periodicidad === "semanal" ? "bg-secondary-container text-on-secondary-container border-secondary" : "bg-surface-container-lowest border-outline-variant text-on-surface"}`}>
                <input type="radio" name="periodicidad" value="semanal" checked={periodicidad === "semanal"} onChange={() => setPeriodicidad("semanal")} className="sr-only" />
                <span className="material-symbols-outlined text-sm">date_range</span>
                Semanal
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => { setEditing(false); setMonto(initialMonto.toString()); setInteres(initialInteres.toString()); setCapital(initialCapital.toString()); setDescripcion(initialDescripcion); setCuotas(initialCuotas.toString()); setPeriodicidad(initialPeriodicidad); }}
              className="h-9 px-4 bg-surface-container-high text-on-surface rounded-lg font-label-md text-label-md active:scale-95 transition-transform"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="h-9 px-4 bg-secondary text-on-secondary rounded-lg font-label-md text-label-md disabled:opacity-50 active:scale-95 transition-transform"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
