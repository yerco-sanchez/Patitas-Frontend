// components/molecules/PatientCard.tsx
import React from "react";
import { Edit2, Trash2, PawPrint } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Patient } from "@/types/pacientes";

interface PatientCardProps {
  patient: Patient;
  onEdit: (patient: Patient) => void;
  onDelete: (patientId: number, patientName: string) => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onEdit,
  onDelete,
}) => {
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const age = calculateAge(patient.birthDate);
  const genderLabel = patient.gender === "Male" ? "Macho" : "Hembra";
  const classificationLabel =
    patient.classification === "Domestic" ? "Doméstico" : "Granja";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={patient.photoUrl} alt={patient.animalName} />
              <AvatarFallback className="bg-orange-100 text-orange-600">
                <PawPrint className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{patient.animalName}</CardTitle>
              <CardDescription>
                {patient.species} • {patient.breed}
              </CardDescription>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(patient)}
              className="hover:bg-blue-50 hover:text-blue-600"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(patient.patientId, patient.animalName)}
              className="text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-medium text-gray-600">Sexo:</span>
            <div>{genderLabel}</div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Edad:</span>
            <div>{age} años</div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Peso:</span>
            <div>{patient.weight} kg</div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Clasificación:</span>
            <div>
              <Badge
                variant={
                  patient.classification === "Domestic"
                    ? "default"
                    : "secondary"
                }
              >
                {classificationLabel}
              </Badge>
            </div>
          </div>
        </div>
        <Separator />
        <div className="text-xs text-gray-500">
          Registrado:{" "}
          {new Date(patient.registeredAt).toLocaleDateString("es-ES")} por{" "}
          {patient.registeredBy}
        </div>
      </CardContent>
    </Card>
  );
};
