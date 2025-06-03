// hooks/use-cliente.ts
import { useState, useEffect, useCallback } from "react";
import { clienteService } from "@/services/ClienteService";
import { ApiError } from "@/services/apiClient";
import type { Cliente, ClienteFormData, Animal } from "@/types/models";

interface UseClientesState {
  clientes: Cliente[];
  loading: boolean;
  error: string | null;
}

interface UseClientesActions {
  obtenerClientes: () => Promise<void>;
  crearCliente: (clienteData: ClienteFormData) => Promise<Cliente | null>;
  actualizarCliente: (cliente: Cliente) => Promise<boolean>;
  eliminarCliente: (id: number) => Promise<boolean>;
  restaurarCliente: (id: number) => Promise<boolean>;
  limpiarError: () => void;
}

export const useClientes = (): UseClientesState & UseClientesActions => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  const manejarError = useCallback((error: unknown) => {
    if (error instanceof ApiError) {
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flat();
        setError(errorMessages.join(", "));
      } else {
        setError(error.message);
      }
    } else if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Ha ocurrido un error inesperado");
    }
  }, []);

  const obtenerClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const clientesData = await clienteService.obtenerTodos();
      setClientes(clientesData);
    } catch (error) {
      manejarError(error);
    } finally {
      setLoading(false);
    }
  }, [manejarError]);

  const crearCliente = useCallback(
    async (clienteData: ClienteFormData): Promise<Cliente | null> => {
      setLoading(true);
      setError(null);
      try {
        const nuevoCliente = await clienteService.crear(clienteData);
        setClientes((prev) => [...prev, nuevoCliente]);
        return nuevoCliente;
      } catch (error) {
        console.log(error);
        manejarError(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [manejarError]
  );

  const actualizarCliente = useCallback(
    async (cliente: Cliente): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await clienteService.actualizar(cliente);
        setClientes((prev) =>
          prev.map((c) => (c.idCliente === cliente.idCliente ? cliente : c))
        );
        return true;
      } catch (error) {
        manejarError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [manejarError]
  );

  const eliminarCliente = useCallback(
    async (id: number): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await clienteService.eliminar(id);
        setClientes((prev) => prev.filter((c) => c.idCliente !== id));
        return true;
      } catch (error) {
        manejarError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [manejarError]
  );

  const restaurarCliente = useCallback(
    async (id: number): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await clienteService.restaurar(id);
        // Recargar la lista después de restaurar
        await obtenerClientes();
        return true;
      } catch (error) {
        manejarError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [manejarError, obtenerClientes]
  );

  // Cargar clientes al montar el componente
  useEffect(() => {
    obtenerClientes();
  }, [obtenerClientes]);

  return {
    clientes,
    loading,
    error,
    obtenerClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    restaurarCliente,
    limpiarError,
  };
};

// Hook para manejar los pacientes de un cliente específico
interface UseClientePacientesState {
  pacientes: Animal[];
  loading: boolean;
  error: string | null;
}

interface UseClientePacientesActions {
  obtenerPacientes: (clienteId: number, busqueda?: string) => Promise<void>;
  recargarPacientes: () => Promise<void>;
  limpiarError: () => void;
}

export const useClientePacientes = (): UseClientePacientesState &
  UseClientePacientesActions => {
  const [pacientes, setPacientes] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ultimoClienteId, setUltimoClienteId] = useState<number | null>(null);
  const [ultimaBusqueda, setUltimaBusqueda] = useState<string | undefined>();

  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  const manejarError = useCallback((error: unknown) => {
    if (error instanceof ApiError) {
      setError(error.message);
    } else if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Ha ocurrido un error inesperado");
    }
  }, []);

  const obtenerPacientes = useCallback(
    async (clienteId: number, busqueda?: string) => {
      setLoading(true);
      setError(null);
      setUltimoClienteId(clienteId);
      setUltimaBusqueda(busqueda);

      try {
        const pacientesData = await clienteService.obtenerPacientesCliente(
          clienteId,
          busqueda
        );
        setPacientes(pacientesData);
        console.log(pacientesData);
      } catch (error) {
        manejarError(error);
      } finally {
        setLoading(false);
      }
    },
    [manejarError]
  );

  const recargarPacientes = useCallback(async () => {
    if (ultimoClienteId) {
      await obtenerPacientes(ultimoClienteId, ultimaBusqueda);
    }
  }, [obtenerPacientes, ultimoClienteId, ultimaBusqueda]);

  return {
    pacientes,
    loading,
    error,
    obtenerPacientes,
    recargarPacientes,
    limpiarError,
  };
};
