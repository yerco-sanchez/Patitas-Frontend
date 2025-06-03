import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ClientesPage } from "./pages/cliente/GestiónClientePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MascotasClientePage from "./pages/cliente/MascotasClientePage";
import { PacienteCRUD } from "./pages/MascotaList";
import PacientesRegistro from "./pages/PacienteTest";
import MedicamentosPage from "./pages/medicamento/MedicamentoPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MedicamentosPage/>} />
      </Routes>
      <Routes>
        <Route
          path="/clientes"
          element={<PacientesRegistro></PacientesRegistro>}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
