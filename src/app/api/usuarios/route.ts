import { NextResponse } from "next/server";
import { getCollection, DatabaseError } from "@/lib/mongodb";
import { Usuario } from "@/lib/types";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const usuarios = await getCollection<Usuario>("Usuario");
    const all = await usuarios.find({}).sort({ nombre: 1 }).toArray();
    const list = all.map((u) => ({
      _id: u._id!.toString(),
      nombre: u.nombre,
      usuario: u.usuario,
      status: u.status,
      last_access: u.last_access ? u.last_access.toISOString() : null,
    }));
    return NextResponse.json(list);
  } catch (e) {
    if (e instanceof DatabaseError) return NextResponse.json({ error: "Problema con la Base de Datos" }, { status: 503 });
    console.error(e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { nombre, usuario, contrasena } = await req.json();
    if (!nombre || !usuario || !contrasena) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
    }
    const hash = await bcrypt.hash(contrasena, 10);
    const usuarios = await getCollection<Usuario>("Usuario");
    const existing = await usuarios.findOne({ usuario });
    if (existing) {
      return NextResponse.json({ error: "El usuario ya existe" }, { status: 409 });
    }
    await usuarios.insertOne({
      nombre,
      usuario,
      contrasena: hash,
      status: "activo",
      last_access: null,
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof DatabaseError) return NextResponse.json({ error: "Problema con la Base de Datos" }, { status: 503 });
    console.error(e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, nombre, usuario, contrasena, status } = await req.json();
    const usuarios = await getCollection<Usuario>("Usuario");
    const user = await usuarios.findOne({ _id: new ObjectId(id) });
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    if (usuario !== undefined && usuario !== user.usuario) {
      const existing = await usuarios.findOne({ usuario });
      if (existing) return NextResponse.json({ error: "El nombre de usuario ya existe" }, { status: 409 });
    }
    const update: Record<string, unknown> = {};
    if (nombre !== undefined) update.nombre = nombre;
    if (usuario !== undefined) update.usuario = usuario;
    if (contrasena !== undefined) update.contrasena = await bcrypt.hash(contrasena, 10);
    if (status !== undefined) update.status = status;

    if (Object.keys(update).length > 0) {
      await usuarios.updateOne({ _id: new ObjectId(id) }, { $set: update });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof DatabaseError) return NextResponse.json({ error: "Problema con la Base de Datos" }, { status: 503 });
    console.error(e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
