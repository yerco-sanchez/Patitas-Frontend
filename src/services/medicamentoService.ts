// services/medicamentoService.ts

import type { 
  Medicamento, 
  CreateMedicamentoDto, 
  UpdateMedicamentoDto, 
  MedicamentoState, 
  ApiError 
} from '../types/medicamento';

class MedicamentoService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = 'https://localhost:7195/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Maneja las respuestas HTTP y errores
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.title || errorMessage;
      } catch {
        // Si no se puede parsear el JSON, usar el mensaje por defecto
      }

      const apiError: ApiError = {
        message: errorMessage,
        status: response.status
      };
      
      throw apiError;
    }

    // Verificar si la respuesta tiene contenido
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return {} as T;
  }

  /**
   * Obtiene todos los medicamentos
   * @param state - Estado de los medicamentos a obtener ('active', 'inactive', 'all')
   */
  async getAllMedicamentos(state: MedicamentoState = 'active'): Promise<Medicamento[]> {
    const url = `${this.baseUrl}/medicament${state !== 'active' ? `?state=${state}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse<Medicamento[]>(response);
  }

  /**
   * Obtiene un medicamento por ID
   * @param id - ID del medicamento
   */
  async getMedicamentoById(id: number): Promise<Medicamento> {
    const response = await fetch(`${this.baseUrl}/medicament/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse<Medicamento>(response);
  }

  /**
   * Crea un nuevo medicamento
   * @param medicamento - Datos del medicamento a crear
   */
  async createMedicamento(medicamento: CreateMedicamentoDto): Promise<Medicamento> {
    const response = await fetch(`${this.baseUrl}/medicament`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commercialName: medicamento.commercialName,
        activeIngredient: medicamento.activeIngredient,
        presentation: medicamento.presentation,
        laboratory: medicamento.laboratory,
      }),
    });

    return this.handleResponse<Medicamento>(response);
  }

  /**
   * Actualiza un medicamento existente
   * @param medicamento - Datos del medicamento a actualizar
   */
  async updateMedicamento(medicamento: UpdateMedicamentoDto): Promise<Medicamento> {
    const response = await fetch(`${this.baseUrl}/medicament/${medicamento.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medicamento),
    });

    return this.handleResponse<Medicamento>(response);
  }

  /**
   * Inactiva (elimina lógicamente) un medicamento
   * @param id - ID del medicamento a inactivar
   */
  async inactivateMedicamento(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/medicament/${id}/inactivate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await this.handleResponse<void>(response);
  }

  /**
   * Verifica si existe un medicamento con el nombre comercial dado
   * @param commercialName - Nombre comercial a verificar
   * @param excludeId - ID a excluir de la verificación (para edición)
   */
  async checkCommercialNameExists(commercialName: string, excludeId?: number): Promise<boolean> {
    try {
      const medicamentos = await this.getAllMedicamentos('all');
      return medicamentos.some(m => 
        m.commercialName.toLowerCase() === commercialName.toLowerCase() && 
        m.id !== excludeId
      );
    } catch (error) {
      console.warn('Error verificando nombre comercial:', error);
      return false;
    }
  }
}

// Instancia singleton del servicio
export const medicamentoService = new MedicamentoService();

// Export por defecto para compatibilidad
export default medicamentoService;