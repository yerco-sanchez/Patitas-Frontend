import React from "react";
import { Loader2 } from "lucide-react";
import type { Patient } from "@/types/pacientes";
import { PatientCard } from "./PacienteCard";

interface PatientsListProps {
  patients: Patient[];
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (patientId: number, patientName: string) => void;
  searchTerm?: string;
  filterSpecies?: string;
}

export const PatientsList: React.FC<PatientsListProps> = ({
  patients,
  onEditPatient,
  onDeletePatient,
  searchTerm,
  filterSpecies,
}) => {
  const getEmptyStateMessage = () => {
    if (searchTerm || filterSpecies) {
      return {
        title: "No se encontraron pacientes",
        description: "Prueba con otros términos de búsqueda o filtros",
      };
    }
    return {
      title: "No hay pacientes registrados",
      description: "Registra el primer paciente para este cliente",
    };
  };

  if (patients.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando clientes...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {patients.map((patient) => (
        <PatientCard
          key={patient.patientId}
          patient={patient}
          onEdit={onEditPatient}
          onDelete={onDeletePatient}
        />
      ))}
    </div>
  );
};
