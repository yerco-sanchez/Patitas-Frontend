// hooks/useMedicamentos.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { medicamentoService } from '../services/medicamentoService';
import type { 
  Medicamento, 
  CreateMedicamentoDto, 
  UpdateMedicamentoDto, 
  MedicamentoFilters, 
  MedicamentoState, 
  ApiError 
} from '../types/medicamento';

interface UseMedicamentosState {
  medicamentos: Medicamento[];
  loading: boolean;
  error: string | null;
  selectedMedicamento: Medicamento | null;
}

interface UseMedicamentosActions {
  // Operaciones CRUD
  createMedicamento: (data: CreateMedicamentoDto) => Promise<boolean>;
  updateMedicamento: (data: UpdateMedicamentoDto) => Promise<boolean>;
  deleteMedicamento: (id: number) => Promise<boolean>;
  getMedicamentoById: (id: number) => Promise<Medicamento | null>;
  
  // Gestión de datos
  refreshMedicamentos: () => Promise<void>;
  setSelectedMedicamento: (medicamento: Medicamento | null) => void;
  
  // Filtros
  getFilteredMedicamentos: (filters: MedicamentoFilters) => Medicamento[];
  
  // Utilidades
  checkCommercialNameExists: (name: string, excludeId?: number) => Promise<boolean>;
  getUniquePresentations: () => string[];
  getUniqueLaboratories: () => string[];
}

interface UseMedicamentosOptions {
  initialState?: MedicamentoState;
  autoLoad?: boolean;
}

export const useMedicamentos = (options: UseMedicamentosOptions = {}) => {
  const { initialState = 'active', autoLoad = true } = options;

  // Estado principal
  const [hookState, setHookState] = useState<UseMedicamentosState>({
    medicamentos: [],
    loading: false,
    error: null,
    selectedMedicamento: null,
  });

  const [currentState, setCurrentState] = useState<MedicamentoState>(initialState);

  /**
   * Maneja errores de la API
   */
  const handleError = useCallback((error: unknown, defaultMessage: string) => {
    let errorMessage = defaultMessage;
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = (error as ApiError).message;
    }
    setHookState(prev => ({ ...prev, error: errorMessage, loading: false }));
    toast.error(errorMessage);
    console.error('Error en medicamentos:', error);
  }, []);

  /**
   * Carga todos los medicamentos
   */
  const loadMedicamentos = useCallback(async (state: MedicamentoState = currentState) => {
    setHookState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const medicamentos = await medicamentoService.getAllMedicamentos(state);
      setHookState(prev => ({ 
        ...prev, 
        medicamentos, 
        loading: false 
      }));
    } catch (error) {
      handleError(error, 'Error al cargar los medicamentos');
    }
  }, [currentState, handleError]);

  /**
   * Refresca la lista de medicamentos
   */
  const refreshMedicamentos = useCallback(async () => {
    await loadMedicamentos();
  }, [loadMedicamentos]);

  /**
   * Crea un nuevo medicamento
   */
  const createMedicamento = useCallback(async (data: CreateMedicamentoDto): Promise<boolean> => {
    setHookState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const nuevoMedicamento = await medicamentoService.createMedicamento(data);
      
      setHookState(prev => ({
        ...prev,
        medicamentos: [...prev.medicamentos, nuevoMedicamento],
        loading: false
      }));
      
      toast.success(`Medicamento "${data.commercialName}" agregado correctamente`);
      return true;
    } catch (error) {
      handleError(error, 'Error al crear el medicamento');
      return false;
    }
  }, [handleError]);

  /**
   * Actualiza un medicamento existente
   */
  const updateMedicamento = useCallback(async (data: UpdateMedicamentoDto): Promise<boolean> => {
    setHookState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const medicamentoActualizado = await medicamentoService.updateMedicamento(data);
      
      setHookState(prev => ({
        ...prev,
        medicamentos: prev.medicamentos.map(m => 
          m.id === data.id ? medicamentoActualizado : m
        ),
        loading: false
      }));
      
      toast.success(`Medicamento "${data.commercialName}" actualizado correctamente`);
      return true;
    } catch (error) {
      handleError(error, 'Error al actualizar el medicamento');
      return false;
    }
  }, [handleError]);

  /**
   * Elimina (inactiva) un medicamento
   */
  const deleteMedicamento = useCallback(async (id: number): Promise<boolean> => {
    setHookState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // CORREGIDO: Usar hookState en lugar de state
      const medicamento = hookState.medicamentos.find(m => m.id === id);
      await medicamentoService.inactivateMedicamento(id);
      
      setHookState(prev => ({
        ...prev,
        medicamentos: prev.medicamentos.filter(m => m.id !== id),
        loading: false
      }));
      
      if (medicamento) {
        toast.success(`Medicamento "${medicamento.commercialName}" eliminado correctamente`);
      }
      return true;
    } catch (error) {
      handleError(error, 'Error al eliminar el medicamento');
      return false;
    }
  }, [hookState.medicamentos, handleError]);

  /**
   * Obtiene un medicamento por ID
   */
  const getMedicamentoById = useCallback(async (id: number): Promise<Medicamento | null> => {
    try {
      return await medicamentoService.getMedicamentoById(id);
    } catch (error) {
      handleError(error, 'Error al obtener el medicamento');
      return null;
    }
  }, [handleError]);

  /**
   * Establece el medicamento seleccionado
   */
  const setSelectedMedicamento = useCallback((medicamento: Medicamento | null) => {
    setHookState(prev => ({ ...prev, selectedMedicamento: medicamento }));
  }, []);

  /**
   * Filtra medicamentos según los criterios proporcionados
   */
  const getFilteredMedicamentos = useCallback((filters: MedicamentoFilters): Medicamento[] => {
    // CORREGIDO: Usar hookState.medicamentos en lugar de state.medicamentos
    if (!Array.isArray(hookState.medicamentos)) {
      console.warn('hookState.medicamentos no es un array:', hookState.medicamentos);
      return [];
    }

    return hookState.medicamentos.filter((medicamento) => {
      const matchesSearch = 
        medicamento.commercialName.toLowerCase().includes(filters.search.toLowerCase()) ||
        medicamento.activeIngredient.toLowerCase().includes(filters.search.toLowerCase()) ||
        medicamento.laboratory.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesPresentation = 
        filters.presentation === "all" || medicamento.presentation === filters.presentation;
      
      const matchesLaboratory = 
        filters.laboratory === "all" || medicamento.laboratory === filters.laboratory;
      
      return matchesSearch && matchesPresentation && matchesLaboratory;
    });
  }, [hookState.medicamentos]);

  /**
   * Obtiene las presentaciones únicas de los medicamentos cargados
   */
  const getUniquePresentations = useCallback((): string[] => {
    if (!Array.isArray(hookState.medicamentos)) {
      return [];
    }
    const presentations = hookState.medicamentos.map(m => m.presentation);
    return [...new Set(presentations)].sort();
  }, [hookState.medicamentos]);

  /**
   * Obtiene los laboratorios únicos de los medicamentos cargados
   */
  const getUniqueLaboratories = useCallback((): string[] => {
    if (!Array.isArray(hookState.medicamentos)) {
      return [];
    }
    const laboratories = hookState.medicamentos.map(m => m.laboratory);
    return [...new Set(laboratories)].sort();
  }, [hookState.medicamentos]);

  const checkCommercialNameExists = useCallback(async (name: string, excludeId?: number): Promise<boolean> => {
    try {
      return await medicamentoService.checkCommercialNameExists(name, excludeId);
    } catch (error) {
      console.warn('Error verificando nombre comercial:', error);
      return false;
    }
  }, []);

  /**
   * Cambia el estado de los medicamentos a mostrar
   */
  const changeState = useCallback(async (newState: MedicamentoState) => {
    setCurrentState(newState);
    await loadMedicamentos(newState);
  }, [loadMedicamentos]);

  // Efecto para cargar medicamentos al montar el componente
  useEffect(() => {
    if (autoLoad) {
      loadMedicamentos();
    }
  }, [autoLoad, loadMedicamentos]);

  // Valores memoizados para optimizar re-renders
  const actions: UseMedicamentosActions = useMemo(() => ({
    createMedicamento,
    updateMedicamento,
    deleteMedicamento,
    getMedicamentoById,
    refreshMedicamentos,
    setSelectedMedicamento,
    getFilteredMedicamentos,
    checkCommercialNameExists,
    getUniquePresentations,
    getUniqueLaboratories,
  }), [
    createMedicamento,
    updateMedicamento,
    deleteMedicamento,
    getMedicamentoById,
    refreshMedicamentos,
    setSelectedMedicamento,
    getFilteredMedicamentos,
    checkCommercialNameExists,
    getUniquePresentations,
    getUniqueLaboratories,
  ]);

  return {
    // Estado - CORREGIDO: destructurar hookState
    ...hookState,
    currentState,
    
    // Acciones
    ...actions,
    
    // Utilidades adicionales
    changeState,
    
    // Métricas computadas
    totalMedicamentos: hookState.medicamentos.length,
    hasError: !!hookState.error,
    isEmpty: hookState.medicamentos.length === 0,
  };
};