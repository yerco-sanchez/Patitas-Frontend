import React from "react";
import { MedicamentoCard } from "./MedicamentoCard";
import { AlertCircle } from "lucide-react";
import type { Medicamento } from '../../../types/medicamento';

interface MedicamentoListProps {
  medicamentos: Medicamento[];
  onEdit?: (medicamento: Medicamento) => void;
  onDelete?: (id: number) => void;
  loading?: boolean;
}

export const MedicamentoList: React.FC<MedicamentoListProps> = ({
  medicamentos,
  onEdit,
  onDelete,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="h-48 bg-gray-200 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (medicamentos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          No se encontraron medicamentos
        </h3>
        <p className="text-muted-foreground">
          No hay medicamentos que coincidan con los filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {medicamentos.map((medicamento) => (
        <MedicamentoCard
          key={medicamento.id}
          medicamento={medicamento}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};