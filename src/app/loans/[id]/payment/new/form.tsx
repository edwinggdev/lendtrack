"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPago } from "@/app/actions";

interface FormaPagoOption {
  _id: string;
  nombre: string;
  activo: boolean;
}

export default function PaymentForm({
  prestamoId,
  clienteId,
  clienteNombre,
  loanMonto,
  totalPaid,
  balance,
  loanDescripcion,
}: {
  prestamoId: string;
  clienteId: string;
  clienteNombre: string;
  loanMonto: number;
  totalPaid: number;
  balance: number;
  loanDescripcion: string;
}) {
  const [amount, setAmount] = useState("");
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formasPago, setFormasPago] = useState<FormaPagoOption[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/formas-pago")
      .then((r) => r.json())
      .then((list: FormaPagoOption[]) => setFormasPago(list.filter((f) => f.activo)));
  }, []);

  const remaining = balance - (parseFloat(amount) || 0);
  const overpayment = remaining < 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    setPending(true);
    const fd = new FormData(e.currentTarget);
    fd.set("clienteId", clienteId);
    fd.set("prestamoId", prestamoId);
    fd.set("valor", amount);
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      fd.set("registradoPor", user.nombre);
    }
    await createPago(fd);
    setPending(false);
    setSaved(true);
  }

  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2 });

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-stack-lg">
        <section className="bg-white/90 backdrop-blur-md rounded-xl p-5 shadow-[0_4px_12px_rgba(15,23,42,0.08)] space-y-stack-md border border-outline-variant/30">
          <div className="bg-surface-container-low rounded-lg p-3 flex items-center justify-between">
            <div>
              <p className="font-body-md text-body-md text-on-surface-variant">Cliente</p>
              <p className="font-title-md text-title-md text-on-surface">{clienteNombre}</p>
            </div>
            <p className="font-label-md text-label-md text-on-surface-variant">{loanDescripcion}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-container-lowest rounded-xl p-3 border border-outline-variant/20 text-center">
              <p className="font-label-md text-label-md text-on-surface-variant">Prestamo Total</p>
              <p className="font-title-md text-title-md text-on-surface">${fmt(loanMonto)}</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-3 border border-outline-variant/20 text-center">
              <p className="font-label-md text-label-md text-on-surface-variant">Pago</p>
              <p className="font-title-md text-title-md text-secondary">${fmt(totalPaid)}</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-3 border border-outline-variant/20 text-center">
              <p className="font-label-md text-label-md text-on-surface-variant">Restante</p>
              <p className={`font-title-md text-title-md ${balance > 0 ? "text-error" : "text-green-600"}`}>${fmt(balance)}</p>
            </div>
          </div>

          <div className="space-y-base pt-2">
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="valor">Monto a Pagar</label>
            <div className="relative rounded-lg border-2 border-secondary/30 transition-all focus-within:border-secondary focus-within:shadow-[0_0_0_4px_rgba(49,107,243,0.1)]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-[32px] font-bold">$</span>
              <input
                className="w-full h-[72px] pl-14 pr-4 bg-transparent border-none rounded-lg focus:ring-0 text-[32px] font-bold text-on-surface placeholder:text-outline-variant"
                id="valor"
                name="valor"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            {amount && (
              <p className="font-body-md text-body-md text-on-surface-variant text-center">
                Remaining after payment:{" "}
                <span className={overpayment ? "text-error font-semibold" : remaining > 0 ? "text-error font-semibold" : "text-green-600 font-semibold"}>
                  ${fmt(Math.max(remaining, 0))}
                </span>
                {overpayment && <span className="text-error font-semibold"> (overpayment)</span>}
              </p>
            )}
            <input type="hidden" name="clienteId" value={clienteId} />
            <input type="hidden" name="prestamoId" value={prestamoId} />
          </div>

          <div className="grid grid-cols-2 gap-gutter">
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="fecha">Fecha</label>
              <div className="relative rounded-lg border border-outline-variant transition-all focus-within:border-secondary focus-within:shadow-[0_0_0_4px_rgba(49,107,243,0.1)]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-sm">calendar_today</span>
                <input
                  className="w-full h-touch-target pl-9 pr-3 bg-transparent border-none rounded-lg focus:ring-0 font-body-lg text-body-lg text-on-surface"
                  id="fecha"
                  name="fecha"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="descripcion">Observación</label>
              <div className="relative rounded-lg border border-outline-variant transition-all focus-within:border-secondary focus-within:shadow-[0_0_0_4px_rgba(49,107,243,0.1)]">
                <span className="absolute left-3 top-3 material-symbols-outlined text-outline text-sm">description</span>
                <input
                  className="w-full h-touch-target pl-9 pr-3 bg-transparent border-none rounded-lg focus:ring-0 font-body-lg text-body-lg text-on-surface placeholder:text-outline-variant"
                  id="descripcion"
                  name="descripcion"
                  placeholder="Payment note..."
                  defaultValue=""
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="formaPagoId">Forma de Pago</label>
            <div className="relative rounded-lg border border-outline-variant transition-all focus-within:border-secondary focus-within:shadow-[0_0_0_4px_rgba(49,107,243,0.1)]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-sm">payments</span>
              <select
                id="formaPagoId"
                name="formaPagoId"
                className="w-full h-touch-target pl-9 pr-3 bg-transparent border-none rounded-lg focus:ring-0 font-body-lg text-body-lg text-on-surface appearance-none"
              >
                <option value="">Seleccionar...</option>
                {formasPago.map((fp) => (
                  <option key={fp._id} value={fp._id}>{fp.nombre}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <button
          type="submit"
          disabled={pending || !amount}
          className="w-full h-[56px] bg-secondary-container text-on-secondary-container rounded-full font-title-md text-title-md shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
          {pending ? "Procesando..." : "Procesar Pago"}
        </button>
      </form>

      {saved && (
        <div
          className="fixed inset-0 z-[60] bg-on-background/40 backdrop-blur-sm flex items-center justify-center p-margin-mobile"
          onClick={() => { setSaved(false); router.push(`/loans/${prestamoId}`); router.refresh(); }}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl p-stack-lg w-full max-w-xs text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-stack-md">
              <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">Pago guardado</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">
              ${fmt(parseFloat(amount))} payment registered for {clienteNombre}.
            </p>
            <button
              className="w-full h-touch-target bg-secondary text-on-secondary rounded-lg font-title-md"
              onClick={() => { setSaved(false); router.push(`/loans/${prestamoId}`); router.refresh(); }}
            >
              View Loan
            </button>
          </div>
        </div>
      )}
    </>
  );
}
