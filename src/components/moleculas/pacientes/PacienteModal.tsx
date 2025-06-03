// components/molecules/PatientFormModal.tsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import type { Patient, PatientFormData } from "@/types/pacientes";
import {
  SPECIES_OPTIONS,
  GENDER_OPTIONS,
  CLASSIFICATION_OPTIONS,
} from "@/types/pacientes";
import { toast } from "sonner";

const patientSchema = z.object({
  animalName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  species: z.string().min(1, "La especie es obligatoria"),
  breed: z.string().min(1, "La raza es obligatoria"),
  gender: z.enum(["Male", "Female"] as const, {
    required_error: "El sexo es obligatorio",
  }),
  birthDate: z.string().min(1, "La fecha de nacimiento es obligatoria"),
  weight: z
    .number()
    .min(0.1, "El peso debe ser mayor a 0")
    .max(1000, "El peso no puede exceder 1000 kg"),
  classification: z.enum(["Domestic", "Farm"] as const, {
    required_error: "La clasificación es obligatoria",
  }),
  photoUrl: z.string().optional(),
});

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PatientFormData) => void;
  editingPatient?: Patient | null;
  existingPatients: Patient[];
}

export const PatientFormModal: React.FC<PatientFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingPatient,
  existingPatients,
}) => {
  const [imagePreview, setImagePreview] = useState("");

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      animalName: "",
      species: "",
      breed: "",
      gender: undefined,
      birthDate: "",
      weight: 0,
      classification: undefined,
      photoUrl: "",
    },
  });

  // Validar unicidad del nombre por cliente
  const validateUniqueName = (name: string, currentId?: number) => {
    return !existingPatients.some(
      (p) =>
        p.animalName.toLowerCase() === name.toLowerCase() &&
        p.patientId !== currentId
    );
  };

  // Reset form when modal opens/closes or editing patient changes
  useEffect(() => {
    if (isOpen) {
      if (editingPatient) {
        setImagePreview(editingPatient.photoUrl);
        form.reset({
          animalName: editingPatient.animalName,
          species: editingPatient.species,
          breed: editingPatient.breed,
          gender: editingPatient.gender,
          birthDate: editingPatient.birthDate.split("T")[0], // Format for date input
          weight: editingPatient.weight,
          classification: editingPatient.classification,
          photoUrl: editingPatient.photoUrl,
        });
      } else {
        form.reset();
        setImagePreview("");
      }
    }
  }, [isOpen, editingPatient, form]);

  const handleSubmit = (data: PatientFormData) => {
    // Validar unicidad del nombre
    if (!validateUniqueName(data.animalName, editingPatient?.patientId)) {
      toast.error("Ya existe un animal con ese nombre para este cliente", {
        description: "Por favor, elige un nombre diferente",
      });
      return;
    }

    const finalData = {
      ...data,
      photoUrl: imagePreview || data.photoUrl,
    };

    onSubmit(finalData);
    handleClose();
  };

  const handleClose = () => {
    form.reset();
    setImagePreview("");
    onClose();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Imagen demasiado grande", {
          description: "La imagen debe ser menor a 5MB",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        form.setValue("photoUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingPatient ? "Editar Paciente" : "Registrar Nuevo Paciente"}
          </DialogTitle>
          <DialogDescription>
            {editingPatient
              ? "Modifica los datos del paciente seleccionado"
              : "Completa la información del nuevo paciente animal"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
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
                <Label htmlFor="photo-upload" className="cursor-pointer">
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
                name="animalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Animal *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Rocky, Mimi..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Especie */}
              <FormField
                control={form.control}
                name="species"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especie *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar especie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SPECIES_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Raza */}
              <FormField
                control={form.control}
                name="breed"
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
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexo *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar sexo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {GENDER_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fecha de nacimiento */}
              <FormField
                control={form.control}
                name="birthDate"
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
                name="weight"
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
                          field.onChange(parseFloat(e.target.value) || 0)
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
                name="classification"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Clasificación *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar clasificación" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CLASSIFICATION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
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
  );
};
