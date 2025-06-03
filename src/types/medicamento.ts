// types/medicamento.ts

// Interfaz base del medicamento según el modelo del backend
export interface Medicamento {
  id: number;
  commercialName: string;
  activeIngredient: string;
  presentation: string;
  laboratory: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
  deletedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// DTO para crear un medicamento (sin ID)
export interface CreateMedicamentoDto {
  commercialName: string;
  activeIngredient: string;
  presentation: string;
  laboratory: string;
}

// DTO para actualizar un medicamento
export interface UpdateMedicamentoDto {
  id: number;
  commercialName: string;
  activeIngredient: string;
  presentation: string;
  laboratory: string;
}

// Tipos para filtros
export interface MedicamentoFilters {
  search: string;
  presentation: string;
  laboratory: string;
}

// Estados posibles para la consulta
export type MedicamentoState = 'active' | 'inactive' | 'all';

// Tipo para el formulario (compatible con tu componente actual)
export interface MedicamentoFormData {
  commercialName: string;
  activeIngredient: string;
  presentation: string;
  laboratory: string;
}

// Respuesta de la API
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// Error de la API
export interface ApiError {
  message: string;
  status: number;
  details?: any;
}