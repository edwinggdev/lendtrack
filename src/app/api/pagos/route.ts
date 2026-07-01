import { getPagos } from "@/app/actions";
import { NextResponse } from "next/server";
import { DatabaseError } from "@/lib/mongodb";

export async function GET() {
  try {
    const pagos = await getPagos();
    const serialized = pagos.map((p) => ({
      _id: p._id.toString(),
      consecutivo: p.consecutivo,
      fecha: p.fecha.toISOString(),
      valor: p.valor,
      descripcion: p.descripcion,
      clienteId: p.clienteId,
      prestamoId: p.prestamoId,
      clienteNombre: p.clienteNombre,
      prestamoMonto: p.prestamoMonto,
      registradoPor: p.registradoPor,
    }));
    return NextResponse.json(serialized);
  } catch (e) {
    if (e instanceof DatabaseError) {
      return NextResponse.json({ error: "Problema con la Base de Datos" }, { status: 503 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
