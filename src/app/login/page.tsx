"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, contrasena }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al iniciar sesion");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ nombre: data.nombre, usuario: data.usuario }));
      router.push("/");
      router.refresh();
    } catch {
      setError("Error de conexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-margin-mobile">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-on-secondary-container text-[40px]">account_balance</span>
          </div>
          <h1 className="font-display text-headline-lg text-secondary">LendTrack</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Loan Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_12px_rgba(15,23,42,0.08)] border border-outline-variant/30 space-y-stack-md">
          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="usuario">Usuario</label>
            <div className="relative rounded-lg border border-outline-variant transition-all focus-within:border-secondary focus-within:shadow-[0_0_0_4px_rgba(49,107,243,0.1)]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">person</span>
              <input
                className="w-full h-touch-target pl-12 pr-4 bg-transparent border-none rounded-lg focus:ring-0 font-body-lg text-body-lg text-on-surface placeholder:text-outline-variant"
                id="usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Usuario"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="contrasena">Contrasena</label>
            <div className="relative rounded-lg border border-outline-variant transition-all focus-within:border-secondary focus-within:shadow-[0_0_0_4px_rgba(49,107,243,0.1)]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">lock</span>
              <input
                className="w-full h-touch-target pl-12 pr-4 bg-transparent border-none rounded-lg focus:ring-0 font-body-lg text-body-lg text-on-surface placeholder:text-outline-variant"
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="Contraseña"
              />
            </div>
          </div>

          {error && (
            <p className="font-body-md text-body-md text-error bg-error-container/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-touch-target bg-secondary text-on-secondary rounded-lg font-title-md text-title-md hover:bg-on-secondary-fixed-variant active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin">hourglass_empty</span>
                Ingresando...
              </span>
            ) : (
              <>
                <span className="material-symbols-outlined">login</span>
                Ingresar
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
