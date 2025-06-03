import type { Patient, Animal, ApiErrorResponse } from "@/types/models";
import {
  patientToAnimal,
  patientsToAnimales,
  animalToCreatePatientDto,
  animalToUpdatePatientDto,
} from "@/utils/clienteMappers";
import { useState } from "react";

const API_BASE_URL = "https://localhost:7195/api";

// Función helper para manejar respuestas de fetch
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`,
      status: response.status,
      type: "network" as const,
    }));

    throw new Error(JSON.stringify(errorData));
  }

  return response.json();
};

// Función helper para configurar headers
const getHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  // Agregar token de autorización si es necesario
  // "Authorization": `Bearer ${getAuthToken()}`,
});

export class PatientService {
  /**
   * Obtiene todos los pacientes
   */
  static async getAllPatients(): Promise<Animal[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: "GET",
        headers: getHeaders(),
      });

      const patients: Patient[] = await handleResponse(response);
      return patientsToAnimales(patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw error;
    }
  }

  /**
   * Obtiene un paciente por ID
   */
  static async getPatientById(id: number): Promise<Animal> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: "GET",
        headers: getHeaders(),
      });

      const patient: Patient = await handleResponse(response);
      return patientToAnimal(patient);
    } catch (error) {
      console.error(`Error fetching patient ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene pacientes por cliente ID
   */
  static async getPatientsByCustomerId(customerId: number): Promise<Animal[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/customers/${customerId}/patients`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      const patients: Patient[] = await handleResponse(response);
      return patientsToAnimales(patients);
    } catch (error) {
      console.error(
        `Error fetching patients for customer ${customerId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Crea un nuevo paciente
   */
  static async createPatient(
    animalData: Omit<
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
  ): Promise<Animal> {
    try {
      const createDto = animalToCreatePatientDto(animalData);

      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(createDto),
      });

      const patient: Patient = await handleResponse(response);
      return patientToAnimal(patient);
    } catch (error) {
      console.error("Error creating patient:", error);
      throw error;
    }
  }

  /**
   * Actualiza un paciente existente
   */
  static async updatePatient(animalData: Animal): Promise<Animal> {
    try {
      const updateDto = animalToUpdatePatientDto(animalData);

      const response = await fetch(
        `${API_BASE_URL}/patients/${animalData.id}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(updateDto),
        }
      );

      const patient: Patient = await handleResponse(response);
      return patientToAnimal(patient);
    } catch (error) {
      console.error(`Error updating patient ${animalData.id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina un paciente (soft delete)
   */
  static async deletePatient(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting patient ${id}:`, error);
      throw error;
    }
  }

  /**
   * Busca pacientes por criterios
   */
  static async searchPatients(searchTerm: string): Promise<Animal[]> {
    try {
      const params = new URLSearchParams({
        search: searchTerm,
      });

      const response = await fetch(
        `${API_BASE_URL}/patients/search?${params}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      const patients: Patient[] = await handleResponse(response);
      return patientsToAnimales(patients);
    } catch (error) {
      console.error("Error searching patients:", error);
      throw error;
    }
  }

  /**
   * Sube una foto de paciente
   */
  static async uploadPatientPhoto(
    patientId: number,
    file: File
  ): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await fetch(
        `${API_BASE_URL}/patients/${patientId}/photo`,
        {
          method: "POST",
          // No establecer Content-Type para FormData, el browser lo hace automáticamente
          body: formData,
        }
      );

      const result: { photoUrl: string } = await handleResponse(response);
      return result.photoUrl;
    } catch (error) {
      console.error(`Error uploading photo for patient ${patientId}:`, error);
      throw error;
    }
  }
}

// Hook personalizado para React (opcional)
export const usePatients = () => {
  const [patients, setPatients] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await PatientService.getAllPatients();
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientsByCustomer = async (customerId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await PatientService.getPatientsByCustomerId(customerId);
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return {
    patients,
    loading,
    error,
    fetchPatients,
    fetchPatientsByCustomer,
    setPatients,
  };
};
