"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePrestamo } from "@/app/actions";

interface Props {
  prestamoId: string;
  initialMonto: number;
  initialDescripcion: string;
}

export default function EditableLoanInfo({ prestamoId, initialMonto, initialDescripcion }: Props) {
  const [editing, setEditing] = useState(false);
  const [monto, setMonto] = useState(initialMonto.toString());
  const [descripcion, setDescripcion] = useState(initialDescripcion);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSave() {
    setSaving(true);
    await updatePrestamo(prestamoId, {
      monto: parseFloat(monto),
      descripcion,
    });
    setSaving(false);
    setEditing(false);
    router.refresh();
  }

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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant">Monto</label>
              <input
                type="number"
                step="0.01"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="w-full h-touch-target px-3 mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg font-title-md text-title-md focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
              />
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant">Descripcion</label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full h-touch-target px-3 mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-lg text-body-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => { setEditing(false); setMonto(initialMonto.toString()); setDescripcion(initialDescripcion); }}
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
