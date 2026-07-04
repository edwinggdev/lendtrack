import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import EditableLoanInfo from "@/components/EditableLoanInfo";
import { getPagosByPrestamo } from "@/app/actions";
import Link from "next/link";

export default async function LoanDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const data = await getPagosByPrestamo(id);

  if (!data.prestamo) {
    return (
      <>
        <TopAppBar />
        <main className="px-margin-mobile pt-stack-lg text-center text-on-surface-variant py-20">
          Loan not found.
        </main>
        <BottomNavBar />
      </>
    );
  }

  const { prestamo, pagos } = data;

  return (
    <>
      <TopAppBar />
      <main className="px-margin-mobile pt-stack-lg pb-24 flex flex-col gap-stack-lg">
        <Link href="/loans" className="flex items-center gap-1 text-secondary font-label-md text-label-md">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver a Prestamos
        </Link>

        <section>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">{prestamo.clienteNombre}</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">#{String(prestamo.consecutivo).padStart(5, '0')}</p>
          <EditableLoanInfo
            prestamoId={id}
            initialMonto={prestamo.monto}
            initialDescripcion={prestamo.descripcion}
            initialInteres={prestamo.interes}
            initialCapital={prestamo.capital}
            initialCuotas={prestamo.cuotas}
            initialPeriodicidad={prestamo.periodicidad}
          />
        </section>

        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
          <div className="flex justify-between items-start mb-3">
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
              prestamo.isFullyPaid ? "bg-green-100 text-green-700" : prestamo.balance > 0 && prestamo.totalPaid > 0 ? "bg-yellow-100 text-yellow-700" : "bg-error-container text-on-error-container"
            }`}>
              {prestamo.isFullyPaid ? "Paid" : prestamo.totalPaid > 0 ? "Parcial" : "Sin pago"}
            </span>
            <p className="font-label-md text-label-md text-on-surface-variant">
              {prestamo.fecha.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 p-3 bg-surface-container-low rounded-lg mb-4">
            <div>
              <p className="text-on-surface-variant text-label-md mb-1">Capital</p>
              <p className="font-title-md text-on-surface">
                ${prestamo.capital.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-on-surface-variant text-label-md mb-1">Pago</p>
              <p className="font-title-md text-secondary">
                ${prestamo.totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-on-surface-variant text-label-md mb-1">Restante</p>
              <p className={`font-title-md ${prestamo.isFullyPaid ? "text-green-600" : "text-error"}`}>
                ${prestamo.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="h-2 flex-1 bg-surface-container rounded-full overflow-hidden mr-3">
              <div
                className={`h-full rounded-full transition-all ${
                  prestamo.isFullyPaid ? "bg-green-500" : prestamo.totalPaid > 0 ? "bg-secondary-container" : "bg-error/40"
                }`}
                style={{ width: `${Math.min((prestamo.totalPaid / prestamo.capital) * 100, 100)}%` }}
              />
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant">
              {prestamo.capital > 0 ? Math.round((prestamo.totalPaid / prestamo.capital) * 100) : 0}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h3 className="font-title-md text-title-md text-on-surface">Historial ({pagos.length})</h3>
          <Link
            href={`/loans/${id}/payment/new`}
            className="bg-secondary text-on-secondary px-4 h-10 rounded-full font-title-md text-body-md flex items-center gap-1 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
            Agregar Pago
          </Link>
        </div>
        <section>
          
          <div className="space-y-stack-md">
            {pagos.length === 0 && (
              <p className="text-center text-on-surface-variant py-6">No payments recorded for this loan.</p>
            )}
            {pagos.map((pago) => (
              <div
                key={pago._id}
                className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-700 text-sm">check_circle</span>
                  </div>
                  <div>
                    <p className="font-body-lg text-body-lg text-on-surface">${pago.valor.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                    <p className="font-label-md text-label-md text-on-surface-variant">{pago.descripcion}</p>
                    <p className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[12px]">person</span>
                      {pago.registradoPor || "—"}
                    </p>
                  </div>
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant">
                  {pago.fecha.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <BottomNavBar />
    </>
  );
}
