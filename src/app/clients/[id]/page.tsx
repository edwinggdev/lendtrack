import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import EditableClientInfo from "@/components/EditableClientInfo";
import { getClientById } from "@/app/actions";
import Link from "next/link";

export default async function ClientDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const client = await getClientById(id);

  if (!client) {
    return (
      <>
        <TopAppBar />
        <main className="px-margin-mobile pt-stack-lg text-center text-on-surface-variant py-20">Client not found.</main>
        <BottomNavBar />
      </>
    );
  }

  return (
    <>
      <TopAppBar />
      <main className="px-margin-mobile pt-stack-lg pb-24 flex flex-col gap-stack-lg">
        <Link href="/clients" className="flex items-center gap-1 text-secondary font-label-md text-label-md">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Clients
        </Link>

        <section>
          <EditableClientInfo
            clientId={id}
            nombre={client.nombre}
            direccion={client.direccion}
            contacto1={client.contacto1}
            contacto2={client.contacto2}
          />
        </section>

        <section>
          <h3 className="font-title-md text-title-md text-on-surface mb-3">Prestamos ({client.loans.length})</h3>
          <div className="space-y-stack-md">
            {client.loans.length === 0 && (
              <p className="text-center text-on-surface-variant py-6">No loans for this client.</p>
            )}
            {client.loans.map((loan) => (
              <Link
                key={loan._id}
                href={`/loans/${loan._id}`}
                className="block bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-[0_4px_12px_rgba(15,23,42,0.08)] active:scale-[0.98] transition-transform"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-title-md text-title-md text-on-surface">${loan.monto.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                    <p className="font-label-md text-label-md text-on-surface-variant">#{String(loan.consecutivo).padStart(5, '0')} &middot; {loan.descripcion}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    loan.isFullyPaid ? "bg-green-100 text-green-700" : loan.totalPaid > 0 ? "bg-yellow-100 text-yellow-700" : "bg-error-container text-on-error-container"
                  }`}>
                    {loan.isFullyPaid ? "Paid" : loan.totalPaid > 0 ? "Partial" : "Unpaid"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 p-3 bg-surface-container-low rounded-lg">
                  <div>
                    <p className="text-on-surface-variant text-label-md mb-1">Monyo</p>
                    <p className="font-title-md text-on-surface">${loan.monto.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant text-label-md mb-1">Pago</p>
                    <p className="font-title-md text-secondary">${loan.totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-on-surface-variant text-label-md mb-1">Restante</p>
                    <p className={`font-title-md ${loan.isFullyPaid ? "text-green-600" : "text-error"}`}>
                      ${loan.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant mt-2">
                  {loan.fecha.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <BottomNavBar />
    </>
  );
}
