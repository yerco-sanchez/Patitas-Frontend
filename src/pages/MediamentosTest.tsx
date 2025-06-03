import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { Plus, Search, Edit, Eye, EyeOff, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

// Interfaces y tipos
interface Medication {
  id_medicamento: number;
  nombre_comercial: string;
  principio_activo: string;
  presentacion: string;
  laboratorio: string;
  activo: boolean;
  usado_en_prescripciones: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
}

interface MedicationFormData {
  nombre_comercial: string;
  principio_activo: string;
  presentacion: string;
  laboratorio: string;
}

// Datos de ejemplo
const initialMedications: Medication[] = [
  {
    id_medicamento: 1,
    nombre_comercial: "Paracetamol 500mg",
    principio_activo: "Paracetamol",
    presentacion: "Tabletas",
    laboratorio: "Genfar",
    activo: true,
    usado_en_prescripciones: true,
    fecha_creacion: "2024-01-15",
    fecha_modificacion: "2024-01-15",
  },
  {
    id_medicamento: 2,
    nombre_comercial: "Ibuprofeno 400mg",
    principio_activo: "Ibuprofeno",
    presentacion: "Cápsulas",
    laboratorio: "Bayer",
    activo: true,
    usado_en_prescripciones: false,
    fecha_creacion: "2024-02-10",
    fecha_modificacion: "2024-02-10",
  },
  {
    id_medicamento: 3,
    nombre_comercial: "Amoxicilina 500mg",
    principio_activo: "Amoxicilina",
    presentacion: "Cápsulas",
    laboratorio: "Sandoz",
    activo: false,
    usado_en_prescripciones: true,
    fecha_creacion: "2024-01-20",
    fecha_modificacion: "2024-03-05",
  },
  {
    id_medicamento: 4,
    nombre_comercial: "Omeprazol 20mg",
    principio_activo: "Omeprazol",
    presentacion: "Cápsulas",
    laboratorio: "Tecnoquímicas",
    activo: true,
    usado_en_prescripciones: false,
    fecha_creacion: "2024-03-01",
    fecha_modificacion: "2024-03-01",
  },
  {
    id_medicamento: 5,
    nombre_comercial: "Aspirina 100mg",
    principio_activo: "Ácido acetilsalicílico",
    presentacion: "Tabletas",
    laboratorio: "Bayer",
    activo: false,
    usado_en_prescripciones: false,
    fecha_creacion: "2024-02-15",
    fecha_modificacion: "2024-04-10",
  },
];

const laboratoryOptions = [
  "Genfar",
  "Bayer",
  "Sandoz",
  "Tecnoquímicas",
  "Pfizer",
  "Novartis",
  "Abbott",
  "Roche",
];

const presentationOptions = [
  "Tabletas",
  "Cápsulas",
  "Jarabe",
  "Suspensión",
  "Gotas",
  "Inyectable",
  "Crema",
  "Ungüento",
];

export default function MedicationManagement() {
  const [medications, setMedications] =
    useState<Medication[]>(initialMedications);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(
    null
  );
  const [formData, setFormData] = useState<MedicationFormData>({
    nombre_comercial: "",
    principio_activo: "",
    presentacion: "",
    laboratorio: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<MedicationFormData>>({});

  // Filtrado de medicamentos
  const filteredMedications = useMemo(() => {
    return medications.filter((med) => {
      const matchesSearch =
        med.nombre_comercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.principio_activo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.laboratorio.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && med.activo) ||
        (statusFilter === "inactive" && !med.activo);

      return matchesSearch && matchesStatus;
    });
  }, [medications, searchTerm, statusFilter]);

  // Validación del formulario
  const validateForm = (data: MedicationFormData): boolean => {
    const errors: Partial<MedicationFormData> = {};

    if (!data.nombre_comercial.trim()) {
      errors.nombre_comercial = "El nombre comercial es obligatorio";
    }
    if (!data.principio_activo.trim()) {
      errors.principio_activo = "El principio activo es obligatorio";
    }
    if (!data.presentacion.trim()) {
      errors.presentacion = "La presentación es obligatoria";
    }
    if (!data.laboratorio.trim()) {
      errors.laboratorio = "El laboratorio es obligatorio";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Limpiar formulario
  const resetForm = () => {
    setFormData({
      nombre_comercial: "",
      principio_activo: "",
      presentacion: "",
      laboratorio: "",
    });
    setFormErrors({});
  };

  // Agregar medicamento
  const handleAddMedication = () => {
    if (!validateForm(formData)) {
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    const newMedication: Medication = {
      id_medicamento: Math.max(...medications.map((m) => m.id_medicamento)) + 1,
      ...formData,
      activo: true,
      usado_en_prescripciones: false,
      fecha_creacion: new Date().toISOString().split("T")[0],
      fecha_modificacion: new Date().toISOString().split("T")[0],
    };

    setMedications([...medications, newMedication]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success("Medicamento agregado exitosamente");
  };

  // Preparar edición
  const handleEditClick = (medication: Medication) => {
    setEditingMedication(medication);
    setFormData({
      nombre_comercial: medication.nombre_comercial,
      principio_activo: medication.principio_activo,
      presentacion: medication.presentacion,
      laboratorio: medication.laboratorio,
    });
    setIsEditDialogOpen(true);
  };

  // Actualizar medicamento
  const handleUpdateMedication = () => {
    if (!validateForm(formData) || !editingMedication) {
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    setMedications(
      medications.map((med) =>
        med.id_medicamento === editingMedication.id_medicamento
          ? {
              ...med,
              ...formData,
              fecha_modificacion: new Date().toISOString().split("T")[0],
            }
          : med
      )
    );

    setIsEditDialogOpen(false);
    setEditingMedication(null);
    resetForm();
    toast.success("Medicamento actualizado exitosamente");
  };

  // Cambiar estado activo/inactivo
  const handleToggleStatus = (medication: Medication) => {
    setMedications(
      medications.map((med) =>
        med.id_medicamento === medication.id_medicamento
          ? {
              ...med,
              activo: !med.activo,
              fecha_modificacion: new Date().toISOString().split("T")[0],
            }
          : med
      )
    );

    const newStatus = medication.activo ? "inactivado" : "activado";
    toast.success(`Medicamento ${newStatus} exitosamente`);
  };

  // Intentar eliminar medicamento
  const handleDeleteAttempt = (medication: Medication) => {
    if (medication.usado_en_prescripciones) {
      toast.error(
        "No se puede eliminar un medicamento que ha sido usado en prescripciones anteriores"
      );
      return;
    }

    setMedications(
      medications.filter(
        (med) => med.id_medicamento !== medication.id_medicamento
      )
    );
    toast.success("Medicamento eliminado exitosamente");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Medicamentos
          </h1>
          <p className="text-muted-foreground">
            Administra el catálogo de medicamentos del sistema
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar Medicamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Medicamento</DialogTitle>
              <DialogDescription>
                Completa todos los campos obligatorios para agregar un
                medicamento al catálogo.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre_comercial">Nombre Comercial *</Label>
                <Input
                  id="nombre_comercial"
                  value={formData.nombre_comercial}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nombre_comercial: e.target.value,
                    })
                  }
                  className={
                    formErrors.nombre_comercial ? "border-red-500" : ""
                  }
                />
                {formErrors.nombre_comercial && (
                  <span className="text-sm text-red-500">
                    {formErrors.nombre_comercial}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="principio_activo">Principio Activo *</Label>
                <Input
                  id="principio_activo"
                  value={formData.principio_activo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      principio_activo: e.target.value,
                    })
                  }
                  className={
                    formErrors.principio_activo ? "border-red-500" : ""
                  }
                />
                {formErrors.principio_activo && (
                  <span className="text-sm text-red-500">
                    {formErrors.principio_activo}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="presentacion">Presentación *</Label>
                <Select
                  value={formData.presentacion}
                  onValueChange={(value) =>
                    setFormData({ ...formData, presentacion: value })
                  }
                >
                  <SelectTrigger
                    className={formErrors.presentacion ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Selecciona la presentación" />
                  </SelectTrigger>
                  <SelectContent>
                    {presentationOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.presentacion && (
                  <span className="text-sm text-red-500">
                    {formErrors.presentacion}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="laboratorio">Laboratorio *</Label>
                <Select
                  value={formData.laboratorio}
                  onValueChange={(value) =>
                    setFormData({ ...formData, laboratorio: value })
                  }
                >
                  <SelectTrigger
                    className={formErrors.laboratorio ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Selecciona el laboratorio" />
                  </SelectTrigger>
                  <SelectContent>
                    {laboratoryOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.laboratorio && (
                  <span className="text-sm text-red-500">
                    {formErrors.laboratorio}
                  </span>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleAddMedication}>Agregar Medicamento</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, principio activo o laboratorio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value: "all" | "active" | "inactive") =>
                setStatusFilter(value)
              }
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Solo activos</SelectItem>
                <SelectItem value="inactive">Solo inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de medicamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Medicamentos</CardTitle>
          <CardDescription>
            {filteredMedications.length} medicamento
            {filteredMedications.length !== 1 ? "s" : ""} encontrado
            {filteredMedications.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">
                    ID
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Nombre Comercial
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Principio Activo
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Presentación
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Laboratorio
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Estado
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Usado en Prescripciones
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-right text-sm font-medium text-gray-900">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMedications.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="border border-gray-200 px-4 py-6 text-center text-gray-500"
                    >
                      No se encontraron medicamentos con los filtros aplicados
                    </td>
                  </tr>
                ) : (
                  filteredMedications.map((medication) => (
                    <tr
                      key={medication.id_medicamento}
                      className="hover:bg-gray-50"
                    >
                      <td className="border border-gray-200 px-4 py-3 font-medium">
                        {medication.id_medicamento}
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        {medication.nombre_comercial}
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        {medication.principio_activo}
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        {medication.presentacion}
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        {medication.laboratorio}
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        <Badge
                          variant={medication.activo ? "default" : "secondary"}
                        >
                          {medication.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        <Badge
                          variant={
                            medication.usado_en_prescripciones
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {medication.usado_en_prescripciones ? "Sí" : "No"}
                        </Badge>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(medication)}
                            title="Editar medicamento"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(medication)}
                            title={
                              medication.activo
                                ? "Inactivar medicamento"
                                : "Activar medicamento"
                            }
                          >
                            {medication.activo ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={medication.usado_en_prescripciones}
                                title={
                                  medication.usado_en_prescripciones
                                    ? "No se puede eliminar: usado en prescripciones"
                                    : "Eliminar medicamento"
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  ¿Estás seguro?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. El
                                  medicamento será eliminado permanentemente del
                                  sistema.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteAttempt(medication)
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Medicamento</DialogTitle>
            <DialogDescription>
              Modifica los datos del medicamento. El ID no puede ser editado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>ID del Medicamento</Label>
              <Input
                value={editingMedication?.id_medicamento || ""}
                disabled
                className="bg-muted"
              />
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label htmlFor="edit_nombre_comercial">Nombre Comercial *</Label>
              <Input
                id="edit_nombre_comercial"
                value={formData.nombre_comercial}
                onChange={(e) =>
                  setFormData({ ...formData, nombre_comercial: e.target.value })
                }
                className={formErrors.nombre_comercial ? "border-red-500" : ""}
              />
              {formErrors.nombre_comercial && (
                <span className="text-sm text-red-500">
                  {formErrors.nombre_comercial}
                </span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit_principio_activo">Principio Activo *</Label>
              <Input
                id="edit_principio_activo"
                value={formData.principio_activo}
                onChange={(e) =>
                  setFormData({ ...formData, principio_activo: e.target.value })
                }
                className={formErrors.principio_activo ? "border-red-500" : ""}
              />
              {formErrors.principio_activo && (
                <span className="text-sm text-red-500">
                  {formErrors.principio_activo}
                </span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit_presentacion">Presentación *</Label>
              <Select
                value={formData.presentacion}
                onValueChange={(value) =>
                  setFormData({ ...formData, presentacion: value })
                }
              >
                <SelectTrigger
                  className={formErrors.presentacion ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Selecciona la presentación" />
                </SelectTrigger>
                <SelectContent>
                  {presentationOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.presentacion && (
                <span className="text-sm text-red-500">
                  {formErrors.presentacion}
                </span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit_laboratorio">Laboratorio *</Label>
              <Select
                value={formData.laboratorio}
                onValueChange={(value) =>
                  setFormData({ ...formData, laboratorio: value })
                }
              >
                <SelectTrigger
                  className={formErrors.laboratorio ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Selecciona el laboratorio" />
                </SelectTrigger>
                <SelectContent>
                  {laboratoryOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.laboratorio && (
                <span className="text-sm text-red-500">
                  {formErrors.laboratorio}
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateMedication}>
              Actualizar Medicamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
