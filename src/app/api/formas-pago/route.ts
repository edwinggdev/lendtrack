import { NextResponse } from "next/server";
import { getCollection, DatabaseError } from "@/lib/mongodb";
import { FormaPago } from "@/lib/types";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const formas = await getCollection<FormaPago>("FormaPago");
    const all = await formas.find({}).sort({ nombre: 1 }).toArray();
    const list = all.map((f) => ({
      _id: f._id!.toString(),
      nombre: f.nombre,
      activo: f.activo,
    }));
    return NextResponse.json(list);
  } catch (e) {
    if (e instanceof DatabaseError) {
      return NextResponse.json({ error: "Problema con la Base de Datos" }, { status: 503 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { nombre } = await req.json();
    const formas = await getCollection<FormaPago>("FormaPago");
    await formas.insertOne({ nombre, activo: true });
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof DatabaseError) {
      return NextResponse.json({ error: "Problema con la Base de Datos" }, { status: 503 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();
    const formas = await getCollection<FormaPago>("FormaPago");
    const forma = await formas.findOne({ _id: new ObjectId(id) });
    if (forma) {
      await formas.updateOne({ _id: new ObjectId(id) }, { $set: { activo: !forma.activo } });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof DatabaseError) {
      return NextResponse.json({ error: "Problema con la Base de Datos" }, { status: 503 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
