// pages/ClientesPage.tsx
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Cliente, ClienteFormData } from "@/types/models";
import { useClientes, useClientePacientes } from "@/hooks/useClient";
import { TIPOS_CLIENTE, ESTADOS_CLIENTE } from "@/constants/cliente";
import { ClienteDetalles } from "@/components/moleculas/clientes/ClienteDetail";
import { ClienteModal } from "@/components/moleculas/clientes/ClienteModal";
import { TablaClientes } from "@/components/moleculas/clientes/ClienteTabla";
import { FiltrosGenericos } from "@/components/moleculas/general/BasicFilter";
import PageHeader from "@/components/moleculas/general/PageHeader";

export const ClientesPage: React.FC = () => {
  const {
    clientes,
    loading,
    error,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    limpiarError,
  } = useClientes();

  const { pacientes, obtenerPacientes } = useClientePacientes();

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoClienteFilter, setTipoClienteFilter] = useState("all");
  const [estadoClienteFilter, setEstadoClienteFilter] = useState("all");

  // Estados para modales y detalles
  const [isDetallesOpen, setIsDetallesOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);

  // Filtrado de clientes
  const clientesFiltrados = useMemo(() => {
    return clientes.filter((cliente) => {
      const matchesSearch =
        cliente.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.apPaterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cliente.apMaterno &&
          cliente.apMaterno.toLowerCase().includes(searchTerm.toLowerCase())) ||
        cliente.ci.includes(searchTerm) ||
        cliente.telefono.includes(searchTerm) ||
        cliente.correo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTipo =
        tipoClienteFilter === "all" ||
        cliente.tipoCliente === tipoClienteFilter;
      const matchesEstado =
        estadoClienteFilter === "all" ||
        cliente.estadoCliente === estadoClienteFilter;

      return matchesSearch && matchesTipo && matchesEstado;
    });
  }, [clientes, searchTerm, tipoClienteFilter, estadoClienteFilter]);

  const handleViewDetails = async (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setIsDetallesOpen(true);
    // Cargar los pacientes del cliente
    if (cliente.idCliente) {
      await obtenerPacientes(cliente.idCliente);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setIsModalOpen(true);
  };

  const handleDelete = async (cliente: Cliente) => {
    if (
      confirm(
        `¿Está seguro que desea eliminar al cliente ${cliente.nombres} ${cliente.apPaterno}?`
      )
    ) {
      const success = await eliminarCliente(cliente.idCliente);
      if (success) {
        // El hook ya actualiza la lista automáticamente
      }
    }
  };

  const handleSave = async (formData: ClienteFormData) => {
    if (clienteEditando) {
      // Actualizar cliente existente
      const clienteActualizado: Cliente = {
        ...clienteEditando,
        ...formData,
      };
      const success = await actualizarCliente(clienteActualizado);
      if (success) {
        setClienteEditando(null);
        setIsModalOpen(false);
      }
    } else {
      // Crear nuevo cliente
      const nuevoCliente = await crearCliente(formData);
      if (nuevoCliente) {
        setIsModalOpen(false);
      }
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setTipoClienteFilter("all");
    setEstadoClienteFilter("all");
  };

  const handleNewClient = () => {
    setClienteEditando(null);
    setIsModalOpen(true);
  };

  const handleCloseError = () => {
    limpiarError();
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Gestión de Clientes"
        description="Administra la información de tus clientes"
        actionButton={
          <Button
            onClick={handleNewClient}
            className="flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Nuevo Cliente
          </Button>
        }
      />

      {/* Mostrar errores */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseError}
              className="ml-2"
            >
              Cerrar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <FiltrosGenericos
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar por nombre, CI, teléfono o correo..."
        filters={[
          {
            allLabel: "Todos los tipos",
            value: tipoClienteFilter,
            options: TIPOS_CLIENTE.map((tipo) => ({
              value: tipo,
              label: tipo,
            })),
            onChange: setTipoClienteFilter,
          },
          {
            allLabel: "Todos los estados",
            value: estadoClienteFilter,
            options: ESTADOS_CLIENTE.map((estado) => ({
              value: estado,
              label: estado,
            })),
            onChange: setEstadoClienteFilter,
          },
        ]}
        onClearFilters={handleClearFilters}
      />

      {/* Mostrar loader mientras carga */}
      {loading && !error && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando clientes...</span>
        </div>
      )}

      {/* Tabla de clientes */}
      {!loading && (
        <TablaClientes
          clientes={clientesFiltrados}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal de detalles del cliente */}
      <ClienteDetalles
        isOpen={isDetallesOpen}
        onOpenChange={setIsDetallesOpen}
        cliente={clienteSeleccionado}
        animales={pacientes}
        onEdit={(cliente) => {
          setIsDetallesOpen(false);
          handleEdit(cliente);
        }}
      />

      {/* Modal de creación/edición */}
      <ClienteModal
        isOpen={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setClienteEditando(null);
        }}
        cliente={clienteEditando}
        onSave={handleSave}
      />
    </div>
  );
};
