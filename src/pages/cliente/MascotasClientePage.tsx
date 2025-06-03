import { useSessionStore } from "@/store/useSesionStore";

const MascotasClientePage = () => {
  const customerId = useSessionStore((s) => s.customerId);
  const patientId = useSessionStore((s) => s.patientId);
  if (!customerId || !patientId) {
    return <p>No hay paciente seleccionado</p>; // O puedes redirigir a otra página
  }

  return (
    <div>
      <h2>Historial del Paciente {patientId}</h2>
      <p>Cliente asociado: {customerId}</p>
      {/* Aquí puedes hacer llamadas a API o renderizar información */}
    </div>
  );
};

export default MascotasClientePage;
