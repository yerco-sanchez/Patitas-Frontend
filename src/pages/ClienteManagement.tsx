import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Filter,
  X,
  Check,
  AlertCircle,
  Users,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// Interfaces TypeScript
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
  observaciones: string;
  estadoCliente: "Activo" | "Inactivo";
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

interface Interaccion {
  id: number;
  fecha: string;
  tipo: string;
  descripcion: string;
  clienteId: number;
}

// Datos de ejemplo
const clientesData: Cliente[] = [
  {
    idCliente: 1,
    nombres: "María Carmen",
    apPaterno: "González",
    apMaterno: "López",
    ci: "12345678",
    telefono: "70123456",
    correo: "maria.gonzalez@email.com",
    direccion: "Av. Principal #123, Zona Centro",
    tipoCliente: "Doméstico",
    observaciones: "Cliente frecuente, muy puntual en sus citas",
    estadoCliente: "Activo",
    fechaRegistro: "2024-01-15",
  },
  {
    idCliente: 2,
    nombres: "Carlos Roberto",
    apPaterno: "Mendoza",
    apMaterno: "Silva",
    ci: "87654321",
    telefono: "75987654",
    correo: "carlos.mendoza@email.com",
    direccion: "Calle Los Pinos #456, Villa Esperanza",
    tipoCliente: "Granja",
    observaciones: "Granja avícola con 500 pollos",
    estadoCliente: "Activo",
    fechaRegistro: "2024-02-20",
  },
  {
    idCliente: 3,
    nombres: "Ana Sofía",
    apPaterno: "Rodríguez",
    apMaterno: "Morales",
    ci: "11223344",
    telefono: "68123789",
    correo: "ana.rodriguez@email.com",
    direccion: "Barrio San Antonio #789",
    tipoCliente: "Doméstico",
    observaciones: "Tiene 3 gatos persas",
    estadoCliente: "Inactivo",
    fechaRegistro: "2023-12-10",
  },
];

const animalesData: Animal[] = [
  {
    id: 1,
    nombre: "Firulais",
    especie: "Perro",
    raza: "Golden Retriever",
    edad: 3,
    clienteId: 1,
  },
  {
    id: 2,
    nombre: "Misifu",
    especie: "Gato",
    raza: "Persa",
    edad: 2,
    clienteId: 1,
  },
  {
    id: 3,
    nombre: "Pollos",
    especie: "Gallina",
    raza: "Rhode Island",
    edad: 1,
    clienteId: 2,
  },
  {
    id: 4,
    nombre: "Luna",
    especie: "Gato",
    raza: "Persa",
    edad: 4,
    clienteId: 3,
  },
  {
    id: 5,
    nombre: "Nieve",
    especie: "Gato",
    raza: "Persa",
    edad: 2,
    clienteId: 3,
  },
  {
    id: 6,
    nombre: "Sombra",
    especie: "Gato",
    raza: "Persa",
    edad: 1,
    clienteId: 3,
  },
];

const interaccionesData: Interaccion[] = [
  {
    id: 1,
    fecha: "2024-05-20",
    tipo: "Consulta",
    descripcion: "Revisión general de Firulais",
    clienteId: 1,
  },
  {
    id: 2,
    fecha: "2024-05-15",
    tipo: "Vacunación",
    descripcion: "Vacuna antirrábica para Misifu",
    clienteId: 1,
  },
  {
    id: 3,
    fecha: "2024-05-10",
    tipo: "Tratamiento",
    descripcion: "Desparasitación masiva de pollos",
    clienteId: 2,
  },
  {
    id: 4,
    fecha: "2024-04-25",
    tipo: "Consulta",
    descripcion: "Revisión de gatos persas",
    clienteId: 3,
  },
];

const ClienteManagement = () => {
  const [clientes, setClientes] = useState<Cliente[]>(clientesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("all");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);

  // Estado para el formulario
  const [formData, setFormData] = useState<
    Omit<Cliente, "idCliente" | "fechaRegistro">
  >({
    nombres: "",
    apPaterno: "",
    apMaterno: "",
    ci: "",
    telefono: "",
    correo: "",
    direccion: "",
    tipoCliente: "Doméstico",
    observaciones: "",
    estadoCliente: "Activo",
  });

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});

  // Filtrado de clientes
  const filteredClientes = useMemo(() => {
    return clientes.filter((cliente) => {
      const matchesSearch =
        searchTerm === "" ||
        cliente.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.apPaterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.apMaterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.ci.includes(searchTerm) ||
        cliente.telefono.includes(searchTerm) ||
        cliente.correo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTipo =
        filterTipo === "all" || cliente.tipoCliente === filterTipo;
      const matchesEstado =
        filterEstado === "all" || cliente.estadoCliente === filterEstado;

      return matchesSearch && matchesTipo && matchesEstado;
    });
  }, [clientes, searchTerm, filterTipo, filterEstado]);

  // Validación del formulario
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof typeof formData, string>> = {};

    if (!formData.nombres.trim())
      errors.nombres = "Los nombres son obligatorios";
    if (!formData.apPaterno.trim())
      errors.apPaterno = "El apellido paterno es obligatorio";
    if (!formData.apMaterno.trim())
      errors.apMaterno = "El apellido materno es obligatorio";
    if (!formData.ci.trim())
      errors.ci = "La cédula de identidad es obligatoria";
    if (!formData.telefono.trim())
      errors.telefono = "El teléfono es obligatorio";
    if (!formData.correo.trim()) errors.correo = "El correo es obligatorio";
    if (!formData.direccion.trim())
      errors.direccion = "La dirección es obligatoria";

    // Validar CI único
    const existingCi = clientes.find(
      (c) =>
        c.ci === formData.ci &&
        (!selectedCliente || c.idCliente !== selectedCliente.idCliente)
    );
    if (existingCi) errors.ci = "Esta cédula de identidad ya está registrada";

    // Validar correo único
    const existingEmail = clientes.find(
      (c) =>
        c.correo === formData.correo &&
        (!selectedCliente || c.idCliente !== selectedCliente.idCliente)
    );
    if (existingEmail)
      errors.correo = "Este correo electrónico ya está registrado";

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.correo && !emailRegex.test(formData.correo)) {
      errors.correo = "El formato del correo electrónico no es válido";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Limpiar formulario
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
      observaciones: "",
      estadoCliente: "Activo",
    });
    setFormErrors({});
  };

  // Crear cliente
  const handleCreateCliente = () => {
    if (!validateForm()) {
      toast.error("Por favor, corrije los errores en el formulario");
      return;
    }

    const newId = Math.max(...clientes.map((c) => c.idCliente)) + 1;
    const newCliente: Cliente = {
      ...formData,
      idCliente: newId,
      fechaRegistro: new Date().toISOString().split("T")[0],
    };

    setClientes((prev) => [...prev, newCliente]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast.success("Cliente creado exitosamente");
  };

  // Editar cliente
  const handleEditCliente = () => {
    if (!validateForm() || !selectedCliente) {
      toast.error("Por favor, corrije los errores en el formulario");
      return;
    }

    const updatedCliente: Cliente = {
      ...selectedCliente,
      ...formData,
    };

    setClientes((prev) =>
      prev.map((c) =>
        c.idCliente === selectedCliente.idCliente ? updatedCliente : c
      )
    );
    setIsEditDialogOpen(false);
    setSelectedCliente(null);
    resetForm();
    toast.success("Cliente actualizado exitosamente");
  };

  // Eliminar cliente
  const handleDeleteCliente = () => {
    if (!clienteToDelete) return;

    setClientes((prev) =>
      prev.filter((c) => c.idCliente !== clienteToDelete.idCliente)
    );
    setIsDeleteDialogOpen(false);
    setClienteToDelete(null);
    toast.success("Cliente eliminado exitosamente");
  };

  // Abrir diálogo de edición
  const openEditDialog = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setFormData({
      nombres: cliente.nombres,
      apPaterno: cliente.apPaterno,
      apMaterno: cliente.apMaterno,
      ci: cliente.ci,
      telefono: cliente.telefono,
      correo: cliente.correo,
      direccion: cliente.direccion,
      tipoCliente: cliente.tipoCliente,
      observaciones: cliente.observaciones,
      estadoCliente: cliente.estadoCliente,
    });
    setIsEditDialogOpen(true);
  };

  // Abrir sheet de detalles
  const openDetailSheet = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setIsDetailSheetOpen(true);
  };

  // Obtener animales del cliente
  const getClienteAnimales = (clienteId: number) => {
    return animalesData.filter((animal) => animal.clienteId === clienteId);
  };

  // Obtener interacciones del cliente
  const getClienteInteracciones = (clienteId: number) => {
    return interaccionesData.filter(
      (interaccion) => interaccion.clienteId === clienteId
    );
  };

  // Componente de formulario
  const FormularioCliente = ({
    onSubmit,
    submitText,
    isEdit = false,
  }: {
    onSubmit: () => void;
    submitText: string;
    isEdit?: boolean;
  }) => (
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
        <Button
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setIsEditDialogOpen(false);
            } else {
              setIsCreateDialogOpen(false);
            }
            resetForm();
          }}
        >
          Cancelar
        </Button>
        <Button onClick={onSubmit}>{submitText}</Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
          <p className="text-muted-foreground"></p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Cliente</DialogTitle>
              <DialogDescription>
                Completa todos los campos para registrar un nuevo cliente
              </DialogDescription>
            </DialogHeader>
            <FormularioCliente
              onSubmit={handleCreateCliente}
              submitText="Crear Cliente"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="mb-6">
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
                  placeholder="Buscar por nombre, apellidos, CI, teléfono o correo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo de cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="Doméstico">Doméstico</SelectItem>
                <SelectItem value="Granja">Granja</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
            {(searchTerm || filterTipo !== "all" || filterEstado !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilterTipo("all");
                  setFilterEstado("all");
                }}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Limpiar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabla de clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Se encontraron {filteredClientes.length} cliente(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>CI</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Registro</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.idCliente}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {cliente.nombres} {cliente.apPaterno}{" "}
                        {cliente.apMaterno}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {cliente.direccion}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{cliente.ci}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{cliente.telefono}</div>
                      <div className="text-muted-foreground">
                        {cliente.correo}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        cliente.tipoCliente === "Doméstico"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {cliente.tipoCliente}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        cliente.estadoCliente === "Activo"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {cliente.estadoCliente}
                    </Badge>
                  </TableCell>
                  <TableCell>{cliente.fechaRegistro}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => openDetailSheet(cliente)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(cliente)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setClienteToDelete(cliente);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredClientes.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No se encontraron clientes que coincidan con los criterios
                    de búsqueda
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Modifica la información del cliente seleccionado
            </DialogDescription>
          </DialogHeader>
          <FormularioCliente
            onSubmit={handleEditCliente}
            submitText="Actualizar Cliente"
            isEdit={true}
          />
        </DialogContent>
      </Dialog>

      {/* Sheet de detalles */}
      <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
        <SheetContent className="min-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Detalles del Cliente</SheetTitle>
            <SheetDescription>
              Información completa y historial del cliente
            </SheetDescription>
          </SheetHeader>

          {selectedCliente && (
            <div className="mt-6 space-y-6">
              {/* Información personal */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Nombres
                      </Label>
                      <p className="text-sm">{selectedCliente.nombres}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Apellido Paterno
                      </Label>
                      <p className="text-sm">{selectedCliente.apPaterno}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Apellido Materno
                      </Label>
                      <p className="text-sm">{selectedCliente.apMaterno}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        CI
                      </Label>
                      <p className="text-sm">{selectedCliente.ci}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Teléfono
                      </Label>
                      <p className="text-sm">{selectedCliente.telefono}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Correo
                      </Label>
                      <p className="text-sm">{selectedCliente.correo}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Dirección
                    </Label>
                    <p className="text-sm">{selectedCliente.direccion}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Tipo de Cliente
                      </Label>
                      <div className="mt-1">
                        <Badge
                          variant={
                            selectedCliente.tipoCliente === "Doméstico"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {selectedCliente.tipoCliente}
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
                            selectedCliente.estadoCliente === "Activo"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {selectedCliente.estadoCliente}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {selectedCliente.observaciones && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Observaciones
                      </Label>
                      <p className="text-sm mt-1 p-2 bg-muted rounded-md">
                        {selectedCliente.observaciones}
                      </p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Fecha de Registro
                    </Label>
                    <p className="text-sm">{selectedCliente.fechaRegistro}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs para animales e interacciones */}
              <Tabs defaultValue="animales" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="animales">Animales Asociados</TabsTrigger>
                  <TabsTrigger value="interacciones">
                    Historial de Interacciones
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="animales" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Animales del Cliente
                      </CardTitle>
                      <CardDescription>
                        {getClienteAnimales(selectedCliente.idCliente).length}{" "}
                        animal(es) registrado(s)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {getClienteAnimales(selectedCliente.idCliente).length >
                      0 ? (
                        <div className="space-y-3">
                          {getClienteAnimales(selectedCliente.idCliente).map(
                            (animal) => (
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
                                    <p className="text-sm">
                                      {animal.edad} año(s)
                                    </p>
                                  </div>
                                </div>
                              </Card>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-8">
                          No hay animales registrados para este cliente
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="interacciones" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Historial de Interacciones
                      </CardTitle>
                      <CardDescription>
                        {
                          getClienteInteracciones(selectedCliente.idCliente)
                            .length
                        }{" "}
                        interacción(es) registrada(s)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {getClienteInteracciones(selectedCliente.idCliente)
                        .length > 0 ? (
                        <div className="space-y-3">
                          {getClienteInteracciones(selectedCliente.idCliente)
                            .sort(
                              (a, b) =>
                                new Date(b.fecha).getTime() -
                                new Date(a.fecha).getTime()
                            )
                            .map((interaccion) => (
                              <Card key={interaccion.id} className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <Badge variant="outline">
                                    {interaccion.tipo}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {interaccion.fecha}
                                  </span>
                                </div>
                                <p className="text-sm">
                                  {interaccion.descripcion}
                                </p>
                              </Card>
                            ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-8">
                          No hay interacciones registradas para este cliente
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Botón de edición rápida */}
              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => {
                    setIsDetailSheetOpen(false);
                    openEditDialog(selectedCliente);
                  }}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Editar Cliente
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              cliente
              {clienteToDelete &&
                ` "${clienteToDelete.nombres} ${clienteToDelete.apPaterno}"`}
              y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCliente}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar Cliente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClienteManagement;
