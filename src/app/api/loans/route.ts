import { getPrestamos } from "@/app/actions";
import { NextResponse } from "next/server";
import { DatabaseError } from "@/lib/mongodb";

export async function GET() {
  try {
    const prestamos = await getPrestamos();
    const serialized = prestamos.map((p) => ({
      ...p,
      _id: p._id!.toString(),
      fecha: p.fecha.toISOString(),
    }));
    return NextResponse.json(serialized);
  } catch (e) {
    if (e instanceof DatabaseError) {
      return NextResponse.json({ error: "Problema con la Base de Datos" }, { status: 503 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
