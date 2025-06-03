import React from "react";
import { User } from "lucide-react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Customer } from "@/types/pacientes";

interface CustomerInfoCardProps {
  customer: Customer;
}

const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({ customer }) => {
  return (
    <Card>
      <CardContent className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-blue-100 text-blue-600">
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{customer.fullName}</CardTitle>
              <CardDescription className="text-sm">
                CI: {customer.documentId} • Tel: {customer.phone} •{" "}
                {customer.email}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant={
              customer.customerStatus === "Active" ? "default" : "secondary"
            }
          >
            {customer.customerStatus}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Dirección:</span> {customer.address}
          </div>
          <div>
            <span className="font-medium">Tipo Cliente:</span>{" "}
            {customer.customerType}
          </div>
          {customer.notes && (
            <div className="md:col-span-2">
              <span className="font-medium">Observaciones:</span>{" "}
              {customer.notes}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerInfoCard;
