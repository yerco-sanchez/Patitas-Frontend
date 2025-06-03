import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Pill } from "lucide-react";
import type { Medicamento } from '../../../types/medicamento';

interface MedicamentoCardProps {
  medicamento: Medicamento;
  onEdit?: (medicamento: Medicamento) => void;
  onDelete?: (id: number) => void;
}

export const MedicamentoCard: React.FC<MedicamentoCardProps> = ({
  medicamento,
  onEdit,
  onDelete,
}) => {
  const getPresentationColor = (presentation: string): string => {
    const colors: Record<string, string> = {
      "Tableta": "bg-blue-100 text-blue-800 hover:bg-blue-200",
      "Cápsula": "bg-green-100 text-green-800 hover:bg-green-200",
      "Jarabe": "bg-purple-100 text-purple-800 hover:bg-purple-200",
      "Ampolla": "bg-red-100 text-red-800 hover:bg-red-200",
      "Crema": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      "Gotas": "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
      "Suspensión": "bg-orange-100 text-orange-800 hover:bg-orange-200",
      "Supositorio": "bg-pink-100 text-pink-800 hover:bg-pink-200",
    };
    return colors[presentation] || "bg-gray-100 text-gray-800 hover:bg-gray-200";
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg text-foreground">
              {medicamento.commercialName}
            </h3>
          </div>
          <div className="flex gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(medicamento)}
                className="h-8 w-8 p-0 hover:bg-blue-100"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(medicamento.id)}
                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">Principio Activo</p>
          <p className="font-medium">{medicamento.activeIngredient}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Presentación</p>
            <Badge className={getPresentationColor(medicamento.presentation)}>
              {medicamento.presentation}
            </Badge>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Laboratorio</p>
          <p className="font-medium text-sm">{medicamento.laboratory}</p>
        </div>
      </CardContent>
    </Card>
  );
};