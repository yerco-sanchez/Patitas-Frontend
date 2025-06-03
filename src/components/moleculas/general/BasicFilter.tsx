// components/molecules/FiltrosGenericos.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X, Filter } from "lucide-react";

interface FiltroOption {
  value: string;
  label: string;
}

interface FiltrosGenericosProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  title?: string;
  filters?: {
    placeholder?: string;
    allLabel: string;
    value: string;
    options: FiltroOption[];
    onChange: (value: string) => void;
  }[];
  onClearFilters?: () => void;
}

export const FiltrosGenericos: React.FC<FiltrosGenericosProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  title = "Filtros y Búsqueda",
  filters = [],
  onClearFilters,
}) => {
  const hasActiveFilters =
    searchValue ||
    filters.some((filter) => filter.value && filter.value !== "all");

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {title}
          </div>
          <div className="flex items-center">
            {hasActiveFilters && onClearFilters && (
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="flex items-center absolute -translate-x-full"
              >
                <X className="" />
                Limpiar
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filtros adicionales */}
          {filters.map((filter, index) => (
            <Select
              key={index}
              value={filter.value}
              onValueChange={filter.onChange}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={filter.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{filter.allLabel}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
