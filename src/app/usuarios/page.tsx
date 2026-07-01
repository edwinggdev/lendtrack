"use client";

import { useState, useEffect } from "react";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";

interface UsuarioItem {
  _id: string;
  nombre: string;
  usuario: string;
  status: "activo" | "inactivo";
  last_access: string | null;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioItem[]>([]);
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ nombre: "", usuario: "", contrasena: "" });

  useEffect(() => { load(); }, []);

  async function load() {
    const res = await fetch("/api/usuarios");
    if (res.ok) setUsuarios(await res.json());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!nombre.trim() || !username.trim() || !contrasena.trim()) return;
    setPending(true);
    const res = await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nombre.trim(), usuario: username.trim(), contrasena }),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok) {
      setError(data.error || "Error al crear usuario");
      return;
    }
    setNombre(""); setUsername(""); setContrasena("");
    load();
  }

  async function toggle(id: string) {
    await fetch("/api/usuarios", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  function startEdit(u: UsuarioItem) {
    setEditingId(u._id);
    setEditForm({ nombre: u.nombre, usuario: u.usuario, contrasena: "" });
  }

  async function saveEdit() {
    if (!editingId) return;
    const body: Record<string, unknown> = { id: editingId, nombre: editForm.nombre, usuario: editForm.usuario };
    if (editForm.contrasena.trim()) body.contrasena = editForm.contrasena;
    await fetch("/api/usuarios", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setEditingId(null);
    load();
  }

  return (
    <>
      <TopAppBar />
      <main className="px-margin-mobile pt-stack-lg pb-24 flex flex-col gap-stack-lg">
        <section>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Usuarios</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Administra los usuarios del sistema</p>
        </section>

        <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 space-y-stack-md">
          <h3 className="font-title-md text-title-md text-on-surface">Registrar nuevo usuario</h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full h-touch-target px-3 mt-1 bg-surface-container-low border border-outline-variant rounded-lg font-body-lg text-body-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-touch-target px-3 mt-1 bg-surface-container-low border border-outline-variant rounded-lg font-body-lg text-body-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
                placeholder="username"
              />
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant">Contrasena</label>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full h-touch-target px-3 mt-1 bg-surface-container-low border border-outline-variant rounded-lg font-body-lg text-body-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
                placeholder="********"
              />
            </div>
          </div>
          {error && <p className="font-body-md text-body-md text-error">{error}</p>}
          <button
            type="submit"
            disabled={pending || !nombre || !username || !contrasena}
            className="h-touch-target px-6 bg-secondary text-on-secondary rounded-lg font-title-md text-title-md disabled:opacity-50 active:scale-95 transition-transform"
          >
            {pending ? "Creando..." : "Crear Usuario"}
          </button>
        </form>

        <div className="space-y-stack-md">
          {usuarios.length === 0 && (
            <p className="text-center text-on-surface-variant py-10">No hay usuarios registrados.</p>
          )}
          {usuarios.map((u) => (
            editingId === u._id ? (
              <div key={u._id} className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant">Nombre</label>
                    <input
                      type="text"
                      value={editForm.nombre}
                      onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                      className="w-full h-touch-target px-3 mt-1 bg-surface-container-low border border-outline-variant rounded-lg font-body-lg text-body-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant">Usuario</label>
                    <input
                      type="text"
                      value={editForm.usuario}
                      onChange={(e) => setEditForm({ ...editForm, usuario: e.target.value })}
                      className="w-full h-touch-target px-3 mt-1 bg-surface-container-low border border-outline-variant rounded-lg font-body-lg text-body-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant">Nueva contrasena</label>
                    <input
                      type="password"
                      value={editForm.contrasena}
                      onChange={(e) => setEditForm({ ...editForm, contrasena: e.target.value })}
                      className="w-full h-touch-target px-3 mt-1 bg-surface-container-low border border-outline-variant rounded-lg font-body-lg text-body-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
                      placeholder="Dejar vacio para no cambiar"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button onClick={() => setEditingId(null)} className="h-9 px-4 bg-surface-container-high text-on-surface rounded-lg font-label-md text-label-md active:scale-95 transition-transform">Cancelar</button>
                  <button onClick={saveEdit} className="h-9 px-4 bg-secondary text-on-secondary rounded-lg font-label-md text-label-md active:scale-95 transition-transform">Guardar</button>
                </div>
              </div>
            ) : (
              <div
                key={u._id}
                className="flex items-center justify-between bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => startEdit(u)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-title-md text-title-md ${u.status === "activo" ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-high text-on-surface-variant"}`}>
                    {u.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-body-lg text-body-lg text-on-surface">{u.nombre}</p>
                    <p className="font-label-md text-label-md text-on-surface-variant">@{u.usuario}</p>
                    {u.last_access && (
                      <p className="font-label-md text-label-md text-on-surface-variant">
                        Ultimo acceso: {new Date(u.last_access).toLocaleDateString("es-MX", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggle(u._id); }}
                  className={`px-3 py-1.5 rounded-lg font-label-md text-label-md active:scale-95 transition-all ${
                    u.status === "activo"
                      ? "bg-error-container text-on-error-container"
                      : "bg-secondary-container text-on-secondary-container"
                  }`}
                >
                  {u.status === "activo" ? "Desactivar" : "Activar"}
                </button>
              </div>
            )
          ))}
        </div>
      </main>
      <BottomNavBar />
    </>
  );
}
