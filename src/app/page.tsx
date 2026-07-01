import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import UserGreeting from "@/components/UserGreeting";
import { getClients } from "@/app/actions";
import { getCollection } from "@/lib/mongodb";
import { Prestamo, Pago } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const prestamos = await getCollection<Prestamo>("Prestamo");
  const pagos = await getCollection<Pago>("Pago");
  const clients = await getClients();

  const allPrestamos = await prestamos.find({}).toArray();
  const allPagos = await pagos.find({}).toArray();

  const totalLent = allPrestamos.reduce((sum, p) => sum + p.monto, 0);
  const totalCollected = allPagos.reduce((sum, p) => sum + p.valor, 0);
  const activeLoans = allPrestamos.length;
  const overdueCount = clients.filter((c) => c.isDelinquent).length;
  const collectionRate = totalLent > 0 ? Math.round((totalCollected / totalLent) * 100) : 0;

  const recentPagos = [...allPagos]
    .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
    .slice(0, 5);

  return {
    totalLent,
    totalCollected,
    activeLoans,
    overdueCount,
    collectionRate,
    recentPagos,
    clients,
  };
}

export default async function Dashboard() {
  const data = await getDashboardData();

  return (
    <>
      <TopAppBar />
      <main className="px-margin-mobile pt-stack-lg flex flex-col gap-stack-lg">
        <section>
          <UserGreeting />
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mt-1">Resumen</h2>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-surface-container-lowest p-5 rounded-xl shadow-[0_4px_12px_rgba(15,23,42,0.08)] flex flex-col justify-between border border-outline-variant/30">
            <div className="flex items-center justify-between mb-4">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Invertido</span>
              <span className="material-symbols-outlined text-secondary">account_balance_wallet</span>
            </div>
            <div>
              <span className="font-amount-display text-amount-display text-primary">
                ${data.totalLent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
              <div className="flex items-center gap-1 text-green-600 mt-1">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span className="font-label-md text-label-md">+{data.collectionRate}% recaudado</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-[0_4px_12px_rgba(15,23,42,0.08)] border border-outline-variant/30">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-secondary-container bg-secondary-container/10 p-1 rounded-lg">pending_actions</span>
              <span className="font-label-md text-label-md text-on-surface-variant">Activos</span>
            </div>
            <p className="font-headline-lg-mobile text-headline-lg-mobile">{data.activeLoans}</p>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Loans processing</p>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-[0_4px_12px_rgba(15,23,42,0.08)] border border-outline-variant/30">
            <div className="flex items-center gap-2 mb-3 text-error">
              <span className="material-symbols-outlined bg-error-container/20 p-1 rounded-lg">warning</span>
              <span className="font-label-md text-label-md text-on-surface-variant">Alerta</span>
            </div>
            <p className="font-headline-lg-mobile text-headline-lg-mobile text-error">{data.overdueCount}</p>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Requieren Cobro</p>
          </div>
        </section>

        <section className="bg-surface-container-lowest p-5 rounded-xl shadow-[0_4px_12px_rgba(15,23,42,0.08)] border border-outline-variant/30">
          <div className="flex justify-between items-end mb-3">
            <div>
              <h3 className="font-title-md text-title-md">Tasa Recaudo </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Total recaudado vs prestado</p>
            </div>
            <span className="font-title-md text-title-md text-secondary">{data.collectionRate}%</span>
          </div>
          <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-secondary-container w-[78%] rounded-full transition-all duration-700"></div>
          </div>
        </section>

        <section className="flex flex-col gap-stack-md mb-8">
          <div className="flex justify-between items-center">
            <h3 className="font-title-md text-title-md">Pagos Recientes</h3>
            <button className="text-secondary font-label-md text-label-md hover:underline">Ver Todo</button>
          </div>
          <div className="flex flex-col gap-3">
            {data.recentPagos.length === 0 && (
              <p className="text-center text-on-surface-variant py-6">No pagos registrados.</p>
            )}
            {data.recentPagos.map((pago, i) => {
              const client = data.clients.find((c) => c._id!.toString() === pago.clienteId);
              return (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20 active:bg-surface-variant transition-colors duration-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary">P</span>
                    </div>
                    <div>
                      <p className="font-body-lg text-body-lg text-on-surface">{client?.nombre || "Unknown"}</p>
                      <p className="font-body-md text-body-md text-on-surface-variant">{pago.descripcion}</p>
                      <p className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[12px]">person</span>
                        {pago.registradoPor || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-title-md text-title-md text-secondary">
                      +${pago.valor.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="font-label-md text-label-md text-on-surface-variant">
                      {pago.fecha.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <BottomNavBar />
    </>
  );
}
