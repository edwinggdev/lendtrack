"use server";

import { getCollection } from "@/lib/mongodb";
import { Cliente, Pago, Prestamo, ClienteWithStats, PrestamoWithStats, FormaPago } from "@/lib/types";
import { ObjectId } from "mongodb";
import { getNextSequence } from "@/lib/sequence";

export async function createClient(formData: FormData) {
  const clientes = await getCollection<Cliente>("Cliente");
  await clientes.insertOne({
    uuid: crypto.randomUUID(),
    nombre: formData.get("full_name") as string,
    direccion: formData.get("address") as string,
    contacto1: formData.get("phone") as string,
    contacto2: (formData.get("phone2") as string) || "",
  });
}

export async function updateClient(
  clientId: string,
  data: { nombre?: string; direccion?: string; contacto1?: string; contacto2?: string },
) {
  const clientes = await getCollection<Cliente>("Cliente");
  const update: Record<string, unknown> = {};
  if (data.nombre !== undefined) update.nombre = data.nombre;
  if (data.direccion !== undefined) update.direccion = data.direccion;
  if (data.contacto1 !== undefined) update.contacto1 = data.contacto1;
  if (data.contacto2 !== undefined) update.contacto2 = data.contacto2;
  await clientes.updateOne({ _id: new ObjectId(clientId) }, { $set: update });
}

export async function getPrestamos(): Promise<PrestamoWithStats[]> {
  const prestamos = await getCollection<Prestamo>("Prestamo");
  const clientes = await getCollection<Cliente>("Cliente");
  const pagos = await getCollection<Pago>("Pago");

  const allPrestamos = await prestamos.find({}).sort({ fecha: -1 }).toArray();
  const allClientes = await clientes.find({}).toArray();
  const allPagos = await pagos.find({}).toArray();

  const clienteMap = new Map(allClientes.map((c) => [c._id!.toString(), c.nombre]));

  return allPrestamos.map((p) => {
    const loanPagos = allPagos.filter((pg) => pg.prestamoId === p._id!.toString());
    const totalPaid = loanPagos.reduce((sum, pg) => sum + pg.valor, 0);
    const balance = (p.capital || p.monto) - totalPaid;
    return {
      ...p,
      clienteNombre: clienteMap.get(p.clienteId) || "Unknown",
      totalPaid,
      balance,
      isFullyPaid: balance <= 0,
    };
  });
}

export async function createPrestamo(formData: FormData) {
  const prestamos = await getCollection<Prestamo>("Prestamo");
  const consecutivo = await getNextSequence("prestamo");
  const monto = parseFloat(formData.get("monto") as string);
  const interes = parseFloat(formData.get("interes") as string) || 0;
  const capital = parseFloat(formData.get("capital") as string) || monto;
  const cuotas = parseInt(formData.get("cuotas") as string) || 1;
  const periodicidad = (formData.get("periodicidad") as "mensual" | "semanal") || "mensual";
  await prestamos.insertOne({
    consecutivo,
    fecha: new Date(formData.get("fecha") as string),
    monto,
    capital,
    interes,
    cuotas,
    periodicidad,
    descripcion: formData.get("descripcion") as string,
    clienteId: formData.get("clienteId") as string,
  });
}

export async function getPagos() {
  const pagos = await getCollection<Pago>("Pago");
  const clientes = await getCollection<Cliente>("Cliente");
  const prestamos = await getCollection<Prestamo>("Prestamo");

  const allPagos = await pagos.find({}).sort({ fecha: -1 }).toArray();
  const allClientes = await clientes.find({}).toArray();
  const allPrestamos = await prestamos.find({}).toArray();

  const clienteMap = new Map(allClientes.map((c) => [c._id!.toString(), c.nombre]));
  const prestamoMap = new Map(allPrestamos.map((p) => [p._id!.toString(), p.monto]));

  return allPagos.map((p) => ({
    _id: p._id!,
    consecutivo: p.consecutivo,
    fecha: p.fecha,
    valor: p.valor,
    descripcion: p.descripcion,
    clienteId: p.clienteId,
    prestamoId: p.prestamoId,
    clienteNombre: clienteMap.get(p.clienteId) || "Unknown",
    prestamoMonto: prestamoMap.get(p.prestamoId) || 0,
    registradoPor: p.registradoPor || "",
  }));
}

export async function getPagosByPrestamo(prestamoId: string) {
  const pagos = await getCollection<Pago>("Pago");
  const clientes = await getCollection<Cliente>("Cliente");
  const prestamos = await getCollection<Prestamo>("Prestamo");

  const allPagos = await pagos.find({ prestamoId }).sort({ fecha: -1 }).toArray();
  const allClientes = await clientes.find({}).toArray();
  const prestamo = await prestamos.findOne({ _id: new ObjectId(prestamoId) });

  const clienteMap = new Map(allClientes.map((c) => [c._id!.toString(), c.nombre]));
  const clienteInfoMap = new Map(allClientes.map((c) => [c._id!.toString(), c]));
  const totalPaid = allPagos.reduce((sum, p) => sum + p.valor, 0);
  const balance = prestamo ? prestamo.capital - totalPaid : 0;

  const clienteInfo = prestamo ? clienteInfoMap.get(prestamo.clienteId) : undefined;

  return {
    prestamo: prestamo
      ? {
          _id: prestamo._id.toString(),
          consecutivo: prestamo.consecutivo,
          fecha: prestamo.fecha,
          monto: prestamo.monto,
          capital: prestamo.capital,
          interes: prestamo.interes,
          cuotas: prestamo.cuotas,
          periodicidad: prestamo.periodicidad,
          descripcion: prestamo.descripcion,
          clienteId: prestamo.clienteId,
          clienteNombre: clienteMap.get(prestamo.clienteId) || "Unknown",
          contacto1: clienteInfo?.contacto1 || "",
          contacto2: clienteInfo?.contacto2 || "",
          totalPaid,
          balance,
          isFullyPaid: balance <= 0,
        }
      : null,
    pagos: allPagos.map((p) => ({
      _id: p._id!.toString(),
      consecutivo: p.consecutivo,
      fecha: p.fecha,
      valor: p.valor,
      descripcion: p.descripcion,
      clienteNombre: clienteMap.get(p.clienteId) || "Unknown",
      registradoPor: p.registradoPor || "",
    })),
  };
}

export async function createPago(formData: FormData) {
  const pagos = await getCollection<Pago>("Pago");
  const consecutivo = await getNextSequence("pago");
  const formaPagoId = formData.get("formaPagoId") as string;
  await pagos.insertOne({
    consecutivo,
    fecha: new Date(formData.get("fecha") as string),
    valor: parseFloat(formData.get("valor") as string),
    descripcion: formData.get("descripcion") as string,
    clienteId: formData.get("clienteId") as string,
    prestamoId: formData.get("prestamoId") as string,
    registradoPor: formData.get("registradoPor") as string || "",
    ...(formaPagoId ? { formaPagoId } : {}),
  });
}

export async function anularPago(pagoId: string) {
  const pagos = await getCollection<Pago>("Pago");
  await pagos.updateOne(
    { _id: new ObjectId(pagoId) },
    { $set: { descripcion: "ANULADO" } }
  );
}

export async function getClientById(id: string) {
  const clientes = await getCollection<Cliente>("Cliente");
  const prestamos = await getCollection<Prestamo>("Prestamo");
  const pagos = await getCollection<Pago>("Pago");

  const cliente = await clientes.findOne({ _id: new ObjectId(id) });
  if (!cliente) return null;

  const loanPrestamos = await prestamos.find({ clienteId: id }).sort({ fecha: -1 }).toArray();
  const allPagos = await pagos.find({}).toArray();

  const loans = loanPrestamos.map((p) => {
    const loanPagos = allPagos.filter((pg) => pg.prestamoId === p._id!.toString());
    const totalPaid = loanPagos.reduce((sum, pg) => sum + pg.valor, 0);
    const balance = p.monto - totalPaid;
    return {
      _id: p._id!.toString(),
      consecutivo: p.consecutivo,
      fecha: p.fecha,
      monto: p.monto,
      descripcion: p.descripcion,
      totalPaid,
      balance,
      isFullyPaid: balance <= 0,
    };
  });

  const initials = cliente.nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return {
    _id: cliente._id!.toString(),
    nombre: cliente.nombre,
    direccion: cliente.direccion,
    contacto1: cliente.contacto1,
    contacto2: cliente.contacto2,
    uuid: cliente.uuid,
    initials,
    loans,
  };
}

export async function getClientsSimple() {
  const clientes = await getCollection<Cliente>("Cliente");
  return await clientes.find({}).project({ _id: 1, nombre: 1 }).toArray();
}

export async function getClients(): Promise<ClienteWithStats[]> {
  const clientes = await getCollection<Cliente>("Cliente");
  const prestamos = await getCollection<Prestamo>("Prestamo");
  const pagos = await getCollection<Pago>("Pago");

  const allClients = await clientes.find({}).toArray();
  const allPrestamos = await prestamos.find({}).toArray();
  const allPagos = await pagos.find({}).toArray();

  return allClients.map((c) => {
    const totalLoan = allPrestamos
      .filter((p) => p.clienteId === c._id!.toString())
      .reduce((sum, p) => sum + p.monto, 0);

    const clientPagos = allPagos
      .filter((p) => p.clienteId === c._id!.toString())
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());

    const totalPaid = clientPagos.reduce((sum, p) => sum + p.valor, 0);
    const balance = totalLoan - totalPaid;
    const lastPaymentDate = clientPagos.length > 0 ? clientPagos[0].fecha : null;
    const isDelinquent =
      balance > 0 &&
      (lastPaymentDate
        ? Date.now() - lastPaymentDate.getTime() > 90 * 24 * 60 * 60 * 1000
        : true);

    const initials = c.nombre
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return {
      ...c,
      _id: c._id,
      totalLoan,
      totalPaid,
      balance,
      lastPaymentDate,
      isDelinquent,
      initials,
    };
  });
}

export async function getFormasPago() {
  const formas = await getCollection<FormaPago>("FormaPago");
  return await formas.find({}).sort({ nombre: 1 }).toArray();
}

export async function createFormaPago(formData: FormData) {
  const formas = await getCollection<FormaPago>("FormaPago");
  await formas.insertOne({
    nombre: formData.get("nombre") as string,
    activo: true,
  });
}

export async function updatePrestamo(prestamoId: string, data: { monto?: number; descripcion?: string; capital?: number; interes?: number; cuotas?: number; periodicidad?: "mensual" | "semanal" }) {
  const prestamos = await getCollection<Prestamo>("Prestamo");
  const update: Record<string, unknown> = {};
  if (data.monto !== undefined) update.monto = data.monto;
  if (data.descripcion !== undefined) update.descripcion = data.descripcion;
  if (data.capital !== undefined) update.capital = data.capital;
  if (data.interes !== undefined) update.interes = data.interes;
  if (data.cuotas !== undefined) update.cuotas = data.cuotas;
  if (data.periodicidad !== undefined) update.periodicidad = data.periodicidad;
  await prestamos.updateOne({ _id: new ObjectId(prestamoId) }, { $set: update });
}

export async function toggleFormaPago(id: string) {
  const formas = await getCollection<FormaPago>("FormaPago");
  const forma = await formas.findOne({ _id: new ObjectId(id) });
  if (forma) {
    await formas.updateOne({ _id: new ObjectId(id) }, { $set: { activo: !forma.activo } });
  }
}
