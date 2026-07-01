export interface ClienteData {
  uuid: string;
  nombre: string;
  direccion: string;
  contacto1: string;
  contacto2: string;
}

export interface PrestamoData {
  fecha: Date;
  monto: number;
  descripcion: string;
  clienteId: string;
}

export interface PagoData {
  fecha: Date;
  valor: number;
  descripcion: string;
  clienteId: string;
  prestamoId: string;
}

const STORAGE_KEY = "lendtrack_db";

function getLocalDB(): { clientes: ClienteData[] } {
  if (typeof window === "undefined") return { clientes: [] };
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : { clientes: [] };
}

function saveLocalDB(db: { clientes: ClienteData[] }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function getClientesLocal(): ClienteData[] {
  return getLocalDB().clientes;
}

export function saveClienteLocal(cliente: ClienteData) {
  const db = getLocalDB();
  db.clientes.push(cliente);
  saveLocalDB(db);
}
