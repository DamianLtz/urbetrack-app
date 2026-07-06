import { Navigate, Route, Routes } from "react-router";
import AppLayout from "./layouts/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import MapPage from "./pages/MapPage";
import IncidentsPage from "./pages/IncidentsPage";
import IncidentDetailPage from "./pages/IncidentDetailPage";
import NewIncidentPage from "./pages/NewIncidentPage";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/mapa" replace />} />
        <Route path="mapa" element={<MapPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="incidentes" element={<IncidentsPage />} />
        <Route path="incidentes/nuevo" element={<NewIncidentPage />} />
        <Route path="incidentes/:id" element={<IncidentDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
