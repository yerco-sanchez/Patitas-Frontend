// services/cliente-service.ts
import { apiClient } from "./apiClient";
import type {
  Cliente,
  CustomerDto,
  ClienteFormData,
  Patient,
  Animal,
} from "@/types/models";
import {
  customerDtoToCliente,
  customerDtosToClientes,
  clienteToCreateCustomerDto,
  clienteToCustomerDto,
  patientsToAnimales,
} from "@/utils/clienteMappers";

export class ClienteService {
  private readonly basePath = "/api/customers";

  /**
   * Obtiene todos los clientes activos
   */
  async obtenerTodos(): Promise<Cliente[]> {
    const customerDtos = await apiClient.get<CustomerDto[]>(this.basePath);
    return customerDtosToClientes(customerDtos);
  }

  /**
   * Obtiene todos los clientes eliminados
   */
  async obtenerEliminados(): Promise<Cliente[]> {
    const customerDtos = await apiClient.get<CustomerDto[]>(
      `${this.basePath}/deleted`
    );
    return customerDtosToClientes(customerDtos);
  }

  /**
   * Obtiene un cliente por ID
   */
  async obtenerPorId(id: number): Promise<Cliente> {
    const customerDto = await apiClient.get<CustomerDto>(
      `${this.basePath}/${id}`
    );
    return customerDtoToCliente(customerDto);
  }

  /**
   * Obtiene los pacientes/animales de un cliente
   */
  async obtenerPacientesCliente(
    clienteId: number,
    busqueda?: string
  ): Promise<Animal[]> {
    const searchParam = busqueda
      ? `?search=${encodeURIComponent(busqueda)}`
      : "";
    const patients = await apiClient.get<Patient[]>(
      `${this.basePath}/${clienteId}/pacientes${searchParam}`
    );
    return patientsToAnimales(patients);
  }

  /**
   * Crea un nuevo cliente
   */
  async crear(clienteData: ClienteFormData): Promise<Cliente> {
    const createDto = clienteToCreateCustomerDto(clienteData);
    const customerDto = await apiClient.post<CustomerDto>(
      this.basePath,
      createDto
    );
    return customerDtoToCliente(customerDto);
  }

  /**
   * Actualiza un cliente existente
   */
  async actualizar(cliente: Cliente): Promise<void> {
    const customerDto = clienteToCustomerDto(cliente);
    await apiClient.put<void>(
      `${this.basePath}/${cliente.idCliente}`,
      customerDto
    );
  }

  /**
   * Elimina un cliente (soft delete)
   */
  async eliminar(id: number): Promise<void> {
    await apiClient.delete<void>(`${this.basePath}/${id}`);
  }

  /**
   * Restaura un cliente eliminado
   */
  async restaurar(id: number): Promise<void> {
    await apiClient.patch<void>(`${this.basePath}/${id}/restore`);
  }

  /**
   * Verifica si existe un cliente
   */
  async existe(id: number): Promise<boolean> {
    try {
      await this.obtenerPorId(id);
      return true;
    } catch {
      return false;
    }
  }
}

// Instancia singleton del servicio
export const clienteService = new ClienteService();
