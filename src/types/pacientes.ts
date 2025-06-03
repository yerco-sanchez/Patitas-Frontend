// types/patient.types.ts
export interface Patient {
  patientId: number;
  animalName: string;
  species: string;
  breed: string;
  gender: "Male" | "Female";
  birthDate: string;
  age: number;
  weight: number;
  classification: "Domestic" | "Farm";
  photoUrl: string;
  registeredAt: string;
  registeredBy: string;
  customerId: number;
  isDeleted?: boolean;
  deletedAt?: string | null;
  deletedBy?: string | null;
  updatedAt?: string | null;
}

export interface Customer {
  customerId: number;
  firstNames: string;
  paternalLastName: string;
  maternalLastName: string;
  documentId: string;
  phone: string;
  email: string;
  address: string;
  customerType: "Domestic" | "Farm";
  notes: string;
  customerStatus: "Active" | "Inactive";
  fullName: string;
  createdAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
  updatedAt: string | null;
  patients: Patient[];
}

export interface PatientFormData {
  animalName: string;
  species: string;
  breed: string;
  gender: "Male" | "Female";
  birthDate: string;
  weight: number;
  classification: "Domestic" | "Farm";
  photoUrl?: string;
}

export const SPECIES_OPTIONS = [
  { value: "Perro", label: "Perro" },
  { value: "Gato", label: "Gato" },
  { value: "Ave", label: "Ave" },
  { value: "Conejo", label: "Conejo" },
  { value: "Hamster", label: "Hamster" },
  { value: "Bovino", label: "Bovino" },
  { value: "Ovino", label: "Ovino" },
  { value: "Porcino", label: "Porcino" },
  { value: "Equino", label: "Equino" },
  { value: "Otro", label: "Otro" },
] as const;

export const GENDER_OPTIONS = [
  { value: "Male", label: "Macho" },
  { value: "Female", label: "Hembra" },
] as const;

export const CLASSIFICATION_OPTIONS = [
  { value: "Domestic", label: "Doméstico" },
  { value: "Farm", label: "Granja" },
] as const;
