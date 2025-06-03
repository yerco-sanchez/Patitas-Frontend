import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Plus,
  Calendar,
  Pill,
  Activity,
  Pause,
  Play,
  X,
  Edit,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

// Interfaces y tipos
interface Paciente {
  idPaciente: string;
  nombreAnimal: string;
  especie: string;
  raza: string;
  sexo: string;
  edad: number;
  peso: number;
  clasificacion: "Doméstico" | "Granja";
  fotografia?: string;
  fechaRegistro: string;
  registradoPor: string;
}

interface Tratamiento {
  idTratamiento: string;
  idPaciente: string;
  fechaInicioTratamiento: string;
  fechaFinEstimada: string;
  fechaFinReal?: string;
  descripcionGeneral: string;
  tipoTratamiento:
    | "Farmacológico"
    | "Quirúrgico"
    | "Preventivo"
    | "Hospitalización"
    | "Dietético";
  estadoTratamiento: "Activo" | "Completado" | "Suspendido" | "Cancelado";
  objetivoTratamiento: string;
  motivoSuspension?: string;
}

interface Medicamento {
  idMedicamento: string;
  nombreComercial: string;
  principioActivo: string;
  presentacion: string;
  laboratorio: string;
}

interface PrescripcionMedicamento {
  idPrescripcion: string;
  idTratamiento: string;
  idMedicamento: string;
  dosis: number;
  unidadDosis: string;
  frecuenciaAdministracion: string;
  viaAdministracion: string;
  instruccionesAdicionales: string;
  fechaInicioMedicacion: string;
  fechaFinMedicacion: string;
  estadoPrescripcion: "Activa" | "Suspendida" | "Completada" | "Cancelada";
  motivoSuspension?: string;
}

// Datos de prueba
const pacienteSeleccionado: Paciente = {
  idPaciente: "P001",
  nombreAnimal: "Max",
  especie: "Canino",
  raza: "Golden Retriever",
  sexo: "Macho",
  edad: 5,
  peso: 30,
  clasificacion: "Doméstico",
  fechaRegistro: "2024-01-15",
  registradoPor: "Dr. García",
};

const medicamentosDisponibles: Medicamento[] = [
  {
    idMedicamento: "M001",
    nombreComercial: "Amoxicilina 500mg",
    principioActivo: "Amoxicilina",
    presentacion: "Comprimidos",
    laboratorio: "VetPharm",
  },
  {
    idMedicamento: "M002",
    nombreComercial: "Carprofen 25mg",
    principioActivo: "Carprofeno",
    presentacion: "Comprimidos",
    laboratorio: "AnimalHealth",
  },
  {
    idMedicamento: "M003",
    nombreComercial: "Ivermectina 1%",
    principioActivo: "Ivermectina",
    presentacion: "Solución inyectable",
    laboratorio: "VetCare",
  },
];

const tratamientosIniciales: Tratamiento[] = [
  {
    idTratamiento: "T001",
    idPaciente: "P001",
    fechaInicioTratamiento: "2024-12-01",
    fechaFinEstimada: "2024-12-15",
    descripcionGeneral: "Tratamiento antibiótico para infección respiratoria",
    tipoTratamiento: "Farmacológico",
    estadoTratamiento: "Activo",
    objetivoTratamiento:
      "Eliminar infección bacteriana del tracto respiratorio",
  },
  {
    idTratamiento: "T002",
    idPaciente: "P001",
    fechaInicioTratamiento: "2024-11-20",
    fechaFinEstimada: "2024-11-30",
    fechaFinReal: "2024-11-28",
    descripcionGeneral: "Tratamiento antiinflamatorio post-cirugía",
    tipoTratamiento: "Farmacológico",
    estadoTratamiento: "Completado",
    objetivoTratamiento: "Reducir inflamación y dolor post-operatorio",
  },
];

const prescripcionesIniciales: PrescripcionMedicamento[] = [
  {
    idPrescripcion: "PR001",
    idTratamiento: "T001",
    idMedicamento: "M001",
    dosis: 500,
    unidadDosis: "mg",
    frecuenciaAdministracion: "Cada 12 horas",
    viaAdministracion: "Oral",
    instruccionesAdicionales: "Administrar con alimento",
    fechaInicioMedicacion: "2024-12-01",
    fechaFinMedicacion: "2024-12-15",
    estadoPrescripcion: "Activa",
  },
  {
    idPrescripcion: "PR002",
    idTratamiento: "T002",
    idMedicamento: "M002",
    dosis: 25,
    unidadDosis: "mg",
    frecuenciaAdministracion: "Cada 24 horas",
    viaAdministracion: "Oral",
    instruccionesAdicionales: "En ayunas",
    fechaInicioMedicacion: "2024-11-20",
    fechaFinMedicacion: "2024-11-30",
    estadoPrescripcion: "Completada",
  },
];

export default function GestionTratamientos() {
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>(
    tratamientosIniciales
  );
  const [prescripciones, setPrescripciones] = useState<
    PrescripcionMedicamento[]
  >(prescripcionesIniciales);
  const [showNuevoTratamiento, setShowNuevoTratamiento] = useState(false);
  const [showNuevaPrescripcion, setShowNuevaPrescripcion] = useState(false);
  const [tratamientoSeleccionado, setTratamientoSeleccionado] =
    useState<string>("");

  // Estados para formularios
  const [nuevoTratamiento, setNuevoTratamiento] = useState<
    Partial<Tratamiento>
  >({
    tipoTratamiento: "Farmacológico",
    estadoTratamiento: "Activo",
  });

  const [nuevaPrescripcion, setNuevaPrescripcion] = useState<
    Partial<PrescripcionMedicamento>
  >({
    estadoPrescripcion: "Activa",
    viaAdministracion: "Oral",
  });

  const [motivoSuspension, setMotivoSuspension] = useState("");

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "Activo":
      case "Activa":
        return "default";
      case "Completado":
      case "Completada":
        return "secondary";
      case "Suspendido":
      case "Suspendida":
        return "destructive";
      case "Cancelado":
      case "Cancelada":
        return "outline";
      default:
        return "default";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Activo":
      case "Activa":
        return <Activity className="h-4 w-4" />;
      case "Completado":
      case "Completada":
        return <CheckCircle className="h-4 w-4" />;
      case "Suspendido":
      case "Suspendida":
        return <Pause className="h-4 w-4" />;
      case "Cancelado":
      case "Cancelada":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const crearTratamiento = () => {
    if (
      !nuevoTratamiento.descripcionGeneral ||
      !nuevoTratamiento.objetivoTratamiento ||
      !nuevoTratamiento.fechaInicioTratamiento ||
      !nuevoTratamiento.fechaFinEstimada
    ) {
      toast.error("Por favor complete todos los campos obligatorios");
      return;
    }

    const id = `T${String(tratamientos.length + 1).padStart(3, "0")}`;
    const tratamiento: Tratamiento = {
      idTratamiento: id,
      idPaciente: pacienteSeleccionado.idPaciente,
      fechaInicioTratamiento: nuevoTratamiento.fechaInicioTratamiento!,
      fechaFinEstimada: nuevoTratamiento.fechaFinEstimada!,
      descripcionGeneral: nuevoTratamiento.descripcionGeneral!,
      tipoTratamiento: nuevoTratamiento.tipoTratamiento!,
      estadoTratamiento: nuevoTratamiento.estadoTratamiento!,
      objetivoTratamiento: nuevoTratamiento.objetivoTratamiento!,
    };

    setTratamientos([...tratamientos, tratamiento]);
    setNuevoTratamiento({
      tipoTratamiento: "Farmacológico",
      estadoTratamiento: "Activo",
    });
    setShowNuevoTratamiento(false);
    toast.success("Tratamiento creado exitosamente");
  };

  const crearPrescripcion = () => {
    if (
      !nuevaPrescripcion.idMedicamento ||
      !nuevaPrescripcion.dosis ||
      !nuevaPrescripcion.frecuenciaAdministracion ||
      !nuevaPrescripcion.fechaInicioMedicacion ||
      !nuevaPrescripcion.fechaFinMedicacion
    ) {
      toast.error("Por favor complete todos los campos obligatorios");
      return;
    }

    const id = `PR${String(prescripciones.length + 1).padStart(3, "0")}`;
    const prescripcion: PrescripcionMedicamento = {
      idPrescripcion: id,
      idTratamiento: tratamientoSeleccionado,
      idMedicamento: nuevaPrescripcion.idMedicamento!,
      dosis: nuevaPrescripcion.dosis!,
      unidadDosis: nuevaPrescripcion.unidadDosis || "mg",
      frecuenciaAdministracion: nuevaPrescripcion.frecuenciaAdministracion!,
      viaAdministracion: nuevaPrescripcion.viaAdministracion!,
      instruccionesAdicionales:
        nuevaPrescripcion.instruccionesAdicionales || "",
      fechaInicioMedicacion: nuevaPrescripcion.fechaInicioMedicacion!,
      fechaFinMedicacion: nuevaPrescripcion.fechaFinMedicacion!,
      estadoPrescripcion: nuevaPrescripcion.estadoPrescripcion!,
    };

    setPrescripciones([...prescripciones, prescripcion]);
    setNuevaPrescripcion({
      estadoPrescripcion: "Activa",
      viaAdministracion: "Oral",
    });
    setShowNuevaPrescripcion(false);
    setTratamientoSeleccionado("");
    toast.success("Prescripción agregada exitosamente");
  };

  const suspenderTratamiento = (idTratamiento: string, motivo: string) => {
    setTratamientos(
      tratamientos.map((t) =>
        t.idTratamiento === idTratamiento
          ? { ...t, estadoTratamiento: "Suspendido", motivoSuspension: motivo }
          : t
      )
    );

    // Suspender también las prescripciones activas del tratamiento
    setPrescripciones(
      prescripciones.map((p) =>
        p.idTratamiento === idTratamiento && p.estadoPrescripcion === "Activa"
          ? { ...p, estadoPrescripcion: "Suspendida", motivoSuspension: motivo }
          : p
      )
    );

    toast.success("Tratamiento suspendido correctamente");
  };

  const suspenderPrescripcion = (idPrescripcion: string, motivo: string) => {
    setPrescripciones(
      prescripciones.map((p) =>
        p.idPrescripcion === idPrescripcion
          ? { ...p, estadoPrescripcion: "Suspendida", motivoSuspension: motivo }
          : p
      )
    );
    toast.success("Prescripción suspendida correctamente");
  };

  const obtenerMedicamento = (idMedicamento: string) => {
    return medicamentosDisponibles.find(
      (m) => m.idMedicamento === idMedicamento
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header con información del paciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Activity className="h-6 w-6" />
            Gestión de Tratamientos - {pacienteSeleccionado.nombreAnimal}
          </CardTitle>
          <CardDescription>
            {pacienteSeleccionado.especie} • {pacienteSeleccionado.raza} •{" "}
            {pacienteSeleccionado.edad} años • {pacienteSeleccionado.peso} kg
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Sección de Tratamientos */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Tratamientos</h2>
          <Dialog
            open={showNuevoTratamiento}
            onOpenChange={setShowNuevoTratamiento}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Tratamiento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Tratamiento</DialogTitle>
                <DialogDescription>
                  Complete la información del nuevo plan de tratamiento
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Tratamiento *</Label>
                  <Select
                    value={nuevoTratamiento.tipoTratamiento}
                    onValueChange={(value) =>
                      setNuevoTratamiento({
                        ...nuevoTratamiento,
                        tipoTratamiento: value as any,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Farmacológico">
                        Farmacológico
                      </SelectItem>
                      <SelectItem value="Quirúrgico">Quirúrgico</SelectItem>
                      <SelectItem value="Preventivo">Preventivo</SelectItem>
                      <SelectItem value="Hospitalización">
                        Hospitalización
                      </SelectItem>
                      <SelectItem value="Dietético">Dietético</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={nuevoTratamiento.estadoTratamiento}
                    onValueChange={(value) =>
                      setNuevoTratamiento({
                        ...nuevoTratamiento,
                        estadoTratamiento: value as any,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Completado">Completado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaInicio">Fecha Inicio *</Label>
                  <Input
                    type="date"
                    value={nuevoTratamiento.fechaInicioTratamiento || ""}
                    onChange={(e) =>
                      setNuevoTratamiento({
                        ...nuevoTratamiento,
                        fechaInicioTratamiento: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaFin">Fecha Fin Estimada *</Label>
                  <Input
                    type="date"
                    value={nuevoTratamiento.fechaFinEstimada || ""}
                    onChange={(e) =>
                      setNuevoTratamiento({
                        ...nuevoTratamiento,
                        fechaFinEstimada: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="objetivo">Objetivo del Tratamiento *</Label>
                  <Textarea
                    placeholder="Describa el objetivo principal del tratamiento"
                    value={nuevoTratamiento.objetivoTratamiento || ""}
                    onChange={(e) =>
                      setNuevoTratamiento({
                        ...nuevoTratamiento,
                        objetivoTratamiento: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="descripcion">Descripción General *</Label>
                  <Textarea
                    placeholder="Describa el tratamiento en detalle"
                    value={nuevoTratamiento.descripcionGeneral || ""}
                    onChange={(e) =>
                      setNuevoTratamiento({
                        ...nuevoTratamiento,
                        descripcionGeneral: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowNuevoTratamiento(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={crearTratamiento}>Crear Tratamiento</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {tratamientos.map((tratamiento) => (
            <Card key={tratamiento.idTratamiento}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getEstadoIcon(tratamiento.estadoTratamiento)}
                      {tratamiento.tipoTratamiento} -{" "}
                      {tratamiento.idTratamiento}
                    </CardTitle>
                    <CardDescription>
                      {tratamiento.descripcionGeneral}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={getEstadoBadgeVariant(
                        tratamiento.estadoTratamiento
                      )}
                    >
                      {tratamiento.estadoTratamiento}
                    </Badge>
                    {tratamiento.estadoTratamiento === "Activo" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Pause className="h-4 w-4 mr-1" />
                            Suspender
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Suspender Tratamiento
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Indique el motivo de la suspensión del tratamiento
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <Textarea
                            placeholder="Motivo de la suspensión..."
                            value={motivoSuspension}
                            onChange={(e) =>
                              setMotivoSuspension(e.target.value)
                            }
                          />
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => setMotivoSuspension("")}
                            >
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                suspenderTratamiento(
                                  tratamiento.idTratamiento,
                                  motivoSuspension
                                );
                                setMotivoSuspension("");
                              }}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Suspender
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Inicio:</span>
                    <div>
                      {new Date(
                        tratamiento.fechaInicioTratamiento
                      ).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Fin Estimado:
                    </span>
                    <div>
                      {new Date(
                        tratamiento.fechaFinEstimada
                      ).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Objetivo:</span>
                    <div>{tratamiento.objetivoTratamiento}</div>
                  </div>
                  {tratamiento.motivoSuspension && (
                    <div>
                      <span className="font-medium text-red-600">
                        Motivo Suspensión:
                      </span>
                      <div className="text-red-600">
                        {tratamiento.motivoSuspension}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Prescripciones del tratamiento */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium flex items-center gap-2">
                      <Pill className="h-4 w-4" />
                      Prescripciones
                    </h4>
                    {tratamiento.estadoTratamiento === "Activo" && (
                      <Dialog
                        open={
                          showNuevaPrescripcion &&
                          tratamientoSeleccionado === tratamiento.idTratamiento
                        }
                        onOpenChange={(open) => {
                          setShowNuevaPrescripcion(open);
                          if (open)
                            setTratamientoSeleccionado(
                              tratamiento.idTratamiento
                            );
                          else setTratamientoSeleccionado("");
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Plus className="h-4 w-4 mr-1" />
                            Agregar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Agregar Prescripción</DialogTitle>
                            <DialogDescription>
                              Agregar medicamento al tratamiento{" "}
                              {tratamiento.idTratamiento}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="medicamento">Medicamento *</Label>
                              <Select
                                value={nuevaPrescripcion.idMedicamento}
                                onValueChange={(value) =>
                                  setNuevaPrescripcion({
                                    ...nuevaPrescripcion,
                                    idMedicamento: value,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar medicamento" />
                                </SelectTrigger>
                                <SelectContent>
                                  {medicamentosDisponibles.map((med) => (
                                    <SelectItem
                                      key={med.idMedicamento}
                                      value={med.idMedicamento}
                                    >
                                      {med.nombreComercial} -{" "}
                                      {med.principioActivo}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="via">
                                Vía de Administración *
                              </Label>
                              <Select
                                value={nuevaPrescripcion.viaAdministracion}
                                onValueChange={(value) =>
                                  setNuevaPrescripcion({
                                    ...nuevaPrescripcion,
                                    viaAdministracion: value,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Oral">Oral</SelectItem>
                                  <SelectItem value="Intramuscular">
                                    Intramuscular
                                  </SelectItem>
                                  <SelectItem value="Intravenosa">
                                    Intravenosa
                                  </SelectItem>
                                  <SelectItem value="Subcutánea">
                                    Subcutánea
                                  </SelectItem>
                                  <SelectItem value="Tópica">Tópica</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="dosis">Dosis *</Label>
                              <Input
                                type="number"
                                step="0.1"
                                value={nuevaPrescripcion.dosis || ""}
                                onChange={(e) =>
                                  setNuevaPrescripcion({
                                    ...nuevaPrescripcion,
                                    dosis: parseFloat(e.target.value),
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="unidad">Unidad</Label>
                              <Select
                                value={nuevaPrescripcion.unidadDosis}
                                onValueChange={(value) =>
                                  setNuevaPrescripcion({
                                    ...nuevaPrescripcion,
                                    unidadDosis: value,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="mg" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="mg">mg</SelectItem>
                                  <SelectItem value="ml">ml</SelectItem>
                                  <SelectItem value="g">g</SelectItem>
                                  <SelectItem value="comprimidos">
                                    comprimidos
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="frecuencia">Frecuencia *</Label>
                              <Input
                                placeholder="Ej: Cada 12 horas"
                                value={
                                  nuevaPrescripcion.frecuenciaAdministracion ||
                                  ""
                                }
                                onChange={(e) =>
                                  setNuevaPrescripcion({
                                    ...nuevaPrescripcion,
                                    frecuenciaAdministracion: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="estado">Estado</Label>
                              <Select
                                value={nuevaPrescripcion.estadoPrescripcion}
                                onValueChange={(value) =>
                                  setNuevaPrescripcion({
                                    ...nuevaPrescripcion,
                                    estadoPrescripcion: value as any,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Activa">Activa</SelectItem>
                                  <SelectItem value="Completada">
                                    Completada
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="fechaInicioMed">
                                Fecha Inicio *
                              </Label>
                              <Input
                                type="date"
                                value={
                                  nuevaPrescripcion.fechaInicioMedicacion || ""
                                }
                                onChange={(e) =>
                                  setNuevaPrescripcion({
                                    ...nuevaPrescripcion,
                                    fechaInicioMedicacion: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="fechaFinMed">Fecha Fin *</Label>
                              <Input
                                type="date"
                                value={
                                  nuevaPrescripcion.fechaFinMedicacion || ""
                                }
                                onChange={(e) =>
                                  setNuevaPrescripcion({
                                    ...nuevaPrescripcion,
                                    fechaFinMedicacion: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="col-span-2 space-y-2">
                              <Label htmlFor="instrucciones">
                                Instrucciones Adicionales
                              </Label>
                              <Textarea
                                placeholder="Instrucciones especiales para la administración"
                                value={
                                  nuevaPrescripcion.instruccionesAdicionales ||
                                  ""
                                }
                                onChange={(e) =>
                                  setNuevaPrescripcion({
                                    ...nuevaPrescripcion,
                                    instruccionesAdicionales: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowNuevaPrescripcion(false);
                                setTratamientoSeleccionado("");
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button onClick={crearPrescripcion}>
                              Agregar Prescripción
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>

                  {/* Lista de prescripciones */}
                  <div className="space-y-2">
                    {prescripciones
                      .filter(
                        (p) => p.idTratamiento === tratamiento.idTratamiento
                      )
                      .map((prescripcion) => {
                        const medicamento = obtenerMedicamento(
                          prescripcion.idMedicamento
                        );
                        return (
                          <div
                            key={prescripcion.idPrescripcion}
                            className="border rounded-lg p-3 bg-gray-50"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium">
                                    {medicamento?.nombreComercial}
                                  </span>
                                  <Badge
                                    variant={getEstadoBadgeVariant(
                                      prescripcion.estadoPrescripcion
                                    )}
                                  >
                                    {prescripcion.estadoPrescripcion}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
                                  <div>
                                    <span className="font-medium">Dosis:</span>{" "}
                                    {prescripcion.dosis}{" "}
                                    {prescripcion.unidadDosis}
                                  </div>
                                  <div>
                                    <span className="font-medium">Freq:</span>{" "}
                                    {prescripcion.frecuenciaAdministracion}
                                  </div>
                                  <div>
                                    <span className="font-medium">Vía:</span>{" "}
                                    {prescripcion.viaAdministracion}
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Período:
                                    </span>{" "}
                                    {new Date(
                                      prescripcion.fechaInicioMedicacion
                                    ).toLocaleDateString()}{" "}
                                    -{" "}
                                    {new Date(
                                      prescripcion.fechaFinMedicacion
                                    ).toLocaleDateString()}
                                  </div>
                                </div>
                                {prescripcion.instruccionesAdicionales && (
                                  <div className="text-xs text-gray-600 mt-1">
                                    <span className="font-medium">
                                      Instrucciones:
                                    </span>{" "}
                                    {prescripcion.instruccionesAdicionales}
                                  </div>
                                )}
                                {prescripcion.motivoSuspension && (
                                  <div className="text-xs text-red-600 mt-1">
                                    <span className="font-medium">
                                      Motivo suspensión:
                                    </span>{" "}
                                    {prescripcion.motivoSuspension}
                                  </div>
                                )}
                              </div>
                              {prescripcion.estadoPrescripcion === "Activa" &&
                                tratamiento.estadoTratamiento === "Activo" && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        <Pause className="h-3 w-3" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Suspender Prescripción
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Indique el motivo de la suspensión de
                                          la prescripción de{" "}
                                          {medicamento?.nombreComercial}
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <Textarea
                                        placeholder="Motivo de la suspensión..."
                                        value={motivoSuspension}
                                        onChange={(e) =>
                                          setMotivoSuspension(e.target.value)
                                        }
                                      />
                                      <AlertDialogFooter>
                                        <AlertDialogCancel
                                          onClick={() =>
                                            setMotivoSuspension("")
                                          }
                                        >
                                          Cancelar
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => {
                                            suspenderPrescripcion(
                                              prescripcion.idPrescripcion,
                                              motivoSuspension
                                            );
                                            setMotivoSuspension("");
                                          }}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Suspender
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                            </div>
                          </div>
                        );
                      })}
                    {prescripciones.filter(
                      (p) => p.idTratamiento === tratamiento.idTratamiento
                    ).length === 0 && (
                      <div className="text-center text-gray-500 py-4">
                        No hay prescripciones registradas para este tratamiento
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Resumen de estadísticas */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Tratamientos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {
                  tratamientos.filter((t) => t.estadoTratamiento === "Activo")
                    .length
                }
              </div>
              <div className="text-sm text-gray-600">Activos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {
                  tratamientos.filter(
                    (t) => t.estadoTratamiento === "Completado"
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Completados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {
                  tratamientos.filter(
                    (t) => t.estadoTratamiento === "Suspendido"
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Suspendidos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {
                  prescripciones.filter(
                    (p) => p.estadoPrescripcion === "Activa"
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">
                Prescripciones Activas
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
