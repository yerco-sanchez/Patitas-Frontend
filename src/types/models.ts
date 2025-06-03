// types/models.ts - Interfaces actualizadas

// Enums y tipos auxiliares
export type Gender = "Male" | "Female" | "Unknown";
export type AnimalClassification = "Domestic" | "Farm";
export type GenderEs = "Macho" | "Hembra" | "Desconocido";
export type AnimalClassificationEs = "Doméstico" | "Granja";

// Interfaz Customer anidada en Patient
export interface CustomerDto {
  customerId: number;
  firstNames: string;
  paternalLastName: string;
  maternalLastName?: string;
  documentId: string;
  phone: string;
  email: string;
  address: string;
  customerType: string;
  notes: string;
  customerStatus: string;
  fullName: string;
  createdAt: string;
  isDeleted: boolean;
  deletedAt?: string | null;
  deletedBy?: string | null;
  updatedAt?: string | null;
  patients?: Patient[] | null;
}

// Interfaz Patient actualizada con todos los campos
export interface Patient {
  patientId: number;
  animalName: string;
  species: string;
  breed: string;
  gender: Gender;
  birthDate: string; // ISO string date
  age: number;
  weight: number;
  classification: AnimalClassification;
  photoUrl?: string;
  registeredAt: string; // ISO string datetime
  registeredBy: string;
  customerId: number;
  customer?: CustomerDto; // Información del cliente anidada
  isDeleted: boolean;
  deletedAt?: string | null;
  deletedBy?: string | null;
  updatedAt?: string | null;
}

// Interfaz Animal para el frontend (expandida)
export interface Animal {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  genero: GenderEs;
  fechaNacimiento: string; // Formato: YYYY-MM-DD
  edad: number;
  peso: number;
  clasificacion: AnimalClassificationEs;
  fotoUrl?: string;
  fechaRegistro: string; // Formato: YYYY-MM-DD
  registradoPor: string;
  clienteId: number;
  clienteInfo?: {
    idCliente: number;
    nombreCompleto: string;
    telefono: string;
    email: string;
  };
  eliminado: boolean;
  fechaEliminacion?: string | null;
  eliminadoPor?: string | null;
  fechaActualizacion?: string | null;
}

// Interfaz para crear/actualizar pacientes
export interface CreatePatientDto {
  animalName: string;
  species: string;
  breed: string;
  gender: Gender;
  birthDate: string;
  weight: number;
  classification: AnimalClassification;
  photoUrl?: string;
  customerId: number;
}

export interface UpdatePatientDto extends CreatePatientDto {
  patientId: number;
}

// Mantener las interfaces existentes...
export interface Cliente {
  idCliente: number;
  nombres: string;
  apPaterno: string;
  apMaterno?: string;
  ci: string;
  telefono: string;
  correo: string;
  direccion: string;
  tipoCliente: TipoCliente;
  estadoCliente: EstadoCliente;
  observaciones: string;
  fechaRegistro: string;
}

export interface FormErrors {
  nombres?: string;
  apPaterno?: string;
  apMaterno?: string;
  ci?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  tipoCliente?: string;
  estadoCliente?: string;
  observaciones?: string;
}

export type ClienteFormData = Omit<Cliente, "idCliente" | "fechaRegistro">;

export type TipoCliente = "Doméstico" | "Granja";
export type EstadoCliente =
  | "Activo"
  | "Inactivo"
  | "Moroso"
  | "En Deuda"
  | "VIP";

export interface CreateCustomerDto {
  firstNames: string;
  paternalLastName: string;
  maternalLastName?: string;
  documentId: string;
  phone: string;
  email: string;
  address: string;
  customerType: string;
  notes: string;
  customerStatus: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ConflictError {
  email?: boolean;
  ci?: boolean;
  message: string;
}

export interface ApiErrorResponse {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
  type?: "validation" | "conflict" | "network" | "unknown";
}
