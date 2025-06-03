// components/molecules/ClienteCard.tsx
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Eye, Edit, Trash2 } from "lucide-react";
import type { Cliente } from "../../../types/models";

interface ClienteCardProps {
  cliente: Cliente;
  onViewDetails: (cliente: Cliente) => void;
  onEdit: (cliente: Cliente) => void;
  onDelete?: (cliente: Cliente) => void;
}

export const ClienteCard: React.FC<ClienteCardProps> = ({
  cliente,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">
              {cliente.nombres} {cliente.apPaterno} {cliente.apMaterno}
            </h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                CI: {cliente.ci} | Tel: {cliente.telefono}
              </p>
              <p>Email: {cliente.correo}</p>
              <p>Dirección: {cliente.direccion}</p>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge
                variant={
                  cliente.tipoCliente === "Doméstico" ? "default" : "secondary"
                }
              >
                {cliente.tipoCliente}
              </Badge>
              <Badge
                variant={
                  cliente.estadoCliente === "Activo" ? "default" : "destructive"
                }
              >
                {cliente.estadoCliente}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(cliente)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Ver Detalles
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(cliente)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(cliente)}
              className="flex items-center gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
