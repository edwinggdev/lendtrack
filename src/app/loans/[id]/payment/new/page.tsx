import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import { getCollection } from "@/lib/mongodb";
import { Prestamo, Cliente, Pago } from "@/lib/types";
import { ObjectId } from "mongodb";
import PaymentForm from "./form";

export default async function NewPaymentPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const prestamos = await getCollection<Prestamo>("Prestamo");
  const clientes = await getCollection<Cliente>("Cliente");
  const pagos = await getCollection<Pago>("Pago");

  const prestamo = await prestamos.findOne({ _id: new ObjectId(id) });
  if (!prestamo) {
    return (
      <>
        <TopAppBar />
        <main className="px-margin-mobile pt-stack-lg text-center text-on-surface-variant py-20">Loan not found.</main>
        <BottomNavBar />
      </>
    );
  }

  const cliente = await clientes.findOne({ _id: new ObjectId(prestamo.clienteId) });
  const loanPagos = await pagos.find({ prestamoId: id }).toArray();
  const totalPaid = loanPagos.reduce((sum, p) => sum + p.valor, 0);
  const balance = prestamo.monto - totalPaid;

  return (
    <>
      <TopAppBar />
      <main className="px-margin-mobile mt-stack-lg pb-24">
        <div className="max-w-md mx-auto space-y-stack-lg">
          <div className="space-y-base">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background">Registro de Pago</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Prestamo: <strong>#{String(prestamo.consecutivo).padStart(5, '0')}</strong>
            </p>
          </div>

          <PaymentForm
            prestamoId={id}
            clienteId={prestamo.clienteId}
            clienteNombre={cliente?.nombre || "Unknown"}
            loanMonto={prestamo.monto}
            totalPaid={totalPaid}
            balance={balance}
            loanDescripcion={prestamo.descripcion}
          />
        </div>
      </main>
      <BottomNavBar />
    </>
  );
}
