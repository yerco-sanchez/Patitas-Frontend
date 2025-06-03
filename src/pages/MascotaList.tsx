import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

// Definición de tipos
export interface Cliente {
  idCliente: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
}

export interface Usuario {
  idUsuario: number;
  username: string;
}

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
  idRegistradoPor: number;
}

// Valores por defecto omitiendo idPaciente
const defaultPaciente: Omit<Paciente, "idPaciente"> & { idPaciente?: number } =
  {
    nombreAnimal: "",
    especie: "",
    raza: "",
    sexo: "Macho",
    fechaNacimiento: new Date().toISOString().slice(0, 10),
    peso: 0,
    clasificacion: "Doméstico",
    fotografia: "",
    fechaRegistro: new Date().toISOString(),
    idCliente: 0,
    idRegistradoPor: 0,
  };

export const PacienteCRUD: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Paciente | null>(null);

  const form = useForm<Paciente>({
    defaultValues: defaultPaciente as Paciente,
  });

  useEffect(() => {
    async function load() {
      // Mock de datos
      setClientes([
        {
          idCliente: 1,
          nombres: "Ana",
          apellidoPat: "García",
          apellidoMat: "Lopez",
        },
        {
          idCliente: 2,
          nombres: "Luis",
          apellidoPat: "Fernández",
          apellidoMat: "Martínez",
        },
      ]);

      setUsuarios([
        { idUsuario: 1, username: "vet_admin" },
        { idUsuario: 2, username: "assistant1" },
      ]);

      setPacientes([
        {
          idPaciente: 1001,
          nombreAnimal: "Firulais",
          especie: "Pero",
          raza: "Pastor Aleman",
          sexo: "Macho",
          fechaNacimiento: "2020-05-10",
          peso: 25,
          clasificacion: "Doméstico",
          fotografia: "",
          fechaRegistro: new Date().toISOString(),
          idCliente: 1,
          idRegistradoPor: 1,
        },
        {
          idPaciente: 1002,
          nombreAnimal: "Luna",
          especie: "Vaca",
          raza: "Holstein",
          sexo: "Hembra",
          fechaNacimiento: "2018-08-22",
          peso: 500,
          clasificacion: "Granja",
          fotografia: "",
          fechaRegistro: new Date().toISOString(),
          idCliente: 2,
          idRegistradoPor: 2,
        },
        {
          idPaciente: 1003,
          nombreAnimal: "Max",
          especie: "Pero",
          raza: "Border Colie",
          sexo: "Macho",
          fechaNacimiento: "2022-01-15",
          peso: 12,
          clasificacion: "Doméstico",
          fotografia: "",
          fechaRegistro: new Date().toISOString(),
          idCliente: 1,
          idRegistradoPor: 2,
        },
      ]);
    }
    load();
  }, []);

  const calculateAge = (birth: string): number => {
    const diff = Date.now() - new Date(birth).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  };

  const onSubmit: SubmitHandler<Paciente> = (data) => {
    if (editing) {
      setPacientes((prev) =>
        prev.map((p) => (p.idPaciente === data.idPaciente ? data : p))
      );
    } else {
      const newPac: Paciente = { ...data, idPaciente: Date.now() };
      setPacientes((prev) => [...prev, newPac]);
    }
    setEditing(null);
    form.reset(defaultPaciente as Paciente);
    setDialogOpen(false);
  };

  const openDialog = (p?: Paciente) => {
    if (p) {
      setEditing(p);
      form.reset(p);
    } else {
      setEditing(null);
      form.reset(defaultPaciente as Paciente);
    }
    setDialogOpen(true);
  };

  const deletePaciente = (id: number) => {
    setPacientes((prev) => prev.filter((p) => p.idPaciente !== id));
  };

  return (
    <div className="p-4 space-y-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Información del Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-x-6 gap-y-4 text-sm">
            {/* Fila 1 */}
            <div className="font-semibold text-muted-foreground col-span-1">
              ID:
            </div>
            <div className="col-span-2">CLT-001</div>

            <div className="font-semibold text-muted-foreground col-span-1">
              Nombre:
            </div>
            <div className="col-span-2">Juan Pérez Gómez</div>

            {/* Fila 2 */}
            <div className="font-semibold text-muted-foreground col-span-1">
              Correo:
            </div>
            <div className="col-span-2">juan.perez@example.com</div>

            <div className="font-semibold text-muted-foreground col-span-1">
              Teléfono:
            </div>
            <div className="col-span-2">+51 987 654 321</div>

            {/* Fila 3 (más datos de ejemplo) */}
            <div className="font-semibold text-muted-foreground col-span-1">
              Dirección:
            </div>
            <div className="col-span-2">Av. Siempre Viva 742</div>

            <div className="font-semibold text-muted-foreground col-span-1">
              Ciudad:
            </div>
            <div className="col-span-2">Lima</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pacientes:</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => openDialog()} className="mb-4">
            Nuevo Paciente
          </Button>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foto</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Especie</TableHead>
                <TableHead>Raza</TableHead>
                <TableHead>Sexo</TableHead>
                <TableHead>Edad</TableHead>
                <TableHead>Peso (kg)</TableHead>
                <TableHead>Clasificación</TableHead>
                <TableHead>Fecha Registro</TableHead>
                <TableHead>Registrado Por</TableHead>
                <TableHead className="w-[180px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pacientes.map((p) => {
                const dueño = clientes.find((c) => c.idCliente === p.idCliente);
                const user = usuarios.find(
                  (u) => u.idUsuario === p.idRegistradoPor
                );
                return (
                  <TableRow key={p.idPaciente}>
                    <TableCell>
                      {p.fotografia ? (
                        <img
                          src={p.fotografia}
                          alt={p.nombreAnimal}
                          className="h-12 w-12 object-cover rounded-full"
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{p.nombreAnimal}</TableCell>
                    <TableCell>{p.especie}</TableCell>
                    <TableCell>{p.raza}</TableCell>
                    <TableCell>{p.sexo}</TableCell>
                    <TableCell>{calculateAge(p.fechaNacimiento)}</TableCell>
                    <TableCell>{p.peso}</TableCell>
                    <TableCell>{p.clasificacion}</TableCell>
                    <TableCell>
                      {new Date(p.fechaRegistro).toLocaleString()}
                    </TableCell>
                    <TableCell>{user ? user.username : "-"}</TableCell>
                    <TableCell className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDialog(p)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deletePaciente(p.idPaciente)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-full mx-2 max-w-3xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar Paciente" : "Nuevo Paciente"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Nombre Animal */}
              <FormField
                control={form.control}
                name="nombreAnimal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Animal</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="especie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fotografía</FormLabel>
                    <FormControl>
                      <div className="w-full flex flex-col items-center">
                        <div
                          className="h-32 w-32 bg-gray-100 rounded-2xl mb-2 flex items-center justify-center cursor-pointer"
                          {...field}
                          onClick={() => {
                            alert("Boton");
                          }}
                        >
                          <span className="text-sm text-gray-400">
                            Sin imagen
                          </span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Especie y Raza */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="especie"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Especie</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Especie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pero">Perro</SelectItem>
                            <SelectItem value="Vaca">Vaca</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="raza"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Raza</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Raza" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pastor Aleman">
                              Pastor Aleman
                            </SelectItem>
                            <SelectItem value="Border Colie">
                              Border Colie
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Sexo y Clasificación */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sexo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexo</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona sexo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Macho">Macho</SelectItem>
                            <SelectItem value="Hembra">Hembra</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clasificacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clasificación</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Doméstico o Granja" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Doméstico">Doméstico</SelectItem>
                            <SelectItem value="Granja">Granja</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Fecha Nacimiento y Peso */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fechaNacimiento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Nacimiento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="peso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peso (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="submit">Guardar</Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
