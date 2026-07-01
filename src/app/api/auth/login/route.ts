import { NextResponse } from "next/server";
import { getCollection, DatabaseError } from "@/lib/mongodb";
import { Usuario } from "@/lib/types";
import { signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { usuario, contrasena } = await req.json();

    if (!usuario || !contrasena) {
      return NextResponse.json({ error: "Usuario y contrasena requeridos" }, { status: 400 });
    }

    const usuarios = await getCollection<Usuario>("Usuario");
    const user = await usuarios.findOne({ usuario });

    if (!user) {
      return NextResponse.json({ error: "Credenciales invalidas" }, { status: 401 });
    }

    const valid = await bcrypt.compare(contrasena, user.contrasena);
    if (!valid) {
      return NextResponse.json({ error: "Credenciales invalidas" }, { status: 401 });
    }

    if (user.status !== "activo") {
      return NextResponse.json({ error: "Usuario inactivo" }, { status: 403 });
    }

    await usuarios.updateOne({ _id: user._id }, { $set: { last_access: new Date() } });

    const token = signToken({
      userId: user._id!.toString(),
      usuario: user.usuario,
      nombre: user.nombre,
    });

    return NextResponse.json({ token, nombre: user.nombre, usuario: user.usuario });
  } catch (e) {
    if (e instanceof DatabaseError) {
      return NextResponse.json({ error: "Problema con la Base de Datos" }, { status: 503 });
    }
    console.error("Login error:", e);
    return NextResponse.json({ error: "Error interno", detail: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
