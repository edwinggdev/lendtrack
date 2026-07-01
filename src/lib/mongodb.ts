import { MongoClient, Db, Document } from "mongodb";

const uri = process.env.DATABASE_URL || "mongodb://localhost:27017/lendtrack";
const options = {};

let client: MongoClient;
let db: Db;

export class DatabaseError extends Error {
  constructor() {
    super("Problema con la Base de Datos");
    this.name = "DatabaseError";
  }
}

export async function connectDB(): Promise<Db> {
  if (db) return db;
  client = new MongoClient(uri, options);
  try {
    await client.connect();
  } catch {
    throw new DatabaseError();
  }
  db = client.db("lendtrack");
  return db;
}

export async function getCollection<T extends Document>(name: string) {
  const database = await connectDB();
  return database.collection<T>(name);
}
