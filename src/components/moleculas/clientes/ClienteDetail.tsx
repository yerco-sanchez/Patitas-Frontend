// components/organisms/ClienteDetalles.tsx
import React from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import type { Cliente, Animal } from "../../../types/models";
import { useNavigate } from "react-router-dom";
import { useSessionStore } from "../../../store/useSesionStore";

interface ClienteDetallesProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: Cliente | null;
  animales?: Animal[];
  onEdit?: (cliente: Cliente) => void;
}

export const ClienteDetalles: React.FC<ClienteDetallesProps> = ({
  isOpen,
  onOpenChange,
  cliente,
  animales = [],
  onEdit,
}) => {
  const clienteAnimales = cliente
    ? animales.filter((animal) => animal.clienteId === cliente.idCliente)
    : [];

  const navigate = useNavigate();
  const setCustomerId = useSessionStore((s) => s.setCustomerId);
  const setPatientId = useSessionStore((s) => s.setPatientId);

  const handlePatientClick = (patientId: number) => {
    cliente && setCustomerId(cliente.idCliente);
    setPatientId(patientId);
    navigate("/clientes");
  };

  const handleCustomerClick = () => {
    cliente && setCustomerId(cliente.idCliente);
    navigate("/historial");
  };

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
                      <Card
                        onClick={() => handlePatientClick(animal.id)}
                        key={animal.id}
                        className="p-4"
                      >
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
