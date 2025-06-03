// utils/cliente-mappers.ts - Mappers actualizados

import type {
  Cliente,
  CustomerDto,
  CreateCustomerDto,
  ClienteFormData,
  Patient,
  Animal,
  CreatePatientDto,
  UpdatePatientDto,
} from "../types/models";
import {
  CUSTOMER_TYPE_TRANSLATIONS,
  CUSTOMER_TYPE_REVERSE_TRANSLATIONS,
  CUSTOMER_STATUS_TRANSLATIONS,
  CUSTOMER_STATUS_REVERSE_TRANSLATIONS,
} from "@/constants/cliente";
import {
  GENDER_TRANSLATIONS,
  GENDER_REVERSE_TRANSLATIONS,
  CLASSIFICATION_TRANSLATIONS,
  CLASSIFICATION_REVERSE_TRANSLATIONS,
} from "@/constants/cliente";

// Función helper para formatear fechas
const formatDateForFrontend = (isoString: string): string => {
  return new Date(isoString).toISOString().split("T")[0];
};

// Función helper para calcular edad basada en fecha de nacimiento
const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return Math.max(0, age);
};

/**
 * Convierte un CustomerDto del backend a Cliente del frontend
 */
export const customerDtoToCliente = (dto: CustomerDto): Cliente => {
  return {
    idCliente: dto.customerId,
    nombres: dto.firstNames,
    apPaterno: dto.paternalLastName,
    apMaterno: dto.maternalLastName || undefined,
    ci: dto.documentId,
    telefono: dto.phone,
    correo: dto.email,
    direccion: dto.address,
    tipoCliente: CUSTOMER_TYPE_TRANSLATIONS[dto.customerType] || "Doméstico",
    estadoCliente: CUSTOMER_STATUS_TRANSLATIONS[dto.customerStatus] || "Activo",
    observaciones: dto.notes,
    fechaRegistro: formatDateForFrontend(dto.createdAt),
  };
};

/**
 * Convierte un Cliente del frontend a CreateCustomerDto para el backend
 */
export const clienteToCreateCustomerDto = (
  cliente: ClienteFormData
): CreateCustomerDto => {
  return {
    firstNames: cliente.nombres,
    paternalLastName: cliente.apPaterno,
    maternalLastName: cliente.apMaterno?.trim() || undefined,
    documentId: cliente.ci,
    phone: cliente.telefono,
    email: cliente.correo,
    address: cliente.direccion,
    customerType: CUSTOMER_TYPE_REVERSE_TRANSLATIONS[cliente.tipoCliente],
    notes: cliente.observaciones,
    customerStatus: CUSTOMER_STATUS_REVERSE_TRANSLATIONS[cliente.estadoCliente],
  };
};

/**
 * Convierte un Cliente del frontend a CustomerDto para actualización
 */
export const clienteToCustomerDto = (cliente: Cliente): CustomerDto => {
  const buildFullName = (
    nombres: string,
    apPaterno: string,
    apMaterno?: string
  ): string => {
    const partes = [nombres, apPaterno];
    if (apMaterno?.trim()) {
      partes.push(apMaterno);
    }
    return partes.join(" ");
  };

  return {
    customerId: cliente.idCliente,
    firstNames: cliente.nombres,
    paternalLastName: cliente.apPaterno,
    maternalLastName: cliente.apMaterno?.trim() || undefined,
    documentId: cliente.ci,
    phone: cliente.telefono,
    email: cliente.correo,
    address: cliente.direccion,
    customerType: CUSTOMER_TYPE_REVERSE_TRANSLATIONS[cliente.tipoCliente],
    notes: cliente.observaciones,
    customerStatus: CUSTOMER_STATUS_REVERSE_TRANSLATIONS[cliente.estadoCliente],
    fullName: buildFullName(
      cliente.nombres,
      cliente.apPaterno,
      cliente.apMaterno
    ),
    createdAt: new Date().toISOString(),
    isDeleted: false,
    deletedAt: null,
    deletedBy: null,
    updatedAt: null,
    patients: null,
  };
};

/**
 * Convierte un array de CustomerDto a array de Cliente
 */
export const customerDtosToClientes = (dtos: CustomerDto[]): Cliente[] => {
  return dtos.map(customerDtoToCliente);
};

/**
 * Convierte un Patient del backend a Animal del frontend (versión completa)
 */
export const patientToAnimal = (patient: Patient): Animal => {
  // Calcular edad basada en fecha de nacimiento, o usar la edad del backend si está disponible
  const edadCalculada = patient.birthDate
    ? calculateAge(patient.birthDate)
    : patient.age;

  return {
    id: patient.patientId,
    nombre: patient.animalName,
    especie: patient.species,
    raza: patient.breed || "",
    genero: GENDER_TRANSLATIONS[patient.gender] || "Desconocido",
    fechaNacimiento: patient.birthDate
      ? formatDateForFrontend(patient.birthDate)
      : "",
    edad: edadCalculada,
    peso: patient.weight || 0,
    clasificacion:
      CLASSIFICATION_TRANSLATIONS[patient.classification] || "Doméstico",
    fotoUrl: patient.photoUrl,
    fechaRegistro: formatDateForFrontend(patient.registeredAt),
    registradoPor: patient.registeredBy || "Sistema",
    clienteId: patient.customerId,
    clienteInfo: patient.customer
      ? {
          idCliente: patient.customer.customerId,
          nombreCompleto: patient.customer.fullName,
          telefono: patient.customer.phone,
          email: patient.customer.email,
        }
      : undefined,
    eliminado: patient.isDeleted,
    fechaEliminacion: patient.deletedAt
      ? formatDateForFrontend(patient.deletedAt)
      : null,
    eliminadoPor: patient.deletedBy || null,
    fechaActualizacion: patient.updatedAt
      ? formatDateForFrontend(patient.updatedAt)
      : null,
  };
};

/**
 * Convierte un Animal del frontend a CreatePatientDto para el backend
 */
export const animalToCreatePatientDto = (
  animal: Omit<
    Animal,
    | "id"
    | "fechaRegistro"
    | "registradoPor"
    | "clienteInfo"
    | "eliminado"
    | "fechaEliminacion"
    | "eliminadoPor"
    | "fechaActualizacion"
  >
): CreatePatientDto => {
  return {
    animalName: animal.nombre,
    species: animal.especie,
    breed: animal.raza,
    gender: GENDER_REVERSE_TRANSLATIONS[animal.genero] || "Unknown",
    birthDate: animal.fechaNacimiento
      ? new Date(animal.fechaNacimiento).toISOString()
      : new Date().toISOString(),
    weight: animal.peso || 0,
    classification:
      CLASSIFICATION_REVERSE_TRANSLATIONS[animal.clasificacion] || "Domestic",
    photoUrl: animal.fotoUrl,
    customerId: animal.clienteId,
  };
};

/**
 * Convierte un Animal del frontend a UpdatePatientDto para el backend
 */
export const animalToUpdatePatientDto = (animal: Animal): UpdatePatientDto => {
  return {
    patientId: animal.id,
    animalName: animal.nombre,
    species: animal.especie,
    breed: animal.raza,
    gender: GENDER_REVERSE_TRANSLATIONS[animal.genero] || "Unknown",
    birthDate: animal.fechaNacimiento
      ? new Date(animal.fechaNacimiento).toISOString()
      : new Date().toISOString(),
    weight: animal.peso || 0,
    classification:
      CLASSIFICATION_REVERSE_TRANSLATIONS[animal.clasificacion] || "Domestic",
    photoUrl: animal.fotoUrl,
    customerId: animal.clienteId,
  };
};

/**
 * Convierte un array de Patient a array de Animal
 */
export const patientsToAnimales = (patients: Patient[]): Animal[] => {
  return patients.map(patientToAnimal);
};

/**
 * Función helper para obtener el nombre completo de un cliente
 */
export const getClienteNombreCompleto = (cliente: Cliente): string => {
  const partes = [cliente.nombres, cliente.apPaterno];
  if (cliente.apMaterno?.trim()) {
    partes.push(cliente.apMaterno);
  }
  return partes.join(" ");
};

/**
 * Función helper para filtrar pacientes activos (no eliminados)
 */
export const getActiveAnimals = (animals: Animal[]): Animal[] => {
  return animals.filter((animal) => !animal.eliminado);
};

/**
 * Función helper para obtener información resumida del paciente
 */
export const getAnimalSummary = (animal: Animal): string => {
  return `${animal.nombre} - ${animal.especie} (${animal.raza}) - ${animal.edad} años`;
};
