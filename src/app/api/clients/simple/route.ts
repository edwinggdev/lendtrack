import { getCollection, DatabaseError } from "@/lib/mongodb";
import { Cliente } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clientes = await getCollection<Cliente>("Cliente");
    const all = await clientes.find({}).project({ nombre: 1 }).toArray();
    const list = all.map((c) => ({
      _id: c._id!.toString(),
      nombre: c.nombre,
    }));
    return NextResponse.json(list);
  } catch (e) {
    if (e instanceof DatabaseError) {
      return NextResponse.json({ error: "Problema con la Base de Datos" }, { status: 503 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
