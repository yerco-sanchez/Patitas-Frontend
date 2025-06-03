import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Modelo de datos
export interface Client {
  idCliente: number | undefined;
  nombres: string;
  apPaterno: string;
  apMaterno: string | null;
  ci: string;
  telefono: string;
  correo: string;
  direccion: string;
  tipoCliente: "Doméstico" | "Granja";
  observaciones: string | null;
  estadoCliente: "Activo" | "Inactivo";
  animales?: string[];
  interacciones?: string[];
}

// Datos quemados
const initialClients: Client[] = [
  {
    idCliente: 1,
    nombres: "Juan Carlos",
    apPaterno: "Gómez",
    apMaterno: "Pérez",
    ci: "1234567LP",
    telefono: "+59171234567",
    correo: "juan.gomez@example.com",
    direccion: "Av. La Paz #1234",
    tipoCliente: "Doméstico",
    observaciones: "Cliente frecuente",
    estadoCliente: "Activo",
    animales: ["Firulais"],
    interacciones: ["Consulta vacunación"],
  },
  {
    idCliente: 2,
    nombres: "María",
    apPaterno: "Lopez",
    apMaterno: "Ramírez",
    ci: "7654321LP",
    telefono: "+59179876543",
    correo: "maria.lopez@example.com",
    direccion: "Zona Sur",
    tipoCliente: "Granja",
    observaciones: "",
    estadoCliente: "Inactivo",
    animales: ["Bella", "Luna"],
    interacciones: ["Revisión general"],
  },
];

// Validación de formulario
const clientSchema = z.object({
  nombres: z.string().min(1, "Requerido"),
  apPaterno: z.string().min(1, "Requerido"),
  apMaterno: z.string().nullable(),
  ci: z.string().min(1, "Requerido"),
  telefono: z.string().min(1, "Requerido"),
  correo: z.string().email("Correo inválido"),
  direccion: z.string().min(1, "Requerido"),
  tipoCliente: z.enum(["Doméstico", "Granja"]),
  observaciones: z.string().nullable(),
  estadoCliente: z.enum(["Activo", "Inactivo"]),
});

type FormValues = z.infer<typeof clientSchema>;

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState<string | undefined>();
  const [filterEstado, setFilterEstado] = useState<string | undefined>();

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const matchesSearch = [
        c.nombres,
        c.apPaterno,
        c.apMaterno,
        c.ci,
        c.telefono,
        c.correo,
      ].some(
        (field) => field && field.toLowerCase().includes(search.toLowerCase())
      );
      const matchesTipo = filterTipo ? c.tipoCliente === filterTipo : true;
      const matchesEstado = filterEstado
        ? c.estadoCliente === filterEstado
        : true;
      return matchesSearch && matchesTipo && matchesEstado;
    });
  }, [clients, search, filterTipo, filterEstado]);

  const onSave = (data: FormValues, id?: number) => {
    // Validar unicidad de CI y correo
    const exists = clients.some(
      (c) =>
        (c.ci === data.ci || c.correo === data.correo) && c.idCliente !== id
    );
    if (exists) {
      toast.error("CI o correo ya registrado");
      return;
    }
    if (id) {
      setClients(
        clients.map((c) => (c.idCliente === id ? { ...c, ...data } : c))
      );
      toast.success("Cliente actualizado correctamente");
    } else {
      const newClient: Client = { idCliente: Date.now(), ...data } as Client;
      setClients([...clients, newClient]);
      toast.success("Cliente creado correctamente");
    }
  };

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Input
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select onValueChange={setFilterTipo}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Doméstico">Doméstico</SelectItem>
                <SelectItem value="Granja">Granja</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setFilterEstado}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Nuevo Cliente</Button>
              </DialogTrigger>
              <ClientForm onSave={onSave} />
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombres</TableHead>
                <TableHead>CI</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.idCliente}>
                  <TableCell>{c.idCliente}</TableCell>
                  <TableCell>{`${c.nombres} ${c.apPaterno}`}</TableCell>
                  <TableCell>{c.ci}</TableCell>
                  <TableCell>{c.telefono}</TableCell>
                  <TableCell>{c.correo}</TableCell>
                  <TableCell>{c.tipoCliente}</TableCell>
                  <TableCell>{c.estadoCliente}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm">Ver</Button>
                      </DialogTrigger>
                      <ClientDetail client={c} />
                    </Dialog>{" "}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm">Editar</Button>
                      </DialogTrigger>
                      <ClientForm client={c} onSave={onSave} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Formulario de Cliente
function ClientForm({
  client,
  onSave,
}: {
  client?: Client;
  onSave: (data: FormValues, id?: number) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: client || {
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
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSave(values, client?.idCliente);
    form.reset();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{client ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Repetir FormItem para cada campo... ejemplo: */}
          <FormField
            control={form.control}
            name="nombres"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* ...otros campos (apPaterno, apMaterno, ci, telefono, correo, direccion, tipoCliente, observaciones, estadoCliente) */}
          <Button type="submit">Guardar</Button>
        </form>
      </Form>
    </DialogContent>
  );
}

// Detalle de Cliente
function ClientDetail({ client }: { client: Client }) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Detalle Cliente</DialogTitle>
      </DialogHeader>
      <div className="space-y-2">
        <p>
          <strong>Nombre:</strong>{" "}
          {`${client.nombres} ${client.apPaterno} ${client.apMaterno}`}
        </p>
        <p>
          <strong>CI:</strong> {client.ci}
        </p>
        <p>
          <strong>Teléfono:</strong> {client.telefono}
        </p>
        <p>
          <strong>Correo:</strong> {client.correo}
        </p>
        <p>
          <strong>Tipo:</strong> {client.tipoCliente}
        </p>
        <p>
          <strong>Estado:</strong> {client.estadoCliente}
        </p>
        <p>
          <strong>Animales:</strong> {client.animales?.join(", ")}
        </p>
        <p>
          <strong>Interacciones:</strong> {client.interacciones?.join(", ")}
        </p>
        <p>
          <strong>Observaciones:</strong> {client.observaciones}
        </p>
      </div>
    </DialogContent>
  );
}
