import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.DATABASE_URL || "mongodb://localhost:27017/lendtrack";

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("lendtrack");

  await db.collection("Pago").deleteMany({});
  await db.collection("Prestamo").deleteMany({});
  await db.collection("Cliente").deleteMany({});
  await db.collection("Usuario").deleteMany({});
  await db.collection("Counter").deleteMany({});

  const hash = await bcrypt.hash("admin123", 10);
  await db.collection("Usuario").insertOne({
    nombre: "Administrador",
    usuario: "admin",
    contrasena: hash,
    status: "activo",
    last_access: null,
  });

  console.log("Admin user created: admin / admin123");

  const jane = await db.collection("Cliente").insertOne({
    uuid: "c1",
    nombre: "Jane Doe",
    direccion: "123 Financial Way, Suite 400",
    contacto1: "+1 (555) 123-4567",
    contacto2: "+1 (555) 987-6543",
  });

  const robert = await db.collection("Cliente").insertOne({
    uuid: "c2",
    nombre: "Robert Smith",
    direccion: "456 Oak Avenue, Apt 2B",
    contacto1: "+1 (555) 234-5678",
    contacto2: "",
  });

  const alice = await db.collection("Cliente").insertOne({
    uuid: "c3",
    nombre: "Alice Williams",
    direccion: "789 Pine Road",
    contacto1: "+1 (555) 345-6789",
    contacto2: "+1 (555) 111-2222",
  });

  const loan1 = await db.collection("Prestamo").insertOne({
    consecutivo: 1,
    fecha: new Date("2024-01-15"),
    monto: 15000,
    descripcion: "Business expansion loan",
    clienteId: jane.insertedId.toString(),
  });

  const loan2 = await db.collection("Prestamo").insertOne({
    consecutivo: 2,
    fecha: new Date("2024-03-10"),
    monto: 5000,
    descripcion: "Personal loan",
    clienteId: robert.insertedId.toString(),
  });

  const loan3 = await db.collection("Prestamo").insertOne({
    consecutivo: 3,
    fecha: new Date("2024-06-01"),
    monto: 1000,
    descripcion: "Emergency fund",
    clienteId: alice.insertedId.toString(),
  });

  await db.collection("Pago").insertMany([
    { consecutivo: 1, fecha: new Date("2024-02-15"), valor: 1250, descripcion: "Monthly installment", clienteId: jane.insertedId.toString(), prestamoId: loan1.insertedId.toString() },
    { consecutivo: 2, fecha: new Date("2024-03-15"), valor: 1250, descripcion: "Monthly installment", clienteId: jane.insertedId.toString(), prestamoId: loan1.insertedId.toString() },
    { consecutivo: 3, fecha: new Date("2024-04-15"), valor: 1250, descripcion: "Monthly installment", clienteId: jane.insertedId.toString(), prestamoId: loan1.insertedId.toString() },
    { consecutivo: 4, fecha: new Date("2024-07-01"), valor: 320, descripcion: "First payment", clienteId: alice.insertedId.toString(), prestamoId: loan3.insertedId.toString() },
  ]);

  await db.collection("Counter").insertMany([
    { name: "prestamo", seq: 3 },
    { name: "pago", seq: 4 },
  ]);

  console.log("Seed completed successfully");
  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
