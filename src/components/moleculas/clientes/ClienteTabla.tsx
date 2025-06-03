// components/organisms/TablaClientes.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Edit, Trash2, User } from "lucide-react";
import type { Cliente } from "../../../types/models";

interface TablaClientesProps {
  clientes: Cliente[];
  onViewDetails: (cliente: Cliente) => void;
  onEdit: (cliente: Cliente) => void;
  onDelete?: (cliente: Cliente) => void;
  loading?: boolean;
}

export const TablaClientes: React.FC<TablaClientesProps> = ({
  clientes,
  onViewDetails,
  onEdit,
  onDelete,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando clientes...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (clientes.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay clientes</h3>
            <p className="text-muted-foreground">
              No se encontraron clientes que coincidan con los criterios de
              búsqueda.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.idCliente}>
                <TableCell>
                  <div>
                    <p className="font-semibold">
                      {cliente.nombres} {cliente.apPaterno} {cliente.apMaterno}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      CI: {cliente.ci}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{cliente.telefono}</p>
                    <p className="text-muted-foreground">{cliente.correo}</p>
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
                        : "destructive"
                    }
                  >
                    {cliente.estadoCliente}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {cliente.fechaRegistro}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(cliente)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(cliente)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(cliente)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
