import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, AlertCircle, User, Eye } from "lucide-react";

// Tipos de datos
interface Cliente {
  idCliente: number;
  nombres: string;
  apPaterno: string;
  apMaterno: string;
  ci: string;
  telefono: string;
  correo: string;
  direccion: string;
  tipoCliente: "Doméstico" | "Granja";
  estadoCliente: "Activo" | "Inactivo";
  observaciones: string;
  fechaRegistro: string;
}

interface Animal {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  clienteId: number;
}

interface FormErrors {
  nombres?: string;
  apPaterno?: string;
  apMaterno?: string;
  ci?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
}

// Componente de formulario de cliente
const FormularioCliente = ({
  formData,
  setFormData,
  formErrors,
  onSubmit,
  onCancel,
  submitText,
}: {
  formData: Omit<Cliente, "idCliente" | "fechaRegistro">;
  setFormData: React.Dispatch<
    React.SetStateAction<Omit<Cliente, "idCliente" | "fechaRegistro">>
  >;
  formErrors: FormErrors;
  onSubmit: () => void;
  onCancel: () => void;
  submitText: string;
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombres">Nombres *</Label>
          <Input
            id="nombres"
            value={formData.nombres}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, nombres: e.target.value }))
            }
            className={formErrors.nombres ? "border-red-500" : ""}
          />
          {formErrors.nombres && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {formErrors.nombres}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="apPaterno">Apellido Paterno *</Label>
          <Input
            id="apPaterno"
            value={formData.apPaterno}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, apPaterno: e.target.value }))
            }
            className={formErrors.apPaterno ? "border-red-500" : ""}
          />
          {formErrors.apPaterno && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {formErrors.apPaterno}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="apMaterno">Apellido Materno *</Label>
        <Input
          id="apMaterno"
          value={formData.apMaterno}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, apMaterno: e.target.value }))
          }
          className={formErrors.apMaterno ? "border-red-500" : ""}
        />
        {formErrors.apMaterno && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {formErrors.apMaterno}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ci">Cédula de Identidad *</Label>
          <Input
            id="ci"
            value={formData.ci}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, ci: e.target.value }))
            }
            className={formErrors.ci ? "border-red-500" : ""}
          />
          {formErrors.ci && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {formErrors.ci}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono *</Label>
          <Input
            id="telefono"
            value={formData.telefono}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, telefono: e.target.value }))
            }
            className={formErrors.telefono ? "border-red-500" : ""}
          />
          {formErrors.telefono && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {formErrors.telefono}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="correo">Correo Electrónico *</Label>
        <Input
          id="correo"
          type="email"
          value={formData.correo}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, correo: e.target.value }))
          }
          className={formErrors.correo ? "border-red-500" : ""}
        />
        {formErrors.correo && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {formErrors.correo}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccion">Dirección *</Label>
        <Input
          id="direccion"
          value={formData.direccion}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, direccion: e.target.value }))
          }
          className={formErrors.direccion ? "border-red-500" : ""}
        />
        {formErrors.direccion && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {formErrors.direccion}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tipoCliente">Tipo de Cliente</Label>
          <Select
            value={formData.tipoCliente}
            onValueChange={(value: "Doméstico" | "Granja") =>
              setFormData((prev) => ({ ...prev, tipoCliente: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Doméstico">Doméstico</SelectItem>
              <SelectItem value="Granja">Granja</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="estadoCliente">Estado</Label>
          <Select
            value={formData.estadoCliente}
            onValueChange={(value: "Activo" | "Inactivo") =>
              setFormData((prev) => ({ ...prev, estadoCliente: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea
          id="observaciones"
          value={formData.observaciones}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, observaciones: e.target.value }))
          }
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onSubmit}>{submitText}</Button>
      </div>
    </div>
  );
};

// Componente Modal de Cliente
const ClienteModal = ({
  isOpen,
  onOpenChange,
  cliente = null,
  onSave,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cliente?: Cliente | null;
  onSave: (cliente: Omit<Cliente, "idCliente" | "fechaRegistro">) => void;
}) => {
  const isEdit = !!cliente;

  const [formData, setFormData] = useState<
    Omit<Cliente, "idCliente" | "fechaRegistro">
  >({
    nombres: cliente?.nombres || "",
    apPaterno: cliente?.apPaterno || "",
    apMaterno: cliente?.apMaterno || "",
    ci: cliente?.ci || "",
    telefono: cliente?.telefono || "",
    correo: cliente?.correo || "",
    direccion: cliente?.direccion || "",
    tipoCliente: cliente?.tipoCliente || "Doméstico",
    estadoCliente: cliente?.estadoCliente || "Activo",
    observaciones: cliente?.observaciones || "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.nombres.trim()) errors.nombres = "Los nombres son requeridos";
    if (!formData.apPaterno.trim())
      errors.apPaterno = "El apellido paterno es requerido";
    if (!formData.apMaterno.trim())
      errors.apMaterno = "El apellido materno es requerido";
    if (!formData.ci.trim()) errors.ci = "La cédula de identidad es requerida";
    if (!formData.telefono.trim()) errors.telefono = "El teléfono es requerido";
    if (!formData.correo.trim()) errors.correo = "El correo es requerido";
    if (!formData.direccion.trim())
      errors.direccion = "La dirección es requerida";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      onOpenChange(false);
      resetForm();
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nombres: "",
      apPaterno: "",
      apMaterno: "",
      ci: "",
      telefono: "",
      correo: "",
      direccion: "",
      tipoCliente: "Doméstico",
      estadoCliente: "Activo",
      observaciones: "",
    });
    setFormErrors({});
  };

  // Actualizar formulario cuando cambia el cliente
  React.useEffect(() => {
    if (cliente) {
      setFormData({
        nombres: cliente.nombres,
        apPaterno: cliente.apPaterno,
        apMaterno: cliente.apMaterno,
        ci: cliente.ci,
        telefono: cliente.telefono,
        correo: cliente.correo,
        direccion: cliente.direccion,
        tipoCliente: cliente.tipoCliente,
        estadoCliente: cliente.estadoCliente,
        observaciones: cliente.observaciones,
      });
    }
  }, [cliente]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Cliente" : "Crear Nuevo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifica la información del cliente"
              : "Completa todos los campos para registrar un nuevo cliente"}
          </DialogDescription>
        </DialogHeader>
        <FormularioCliente
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitText={isEdit ? "Actualizar Cliente" : "Crear Cliente"}
        />
      </DialogContent>
    </Dialog>
  );
};

// Componente de Detalles del Cliente
const ClienteDetalles = ({
  isOpen,
  onOpenChange,
  cliente,
  animales = [],
  onEdit,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: Cliente | null;
  animales?: Animal[];
  onEdit?: (cliente: Cliente) => void;
}) => {
  const clienteAnimales = animales.filter(
    (animal) => animal.clienteId === cliente?.idCliente
  );

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalles del Cliente</SheetTitle>
          <SheetDescription>Información completa del cliente</SheetDescription>
        </SheetHeader>

        {cliente && (
          <div className="mt-6 space-y-6">
            {/* Información personal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Nombres
                    </Label>
                    <p className="text-sm">{cliente.nombres}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Apellido Paterno
                    </Label>
                    <p className="text-sm">{cliente.apPaterno}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Apellido Materno
                    </Label>
                    <p className="text-sm">{cliente.apMaterno}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      CI
                    </Label>
                    <p className="text-sm">{cliente.ci}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Teléfono
                    </Label>
                    <p className="text-sm">{cliente.telefono}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Correo
                    </Label>
                    <p className="text-sm">{cliente.correo}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Dirección
                  </Label>
                  <p className="text-sm">{cliente.direccion}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Tipo de Cliente
                    </Label>
                    <div className="mt-1">
                      <Badge
                        variant={
                          cliente.tipoCliente === "Doméstico"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {cliente.tipoCliente}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Estado
                    </Label>
                    <div className="mt-1">
                      <Badge
                        variant={
                          cliente.estadoCliente === "Activo"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {cliente.estadoCliente}
                      </Badge>
                    </div>
                  </div>
                </div>
                {cliente.observaciones && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Observaciones
                    </Label>
                    <p className="text-sm mt-1 p-2 bg-muted rounded-md">
                      {cliente.observaciones}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Fecha de Registro
                  </Label>
                  <p className="text-sm">{cliente.fechaRegistro}</p>
                </div>
              </CardContent>
            </Card>

            {/* Animales asociados */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Animales del Cliente</CardTitle>
                <CardDescription>
                  {clienteAnimales.length} animal(es) registrado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {clienteAnimales.length > 0 ? (
                  <div className="space-y-3">
                    {clienteAnimales.map((animal) => (
                      <Card key={animal.id} className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                              Nombre
                            </Label>
                            <p className="text-sm font-medium">
                              {animal.nombre}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                              Especie
                            </Label>
                            <p className="text-sm">{animal.especie}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                              Raza
                            </Label>
                            <p className="text-sm">{animal.raza}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                              Edad
                            </Label>
                            <p className="text-sm">{animal.edad} año(s)</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No hay animales registrados para este cliente
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Botón de edición */}
            {onEdit && (
              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => {
                    onOpenChange(false);
                    onEdit(cliente);
                  }}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Editar Cliente
                </Button>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

// Página de prueba
const PaginaPruebaClientes = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  // Datos de ejemplo
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      idCliente: 1,
      nombres: "Juan Carlos",
      apPaterno: "Pérez",
      apMaterno: "García",
      ci: "12345678",
      telefono: "70123456",
      correo: "juan@email.com",
      direccion: "Av. Principal 123",
      tipoCliente: "Doméstico",
      estadoCliente: "Activo",
      observaciones: "Cliente regular",
      fechaRegistro: "2024-01-15",
    },
  ]);

  const animalesEjemplo: Animal[] = [
    {
      id: 1,
      nombre: "Max",
      especie: "Perro",
      raza: "Golden Retriever",
      edad: 3,
      clienteId: 1,
    },
  ];

  const handleCreateCliente = (
    clienteData: Omit<Cliente, "idCliente" | "fechaRegistro">
  ) => {
    const nuevoCliente: Cliente = {
      ...clienteData,
      idCliente: Date.now(),
      fechaRegistro: new Date().toISOString().split("T")[0],
    };
    setClientes((prev) => [...prev, nuevoCliente]);
  };

  const handleEditCliente = (
    clienteData: Omit<Cliente, "idCliente" | "fechaRegistro">
  ) => {
    if (selectedCliente) {
      setClientes((prev) =>
        prev.map((c) =>
          c.idCliente === selectedCliente.idCliente
            ? { ...c, ...clienteData }
            : c
        )
      );
    }
  };

  const openEditModal = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setIsEditModalOpen(true);
  };

  const openDetailSheet = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setIsDetailSheetOpen(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Lista de clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes Registrados</CardTitle>
          <CardDescription>
            {clientes.length} cliente(s) registrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clientes.map((cliente) => (
              <Card key={cliente.idCliente} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <User className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">
                        {cliente.nombres} {cliente.apPaterno}{" "}
                        {cliente.apMaterno}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        CI: {cliente.ci} | Tel: {cliente.telefono}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <Badge
                          variant={
                            cliente.tipoCliente === "Doméstico"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {cliente.tipoCliente}
                        </Badge>
                        <Badge
                          variant={
                            cliente.estadoCliente === "Activo"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {cliente.estadoCliente}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetailSheet(cliente)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(cliente)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de crear cliente */}
      <ClienteModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSave={handleCreateCliente}
      />

      {/* Modal de editar cliente */}
      <ClienteModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        cliente={selectedCliente}
        onSave={handleEditCliente}
      />

      {/* Sheet de detalles */}
      <ClienteDetalles
        isOpen={isDetailSheetOpen}
        onOpenChange={setIsDetailSheetOpen}
        cliente={selectedCliente}
        animales={animalesEjemplo}
        onEdit={openEditModal}
      />
    </div>
  );
};

export default PaginaPruebaClientes;
