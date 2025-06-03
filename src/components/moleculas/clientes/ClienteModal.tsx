// components/organisms/ClienteModal.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  Cliente,
  ClienteFormData,
  FormErrors,
} from "../../../types/models";
import { FormularioCliente } from "./ClienteForm";

interface ClienteModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cliente?: Cliente | null;
  onSave: (cliente: ClienteFormData) => void;
}

export const ClienteModal: React.FC<ClienteModalProps> = ({
  isOpen,
  onOpenChange,
  cliente = null,
  onSave,
}) => {
  const isEdit = !!cliente;

  const [formData, setFormData] = useState<ClienteFormData>({
    nombres: "",
    apPaterno: "",
    apMaterno: "",
    ci: "",
    telefono: "",
    correo: "",
    direccion: "",
    tipoCliente: "Doméstico",
    estadoCliente: "Activo",
    observaciones: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.nombres.trim()) errors.nombres = "Los nombres son requeridos";
    if (!formData.apPaterno.trim())
      errors.apPaterno = "El apellido paterno es requerido";
    if (!formData.ci.trim()) errors.ci = "La cédula de identidad es requerida";
    if (!formData.telefono.trim()) errors.telefono = "El teléfono es requerido";
    if (!formData.correo.trim()) errors.correo = "El correo es requerido";
    if (!formData.direccion.trim())
      errors.direccion = "La dirección es requerida";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.correo && !emailRegex.test(formData.correo)) {
      errors.correo = "El formato del correo no es válido";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      onOpenChange(false);
      resetForm();
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetForm();
  };

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
      estadoCliente: "Activo",
      observaciones: "",
    });
    setFormErrors({});
  };

  useEffect(() => {
    if (cliente) {
      setFormData({
        nombres: cliente.nombres,
        apPaterno: cliente.apPaterno,
        apMaterno: cliente.apMaterno,
        ci: cliente.ci,
        telefono: cliente.telefono,
        correo: cliente.correo,
        direccion: cliente.direccion,
        tipoCliente: cliente.tipoCliente,
        estadoCliente: cliente.estadoCliente,
        observaciones: cliente.observaciones,
      });
    } else {
      resetForm();
    }
  }, [cliente]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Cliente" : "Crear Nuevo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifica la información del cliente"
              : "Completa todos los campos para registrar un nuevo cliente"}
          </DialogDescription>
        </DialogHeader>
        <FormularioCliente
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitText={isEdit ? "Actualizar Cliente" : "Crear Cliente"}
        />
      </DialogContent>
    </Dialog>
  );
};
