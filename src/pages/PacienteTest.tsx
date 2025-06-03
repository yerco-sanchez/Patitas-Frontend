import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Calendar,
  Search,
  Plus,
  Edit2,
  Camera,
  Trash2,
  Filter,
  User,
  PawPrint,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";

export interface Paciente {
  idPaciente: number;
  nombreAnimal: string;
  especie: string;
  raza: string;
  sexo: "Macho" | "Hembra";
  fechaNacimiento: string;
  peso: number;
  clasificacion: "Doméstico" | "Granja";
  fotografia: string;
  fechaRegistro: string;
  idCliente: number;
  registradoPor: string;
}

// Datos mock
const mockCliente = {
  idCliente: 1,
  nombres: "María Elena",
  apPaterno: "García",
  apMaterno: "López",
  ci: "12345678",
  telefono: "+591 70123456",
  correo: "maria.garcia@email.com",
  direccion: "Av. Las Americas #123, Tarija",
  tipoCliente: "Doméstico",
  observaciones: "Cliente frecuente",
  estadoCliente: "Activo",
};

const mockPacientes = [
  {
    idPaciente: 1,
    nombreAnimal: "Rocky",
    especie: "Perro",
    raza: "Pastor Alemán",
    sexo: "Macho",
    fechaNacimiento: "2020-03-15",
    edad: 5,
    peso: 35.5,
    clasificacion: "Doméstico",
    fotografia:
      "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=150&h=150&fit=crop&crop=face",
    fechaRegistro: "2023-01-15T10:30:00",
    registradoPor: "Dr. Rodriguez",
    idCliente: 1,
  },
  {
    idPaciente: 2,
    nombreAnimal: "Mimi",
    especie: "Gato",
    raza: "Persa",
    sexo: "Hembra",
    fechaNacimiento: "2021-07-20",
    edad: 3,
    peso: 4.2,
    clasificacion: "Doméstico",
    fotografia:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=150&h=150&fit=crop&crop=face",
    fechaRegistro: "2023-02-20T14:15:00",
    registradoPor: "Dra. Martinez",
    idCliente: 1,
  },
];

// Schema de validación con Zod
const patientSchema = z.object({
  nombreAnimal: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  especie: z.string().min(1, "La especie es obligatoria"),
  raza: z.string().min(1, "La raza es obligatoria"),
  sexo: z.enum(["Macho", "Hembra"], {
    required_error: "El sexo es obligatorio",
  }),
  fechaNacimiento: z.string().min(1, "La fecha de nacimiento es obligatoria"),
  peso: z
    .number()
    .min(0.1, "El peso debe ser mayor a 0")
    .max(1000, "El peso no puede exceder 1000 kg"),
  clasificacion: z.enum(["Doméstico", "Granja"], {
    required_error: "La clasificación es obligatoria",
  }),
  fotografia: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

export default function PacientesRegistro() {
  const [pacientes, setPacientes] = useState(mockPacientes);
  const [filteredPacientes, setFilteredPacientes] = useState(mockPacientes);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEspecie, setFilterEspecie] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Paciente | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      nombreAnimal: "",
      especie: "",
      raza: "",
      sexo: undefined,
      fechaNacimiento: "",
      peso: 0,
      clasificacion: undefined,
      fotografia: "",
    },
  });

  // Calcular edad basada en fecha de nacimiento
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Filtrar y buscar pacientes
  useEffect(() => {
    let filtered = pacientes;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.nombreAnimal.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.especie.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.raza.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterEspecie) {
      filtered = filtered.filter((p) => p.especie === filterEspecie);
    }

    setFilteredPacientes(filtered);
  }, [pacientes, searchTerm, filterEspecie]);

  // Validar unicidad del nombre por cliente
  const validateUniqueName = (name: string, currentId?: number) => {
    return !pacientes.some(
      (p) =>
        p.nombreAnimal.toLowerCase() === name.toLowerCase() &&
        p.idPaciente !== currentId
    );
  };

  // Manejar envío del formulario
  const onSubmit = (data: PatientFormData) => {
    // Validar unicidad del nombre
    if (
      editingPatient &&
      !validateUniqueName(data.nombreAnimal, editingPatient.idPaciente)
    ) {
      toast.error("Ya existe un animal con ese nombre para este cliente", {
        description: "Por favor, elige un nombre diferente",
      });
      return;
    }

    const edad = calculateAge(data.fechaNacimiento);
    const now = new Date();

    if (editingPatient) {
      // Actualizar paciente existente
      const updatedPacientes = pacientes.map((p) =>
        p.idPaciente === editingPatient.idPaciente
          ? {
              ...p,
              ...data,
              edad,
              fotografia: imagePreview || p.fotografia,
            }
          : p
      );
      setPacientes(updatedPacientes);
      toast.success("Paciente actualizado exitosamente", {
        description: `Los datos de ${data.nombreAnimal} han sido actualizados`,
      });
    } else {
      // Crear nuevo paciente
      const newPaciente = {
        idPaciente: Math.max(...pacientes.map((p) => p.idPaciente)) + 1,
        ...data,
        edad,
        fotografia:
          imagePreview ||
          `https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=150&h=150&fit=crop&crop=face`,
        fechaRegistro: now.toISOString(),
        registradoPor: "Usuario Actual", // En producción vendría del contexto de autenticación
        idCliente: mockCliente.idCliente,
      };

      setPacientes([...pacientes, newPaciente]);
      toast.success("Paciente registrado exitosamente", {
        description: `${data.nombreAnimal} ha sido agregado como nuevo paciente`,
      });
    }

    // Resetear formulario y cerrar dialog
    form.reset();
    setImagePreview("");
    setEditingPatient(null);
    setIsDialogOpen(false);
  };

  // Manejar edición
  const handleEdit = (patient: Paciente) => {
    setEditingPatient(patient);
    setImagePreview(patient.fotografia);
    form.reset({
      nombreAnimal: patient.nombreAnimal,
      especie: patient.especie,
      raza: patient.raza,
      sexo: patient.sexo,
      fechaNacimiento: patient.fechaNacimiento,
      peso: patient.peso,
      clasificacion: patient.clasificacion,
      fotografia: patient.fotografia,
    });
    setIsDialogOpen(true);
  };

  // Manejar eliminación
  const handleDelete = (patientId: number, patientName: string) => {
    const updatedPacientes = pacientes.filter(
      (p) => p.idPaciente !== patientId
    );
    setPacientes(updatedPacientes);
    toast.success("Paciente eliminado", {
      description: `${patientName} ha sido eliminado del registro`,
    });
  };

  // Manejar carga de imagen
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB límite
        toast.error("Imagen demasiado grande", {
          description: "La imagen debe ser menor a 5MB",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        form.setValue("fotografia", result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Obtener especies únicas para el filtro
  const especies = [...new Set(pacientes.map((p) => p.especie))];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header con información del cliente */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">
                    {mockCliente.nombres} {mockCliente.apPaterno}{" "}
                    {mockCliente.apMaterno}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    CI: {mockCliente.ci} • Tel: {mockCliente.telefono} •{" "}
                    {mockCliente.correo}
                  </CardDescription>
                </div>
              </div>
              <Badge
                variant={
                  mockCliente.estadoCliente === "Activo"
                    ? "default"
                    : "secondary"
                }
              >
                {mockCliente.estadoCliente}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Dirección:</span>{" "}
                {mockCliente.direccion}
              </div>
              <div>
                <span className="font-medium">Tipo Cliente:</span>{" "}
                {mockCliente.tipoCliente}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Barra de búsqueda y filtros */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="search">Buscar pacientes</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Buscar por nombre, especie o raza..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-48">
                <Label htmlFor="filter-especie">Filtrar por especie</Label>
                <Select value={filterEspecie} onValueChange={setFilterEspecie}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las especies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=" ">Todas las especies</SelectItem>
                    {especies.map((especie) => (
                      <SelectItem key={especie} value={especie}>
                        {especie}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingPatient(null);
                      form.reset();
                      setImagePreview("");
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Paciente
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPatient
                        ? "Editar Paciente"
                        : "Registrar Nuevo Paciente"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingPatient
                        ? "Modifica los datos del paciente seleccionado"
                        : "Completa la información del nuevo paciente animal"}
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      {/* Foto del animal */}
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                          <Avatar className="h-24 w-24">
                            <AvatarImage src={imagePreview} />
                            <AvatarFallback className="bg-gray-100">
                              <Camera className="h-8 w-8 text-gray-400" />
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="photo-upload"
                          />
                          <Label
                            htmlFor="photo-upload"
                            className="cursor-pointer"
                          >
                            <Button type="button" variant="outline" size="sm">
                              <Camera className="h-4 w-4 mr-2" />
                              {imagePreview ? "Cambiar Foto" : "Agregar Foto"}
                            </Button>
                          </Label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre del animal */}
                        <FormField
                          control={form.control}
                          name="nombreAnimal"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre del Animal *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ej: Rocky, Mimi..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Especie */}
                        <FormField
                          control={form.control}
                          name="especie"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Especie *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar especie" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Perro">Perro</SelectItem>
                                  <SelectItem value="Gato">Gato</SelectItem>
                                  <SelectItem value="Ave">Ave</SelectItem>
                                  <SelectItem value="Conejo">Conejo</SelectItem>
                                  <SelectItem value="Hamster">
                                    Hamster
                                  </SelectItem>
                                  <SelectItem value="Bovino">Bovino</SelectItem>
                                  <SelectItem value="Ovino">Ovino</SelectItem>
                                  <SelectItem value="Porcino">
                                    Porcino
                                  </SelectItem>
                                  <SelectItem value="Equino">Equino</SelectItem>
                                  <SelectItem value="Otro">Otro</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Raza */}
                        <FormField
                          control={form.control}
                          name="raza"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Raza *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ej: Pastor Alemán, Persa..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Sexo */}
                        <FormField
                          control={form.control}
                          name="sexo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sexo *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar sexo" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Macho">Macho</SelectItem>
                                  <SelectItem value="Hembra">Hembra</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Fecha de nacimiento */}
                        <FormField
                          control={form.control}
                          name="fechaNacimiento"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha de Nacimiento *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormDescription>
                                La edad se calculará automáticamente
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Peso */}
                        <FormField
                          control={form.control}
                          name="peso"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Peso (kg) *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.1"
                                  placeholder="0.0"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Clasificación */}
                        <FormField
                          control={form.control}
                          name="clasificacion"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Clasificación *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar clasificación" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Doméstico">
                                    Doméstico
                                  </SelectItem>
                                  <SelectItem value="Granja">Granja</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit">
                          {editingPatient ? "Actualizar" : "Registrar"} Paciente
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Lista de pacientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPacientes.map((paciente) => (
            <Card
              key={paciente.idPaciente}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={paciente.fotografia} />
                      <AvatarFallback className="bg-orange-100 text-orange-600">
                        <PawPrint className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {paciente.nombreAnimal}
                      </CardTitle>
                      <CardDescription>
                        {paciente.especie} • {paciente.raza}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        handleDelete(paciente.idPaciente, paciente.nombreAnimal)
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Sexo:</span>
                    <div>{paciente.sexo}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Edad:</span>
                    <div>{paciente.edad} años</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Peso:</span>
                    <div>{paciente.peso} kg</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Clasificación:
                    </span>
                    <div>
                      <Badge
                        variant={
                          paciente.clasificacion === "Doméstico"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {paciente.clasificacion}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="text-xs text-gray-500">
                  Registrado:{" "}
                  {new Date(paciente.fechaRegistro).toLocaleDateString()} por{" "}
                  {paciente.registradoPor}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPacientes.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <PawPrint className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-gray-600 mb-2">
                No se encontraron pacientes
              </CardTitle>
              <CardDescription>
                {searchTerm || filterEspecie
                  ? "Prueba con otros términos de búsqueda o filtros"
                  : "Registra el primer paciente para este cliente"}
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
