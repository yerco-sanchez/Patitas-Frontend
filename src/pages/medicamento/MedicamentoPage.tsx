// pages/medicamentos/MedicamentosPage.tsx

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

// Importaciones de moléculas
import { FiltrosGenericos } from "../../components/moleculas/general/BasicFilter";
import { MedicamentoList } from "../../components/moleculas/medicamentos/MedicamentoList";
import { MedicamentoForm } from "../../components/moleculas/medicamentos/MedicamentoForm";
import { DeleteConfirmation } from "../../components/moleculas/medicamentos/DeleteConfirmation";
import PageHeader from "../../components/moleculas/general/PageHeader";

// Importaciones de tipos y hooks
import type { Medicamento, MedicamentoFormData, MedicamentoFilters } from "../../types/medicamento";
import { useMedicamentos } from "../../hooks/useMedicamentos";

export const MedicamentosPage: React.FC = () => {
  // Hook personalizado para manejar medicamentos
  const {
    medicamentos,
    loading,
    error,
    selectedMedicamento,
    createMedicamento,
    updateMedicamento,
    deleteMedicamento,
    refreshMedicamentos,
    setSelectedMedicamento,
    getFilteredMedicamentos,
    getUniquePresentations,
    getUniqueLaboratories,
    totalMedicamentos,
    isEmpty
  } = useMedicamentos();

  // Estados para filtros
  const [filters, setFilters] = useState<MedicamentoFilters>({
    search: "",
    presentation: "all",
    laboratory: "all",
  });

  // Estados para modales
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [medicamentoToDelete, setMedicamentoToDelete] = useState<Medicamento | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  // Medicamentos filtrados
  const filteredMedicamentos = useMemo(() => {
    return getFilteredMedicamentos(filters);
  }, [getFilteredMedicamentos, filters]);

  // Obtener opciones dinámicas para filtros
const presentationOptions = useMemo(() => {
  try {
    return getUniquePresentations() || [];
  } catch (error) {
    console.error('Error getting presentations:', error);
    return [];
  }
}, [getUniquePresentations]);

const laboratoryOptions = useMemo(() => {
  try {
    return getUniqueLaboratories() || [];
  } catch (error) {
    console.error('Error getting laboratories:', error);
    return [];
  }
}, [getUniqueLaboratories]);
  // Handlers para filtros
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handlePresentationChange = (value: string) => {
    setFilters(prev => ({ ...prev, presentation: value }));
  };

  const handleLaboratoryChange = (value: string) => {
    setFilters(prev => ({ ...prev, laboratory: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      presentation: "all",
      laboratory: "all",
    });
  };

  // Handlers para CRUD
  const handleCreate = () => {
    setSelectedMedicamento(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (medicamento: Medicamento) => {
    setSelectedMedicamento(medicamento);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleDelete = (id: number) => {
    const medicamento = medicamentos.find(m => m.id === id);
    if (medicamento) {
      setMedicamentoToDelete(medicamento);
      setDeleteOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (medicamentoToDelete) {
      const success = await deleteMedicamento(medicamentoToDelete.id);
      if (success) {
        setMedicamentoToDelete(null);
        setDeleteOpen(false);
      }
    }
  };

  const handleSubmit = async (formData: MedicamentoFormData) => {
    let success = false;

    if (formMode === "create") {
      success = await createMedicamento(formData);
    } else if (formMode === "edit" && selectedMedicamento) {
      success = await updateMedicamento({
        id: selectedMedicamento.id,
        ...formData
      });
    }

    if (success) {
      setFormOpen(false);
      setSelectedMedicamento(null);
    }
  };

  const handleRefresh = () => {
    refreshMedicamentos();
  };

  // Configuración de filtros para el componente FiltrosGenericos
  const filterConfig = [
    {
      placeholder: "Todas las presentaciones",
      allLabel: "Todas las presentaciones",
      value: filters.presentation,
      options: presentationOptions,
      onChange: handlePresentationChange,
    },
    {
      placeholder: "Todos los laboratorios",
      allLabel: "Todos los laboratorios",
      value: filters.laboratory,
      options: laboratoryOptions,
      onChange: handleLaboratoryChange,
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="Gestión de Medicamentos"
        description="Administra el catálogo de medicamentos del sistema"
        actionButton={
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Agregar Medicamento
            </Button>
          </div>
        }
      />

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
          <p className="text-sm font-medium">Error: {error}</p>
        </div>
      )}

      <FiltrosGenericos
        searchValue={filters.search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Buscar por nombre, principio activo o laboratorio..."
        title="Filtros de Medicamentos"
        onClearFilters={handleClearFilters}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {loading ? (
              "Cargando medicamentos..."
            ) : (
              `Mostrando ${filteredMedicamentos.length} de ${totalMedicamentos} medicamentos`
            )}
          </p>
        </div>
      </div>

      {isEmpty && !loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No hay medicamentos registrados</p>
          <Button onClick={handleCreate} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Agregar primer medicamento
          </Button>
        </div>
      ) : (
        <MedicamentoList
          medicamentos={filteredMedicamentos}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      )}

      <MedicamentoForm
        open={formOpen}
        onOpenChange={setFormOpen}
        medicamento={selectedMedicamento}
        onSubmit={handleSubmit}
        mode={formMode}
        loading={loading}
        presentationOptions={presentationOptions}
        laboratoryOptions={laboratoryOptions}
      />

      <DeleteConfirmation
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
        title="Eliminar Medicamento"
        description="¿Está seguro de que desea eliminar este medicamento? Esta acción no se puede deshacer."
        itemName={medicamentoToDelete?.commercialName}
      />
    </div>
  );
};

// Por estas (con validación adicional):

export default MedicamentosPage;