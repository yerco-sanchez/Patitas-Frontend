// components/moleculas/medicamentos/MedicamentoForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit } from 'lucide-react';
import type { Medicamento, MedicamentoFormData } from '../../../types/medicamento';

// Schema de validación con Zod
const medicamentoSchema = z.object({
  commercialName: z
    .string()
    .min(2, 'El nombre comercial debe tener al menos 2 caracteres')
    .max(100, 'El nombre comercial no puede exceder 100 caracteres')
    .trim(),
  activeIngredient: z
    .string()
    .min(2, 'El principio activo debe tener al menos 2 caracteres')
    .max(100, 'El principio activo no puede exceder 100 caracteres')
    .trim(),
  presentation: z
    .string()
    .min(1, 'Debe seleccionar una presentación'),
  laboratory: z
    .string()
    .min(1, 'Debe seleccionar un laboratorio'),
});

type FormData = z.infer<typeof medicamentoSchema>;

interface MedicamentoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicamento?: Medicamento | null;
  onSubmit: (data: MedicamentoFormData) => Promise<void>;
  mode: 'create' | 'edit';
  loading?: boolean;
  presentationOptions?: string[];
  laboratoryOptions?: string[];
}

// Opciones predefinidas comunes
const COMMON_PRESENTATIONS = [
  'Tableta',
  'Cápsula',
  'Jarabe',
  'Suspensión',
  'Inyección',
  'Crema',
  'Ungüento',
  'Gotas',
  'Spray',
  'Parche',
  'Supositorio',
  'Óvulo'
];

const COMMON_LABORATORIES = [
  'GSK',
  'Pfizer',
  'Novartis',
  'Roche',
  'Sanofi',
  'Merck',
  'AbbVie',
  'Johnson & Johnson',
  'Bristol Myers Squibb',
  'AstraZeneca',
  'Bayer',
  'Eli Lilly'
];

export const MedicamentoForm: React.FC<MedicamentoFormProps> = ({
  open,
  onOpenChange,
  medicamento,
  onSubmit,
  mode,
  loading = false,
  presentationOptions = [],
  laboratoryOptions = [],
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Combinamos las opciones predefinidas con las dinámicas
  const allPresentations = [...new Set([...COMMON_PRESENTATIONS, ...presentationOptions])].sort();
  const allLaboratories = [...new Set([...COMMON_LABORATORIES, ...laboratoryOptions])].sort();

  const form = useForm<FormData>({
    resolver: zodResolver(medicamentoSchema),
    defaultValues: {
      commercialName: '',
      activeIngredient: '',
      presentation: '',
      laboratory: '',
    },
  });

  // Resetear formulario cuando cambia el medicamento o el modo
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && medicamento) {
        form.reset({
          commercialName: medicamento.commercialName,
          activeIngredient: medicamento.activeIngredient,
          presentation: medicamento.presentation,
          laboratory: medicamento.laboratory,
        });
      } else {
        form.reset({
          commercialName: '',
          activeIngredient: '',
          presentation: '',
          laboratory: '',
        });
      }
    }
  }, [open, mode, medicamento, form]);

  const handleSubmit = async (data: FormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      onOpenChange(false);
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'create' ? (
              <>
                <Plus className="h-5 w-5" />
                Agregar Medicamento
              </>
            ) : (
              <>
                <Edit className="h-5 w-5" />
                Editar Medicamento
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Complete los datos del nuevo medicamento.'
              : 'Modifique los datos del medicamento seleccionado.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Nombre Comercial */}
            <FormField
              control={form.control}
              name="commercialName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Comercial *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Panadol"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Nombre comercial del medicamento
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Principio Activo */}
            <FormField
              control={form.control}
              name="activeIngredient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Principio Activo *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Paracetamol"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Componente activo del medicamento
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Presentación */}
            <FormField
              control={form.control}
              name="presentation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presentación *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una presentación" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allPresentations.map((presentation) => (
                        <SelectItem key={presentation} value={presentation}>
                          {presentation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Forma farmacéutica del medicamento
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Laboratorio */}
            <FormField
              control={form.control}
              name="laboratory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Laboratorio *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un laboratorio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allLaboratories.map((laboratory) => (
                        <SelectItem key={laboratory} value={laboratory}>
                          {laboratory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Laboratorio fabricante del medicamento
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[100px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'create' ? 'Creando...' : 'Guardando...'}
                  </>
                ) : (
                  <>
                    {mode === 'create' ? 'Crear Medicamento' : 'Guardar Cambios'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};