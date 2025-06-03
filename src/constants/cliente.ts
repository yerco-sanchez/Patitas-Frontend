import type {
  TipoCliente,
  EstadoCliente,
  Gender,
  GenderEs,
  AnimalClassification,
  AnimalClassificationEs,
} from "@/types/models";

// Mapeo de tipos de cliente - Backend a Frontend
export const CUSTOMER_TYPE_TRANSLATIONS: Record<string, TipoCliente> = {
  Domestic: "Doméstico",
  Farm: "Granja",
};

// Mapeo de tipos de cliente - Frontend a Backend
export const CUSTOMER_TYPE_REVERSE_TRANSLATIONS: Record<TipoCliente, string> = {
  Doméstico: "Domestic",
  Granja: "Farm",
};

// Mapeo de estados de cliente - Backend a Frontend
export const CUSTOMER_STATUS_TRANSLATIONS: Record<string, EstadoCliente> = {
  Active: "Activo",
  Inactive: "Inactivo",
  Overdue: "Moroso",
  InDebt: "En Deuda",
  VIP: "VIP",
};

// Mapeo de estados de cliente - Frontend a Backend
export const CUSTOMER_STATUS_REVERSE_TRANSLATIONS: Record<
  EstadoCliente,
  string
> = {
  Activo: "Active",
  Inactivo: "Inactive",
  Moroso: "Overdue",
  "En Deuda": "InDebt",
  VIP: "VIP",
};

// Opciones para filtros y formularios
export const TIPOS_CLIENTE: TipoCliente[] = ["Doméstico", "Granja"];
export const ESTADOS_CLIENTE: EstadoCliente[] = [
  "Activo",
  "Inactivo",
  "Moroso",
  "En Deuda",
  "VIP",
];

// Opciones para selects
export const TIPO_CLIENTE_OPTIONS = TIPOS_CLIENTE.map((tipo) => ({
  value: tipo,
  label: tipo,
}));

export const ESTADO_CLIENTE_OPTIONS = ESTADOS_CLIENTE.map((estado) => ({
  value: estado,
  label: estado,
}));

// Traducciones de género
export const GENDER_TRANSLATIONS: Record<Gender, GenderEs> = {
  Male: "Macho",
  Female: "Hembra",
  Unknown: "Desconocido",
};

export const GENDER_REVERSE_TRANSLATIONS: Record<GenderEs, Gender> = {
  Macho: "Male",
  Hembra: "Female",
  Desconocido: "Unknown",
};

// Traducciones de clasificación
export const CLASSIFICATION_TRANSLATIONS: Record<
  AnimalClassification,
  AnimalClassificationEs
> = {
  Domestic: "Doméstico",
  Farm: "Granja",
};

export const CLASSIFICATION_REVERSE_TRANSLATIONS: Record<
  AnimalClassificationEs,
  AnimalClassification
> = {
  Doméstico: "Domestic",
  Granja: "Farm",
};
