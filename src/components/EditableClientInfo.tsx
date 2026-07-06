"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateClient } from "@/app/actions";
import ContactButtons from "@/components/ContactButtons";

interface Props {
  clientId: string;
  nombre: string;
  direccion: string;
  contacto1: string;
  contacto2: string;
}

export default function EditableClientInfo({ clientId, nombre, direccion, contacto1, contacto2 }: Props) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ nombre, direccion, contacto1, contacto2 });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSave() {
    setSaving(true);
    await updateClient(clientId, form);
    setSaving(false);
    setEditing(false);
    router.refresh();
  }

  return (
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-headline-lg-mobile shrink-0">
        {initials(nombre)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface truncate">{nombre}</h2>
          <button onClick={() => setEditing(!editing)} className="text-secondary shrink-0">
            <span className="material-symbols-outlined text-sm">{editing ? "close" : "edit"}</span>
          </button>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant truncate">{direccion}</p>
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <div className="flex items-center gap-1">
            <strong className="font-label-md text-label-md">{contacto1}</strong>
            <ContactButtons contacto1={contacto1} />
          </div>
          {contacto2 && (
            <div className="flex items-center gap-1">
              <strong className="font-label-md text-label-md">{contacto2}</strong>
              <ContactButtons contacto1={contacto2} />
            </div>
          )}
        </div>
        {editing && (
          <div className="mt-3 space-y-3 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant">Contacto 1</label>
                <input
                  type="text"
                  value={form.contacto1}
                  onChange={(e) => setForm({ ...form, contacto1: e.target.value })}
                  className="w-full h-touch-target px-3 mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-lg text-body-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
                />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant">Contacto 2</label>
                <input
                  type="text"
                  value={form.contacto2}
                  onChange={(e) => setForm({ ...form, contacto2: e.target.value })}
                  className="w-full h-touch-target px-3 mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-lg text-body-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant">Nombre</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full h-touch-target px-3 mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg font-title-md text-title-md focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
                />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant">Direccion</label>
                <input
                  type="text"
                  value={form.direccion}
                  onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                  className="w-full h-touch-target px-3 mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-lg text-body-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => { setEditing(false); setForm({ nombre, direccion, contacto1, contacto2 }); }}
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
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
