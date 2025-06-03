// components/organisms/ClienteForm.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type {
  ClienteFormData,
  FormErrors,
  TipoCliente,
  EstadoCliente,
} from "../../../types/models";

interface FormularioClienteProps {
  formData: ClienteFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClienteFormData>>;
  formErrors: FormErrors;
  onSubmit: () => void;
  onCancel: () => void;
  submitText: string;
  loading?: boolean;
  disabled?: boolean;
}

const TIPOS_CLIENTE: TipoCliente[] = ["Doméstico", "Granja"];
const ESTADOS_CLIENTE: EstadoCliente[] = [
  "Activo",
  "Inactivo",
  "Moroso",
  "En Deuda",
  "VIP",
];

export const FormularioCliente: React.FC<FormularioClienteProps> = ({
  formData,
  setFormData,
  formErrors,
  onSubmit,
  onCancel,
  submitText,
  loading = false,
  disabled = false,
}) => {
  const handleInputChange = (field: keyof ClienteFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectChange = (
    field: keyof ClienteFormData,
    value: TipoCliente | EstadoCliente
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled && !loading) {
      onSubmit();
    }
  };

  const isFormDisabled = disabled || loading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombres */}
        <div className="space-y-2">
          <Label htmlFor="nombres">
            Nombres <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nombres"
            type="text"
            placeholder="Ingrese los nombres"
            value={formData.nombres}
            onChange={(e) => handleInputChange("nombres", e.target.value)}
            disabled={isFormDisabled}
            className={formErrors.nombres ? "border-red-500" : ""}
          />
          {formErrors.nombres && (
            <p className="text-sm text-red-500">{formErrors.nombres}</p>
          )}
        </div>

        {/* Apellido Paterno */}
        <div className="space-y-2">
          <Label htmlFor="apPaterno">
            Apellido Paterno <span className="text-red-500">*</span>
          </Label>
          <Input
            id="apPaterno"
            type="text"
            placeholder="Ingrese el apellido paterno"
            value={formData.apPaterno}
            onChange={(e) => handleInputChange("apPaterno", e.target.value)}
            disabled={isFormDisabled}
            className={formErrors.apPaterno ? "border-red-500" : ""}
          />
          {formErrors.apPaterno && (
            <p className="text-sm text-red-500">{formErrors.apPaterno}</p>
          )}
        </div>

        {/* Apellido Materno */}
        <div className="space-y-2">
          <Label htmlFor="apMaterno">Apellido Materno</Label>
          <Input
            id="apMaterno"
            type="text"
            placeholder="Ingrese el apellido materno"
            value={formData.apMaterno || ""}
            onChange={(e) => handleInputChange("apMaterno", e.target.value)}
            disabled={isFormDisabled}
            className={formErrors.apMaterno ? "border-red-500" : ""}
          />
          {formErrors.apMaterno && (
            <p className="text-sm text-red-500">{formErrors.apMaterno}</p>
          )}
        </div>

        {/* CI */}
        <div className="space-y-2">
          <Label htmlFor="ci">
            Cédula de Identidad <span className="text-red-500">*</span>
          </Label>
          <Input
            id="ci"
            type="text"
            placeholder="Ingrese la cédula de identidad"
            value={formData.ci}
            onChange={(e) => handleInputChange("ci", e.target.value)}
            disabled={isFormDisabled}
            className={formErrors.ci ? "border-red-500" : ""}
          />
          {formErrors.ci && (
            <p className="text-sm text-red-500">{formErrors.ci}</p>
          )}
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <Label htmlFor="telefono">
            Teléfono <span className="text-red-500">*</span>
          </Label>
          <Input
            id="telefono"
            type="tel"
            placeholder="Ingrese el teléfono"
            value={formData.telefono}
            onChange={(e) => handleInputChange("telefono", e.target.value)}
            disabled={isFormDisabled}
            className={formErrors.telefono ? "border-red-500" : ""}
          />
          {formErrors.telefono && (
            <p className="text-sm text-red-500">{formErrors.telefono}</p>
          )}
        </div>

        {/* Correo */}
        <div className="space-y-2">
          <Label htmlFor="correo">
            Correo Electrónico <span className="text-red-500">*</span>
          </Label>
          <Input
            id="correo"
            type="email"
            placeholder="ejemplo@correo.com"
            value={formData.correo}
            onChange={(e) => handleInputChange("correo", e.target.value)}
            disabled={isFormDisabled}
            className={formErrors.correo ? "border-red-500" : ""}
          />
          {formErrors.correo && (
            <p className="text-sm text-red-500">{formErrors.correo}</p>
          )}
        </div>
      </div>

      {/* Dirección */}
      <div className="space-y-2">
        <Label htmlFor="direccion">
          Dirección <span className="text-red-500">*</span>
        </Label>
        <Input
          id="direccion"
          type="text"
          placeholder="Ingrese la dirección completa"
          value={formData.direccion}
          onChange={(e) => handleInputChange("direccion", e.target.value)}
          disabled={isFormDisabled}
          className={formErrors.direccion ? "border-red-500" : ""}
        />
        {formErrors.direccion && (
          <p className="text-sm text-red-500">{formErrors.direccion}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tipo de Cliente */}
        <div className="space-y-2">
          <Label htmlFor="tipoCliente">
            Tipo de Cliente <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.tipoCliente}
            onValueChange={(value: TipoCliente) =>
              handleSelectChange("tipoCliente", value)
            }
            disabled={isFormDisabled}
          >
            <SelectTrigger
              className={formErrors.tipoCliente ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_CLIENTE.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.tipoCliente && (
            <p className="text-sm text-red-500">{formErrors.tipoCliente}</p>
          )}
        </div>

        {/* Estado Cliente */}
        <div className="space-y-2">
          <Label htmlFor="estadoCliente">
            Estado del Cliente <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.estadoCliente}
            onValueChange={(value: EstadoCliente) =>
              handleSelectChange("estadoCliente", value)
            }
            disabled={isFormDisabled}
          >
            <SelectTrigger
              className={formErrors.estadoCliente ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              {ESTADOS_CLIENTE.map((estado) => (
                <SelectItem key={estado} value={estado}>
                  {estado}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.estadoCliente && (
            <p className="text-sm text-red-500">{formErrors.estadoCliente}</p>
          )}
        </div>
      </div>

      {/* Observaciones */}
      <div className="space-y-2">
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea
          id="observaciones"
          placeholder="Ingrese observaciones adicionales"
          value={formData.observaciones}
          onChange={(e) => handleInputChange("observaciones", e.target.value)}
          disabled={isFormDisabled}
          rows={3}
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isFormDisabled}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isFormDisabled}
          className="min-w-[120px]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            submitText
          )}
        </Button>
      </div>
    </form>
  );
};
