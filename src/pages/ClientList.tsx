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
import { Textarea } from "@/components/ui/textarea";
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

// Definición del tipo Cliente
export interface Cliente {
  idCliente: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
  ciCliente: string;
  telefono: string;
  correo: string;
  direccion: string;
  tipoCliente: "Doméstico" | "Granja";
  observaciones: string;
  estadoCliente: "Activo" | "Inactivo";
}

const defaultCliente: Omit<Cliente, "idCliente"> & { idCliente: number } = {
  idCliente: 0,
  nombres: "",
  apellidoPat: "",
  apellidoMat: "",
  ciCliente: "",
  telefono: "",
  correo: "",
  direccion: "",
  tipoCliente: "Doméstico",
  observaciones: "",
  estadoCliente: "Activo",
};

export const ClienteCRUD: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

  const form = useForm<Cliente>({
    defaultValues: defaultCliente as Cliente,
  });

  // Obtiene lista de clientes (mock hasta integrar API)
  useEffect(() => {
    const fetchClientes = async (): Promise<void> => {
      const datosPrueba: Cliente[] = [
        {
          idCliente: 1,
          nombres: "Juan",
          apellidoPat: "Pérez",
          apellidoMat: "García",
          ciCliente: "1234567",
          telefono: "78945612",
          correo: "juan.perez@example.com",
          direccion: "Av. Siempre Viva 123",
          tipoCliente: "Doméstico",
          observaciones: "Cliente frecuente",
          estadoCliente: "Activo",
        },
        {
          idCliente: 2,
          nombres: "María",
          apellidoPat: "Lopez",
          apellidoMat: "Rodríguez",
          ciCliente: "9876543",
          telefono: "76451230",
          correo: "maria.lopez@example.com",
          direccion: "Calle Falsa 456",
          tipoCliente: "Granja",
          observaciones: "Solicita factura",
          estadoCliente: "Inactivo",
        },
        {
          idCliente: 3,
          nombres: "Carlos",
          apellidoPat: "Ramírez",
          apellidoMat: "Torrez",
          ciCliente: "4567890",
          telefono: "71234567",
          correo: "carlos.ramirez@example.com",
          direccion: "Zona Sur, Manzano 8",
          tipoCliente: "Doméstico",
          observaciones: "Cliente nuevo",
          estadoCliente: "Activo",
        },
      ];

      setClientes(datosPrueba);
    };

    fetchClientes();
  }, []);

  const onSubmit: SubmitHandler<Cliente> = (data) => {
    if (editingCliente) {
      setClientes((prev) =>
        prev.map((c) => (c.idCliente === data.idCliente ? data : c))
      );
    } else {
      const nuevo: Cliente = { ...data, idCliente: Date.now() };
      setClientes((prev) => [...prev, nuevo]);
    }
    form.reset(defaultCliente as Cliente);
    setEditingCliente(null);
    setDialogOpen(false);
  };

  const openCreateDialog = (): void => {
    form.reset(defaultCliente as Cliente);
    setEditingCliente(null);
    setDialogOpen(true);
  };

  const openEditDialog = (cliente: Cliente): void => {
    setEditingCliente(cliente);
    form.reset(cliente);
    setDialogOpen(true);
  };

  const deleteCliente = (id: number): void => {
    // TODO: llamada DELETE API
    setClientes((prev) => prev.filter((c) => c.idCliente !== id));
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Clientes</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              placeholder="Buscar por nombre o CI..."
              className="col-span-1 md:col-span-2"
            />
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Doméstico">Doméstico</SelectItem>
                <SelectItem value="Granja">Granja</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
            <Button className="mb-4 w-25 ">Buscar</Button>
          </div>

          <Button onClick={openCreateDialog} className="mb-4">
            Nuevo Cliente
          </Button>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>CI</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[180px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.map((c) => (
                <TableRow key={c.idCliente}>
                  <TableCell>{c.idCliente}</TableCell>
                  <TableCell>{`${c.nombres} ${c.apellidoPat} ${c.apellidoMat}`}</TableCell>
                  <TableCell>{c.ciCliente}</TableCell>
                  <TableCell>{c.tipoCliente}</TableCell>
                  <TableCell>{c.estadoCliente}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(c)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteCliente(c.idCliente)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-full mx-2 max-w-2xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCliente ? "Editar Cliente" : "Nuevo Cliente"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              {/* Nombres */}
              <FormField
                control={form.control}
                name="nombres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombres</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombres" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Apellidos */}
              <FormField
                control={form.control}
                name="apellidoPat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido Paterno</FormLabel>
                    <FormControl>
                      <Input placeholder="Apellido Paterno" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="apellidoMat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido Materno</FormLabel>
                    <FormControl>
                      <Input placeholder="Apellido Materno" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CI, Teléfono y Correo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="ciCliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cédula</FormLabel>
                      <FormControl>
                        <Input placeholder="Cédula" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="Teléfono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="correo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo</FormLabel>
                      <FormControl>
                        <Input placeholder="Correo Electrónico" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Dirección */}
              <FormField
                control={form.control}
                name="direccion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Dirección de residencia"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo y Estado */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tipoCliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Cliente</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona tipo" />
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
                <FormField
                  control={form.control}
                  name="estadoCliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Activo">Activo</SelectItem>
                            <SelectItem value="Inactivo">Inactivo</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Observaciones */}
              <FormField
                control={form.control}
                name="observaciones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Notas adicionales" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
