import { getClients } from "@/app/actions";
import { NextResponse } from "next/server";
import { DatabaseError } from "@/lib/mongodb";

export async function GET() {
  try {
    const clients = await getClients();
    const serialized = clients.map((c) => ({
      ...c,
      _id: c._id!.toString(),
      lastPaymentDate: c.lastPaymentDate ? c.lastPaymentDate.toISOString() : null,
    }));
    return NextResponse.json(serialized);
  } catch (e) {
    if (e instanceof DatabaseError) {
      return NextResponse.json({ error: "Problema con la Base de Datos" }, { status: 503 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
