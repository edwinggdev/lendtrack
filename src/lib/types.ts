import { ObjectId } from "mongodb";

export interface Usuario {
  _id?: ObjectId;
  nombre: string;
  usuario: string;
  contrasena: string;
  status: "activo" | "inactivo";
  last_access: Date | null;
}

export interface Cliente {
  _id?: ObjectId;
  uuid: string;
  nombre: string;
  direccion: string;
  contacto1: string;
  contacto2: string;
}

export interface Prestamo {
  _id?: ObjectId;
  consecutivo: number;
  fecha: Date;
  monto: number;
  capital: number;
  interes: number;
  cuotas: number;
  periodicidad: "mensual" | "semanal";
  descripcion: string;
  clienteId: string;
}

export interface Pago {
  _id?: ObjectId;
  consecutivo: number;
  fecha: Date;
  valor: number;
  descripcion: string;
  clienteId: string;
  prestamoId: string;
  registradoPor?: string;
  formaPagoId?: string;
}

export interface Counter {
  _id?: ObjectId;
  name: string;
  seq: number;
}

export interface FormaPago {
  _id?: ObjectId;
  nombre: string;
  activo: boolean;
}

export interface PrestamoWithStats extends Prestamo {
  clienteNombre: string;
  totalPaid: number;
  balance: number;
  isFullyPaid: boolean;
}

export interface ClienteWithStats extends Cliente {
  totalLoan: number;
  totalPaid: number;
  balance: number;
  lastPaymentDate: Date | null;
  isDelinquent: boolean;
  initials: string;
}
