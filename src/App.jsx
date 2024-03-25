import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import BacklogDetails from './pages/backlogs/backlogDetails'; // Import your new page component
import RessourcesList from "./pages/dashboard/ressourcesList";
import ResourceEditForm from "./pages/ressources/ResourceEditForm";
import RessourceDetails from "./pages/ressources/RessourcesDetails";
import RessourceForm from "./pages/ressources/RessourceForm";
import Historique from "./pages/dashboard/historique";
function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      <Route path="/backlog/details/:id" element={<BacklogDetails />} /> {/* Use element prop instead of component */}
      <Route path="/edit/:id" element={<ResourceEditForm/>} />
      <Route path="/ressources/:id" element={<RessourceDetails/>} />
      <Route path="/form" element={<RessourceForm />} />
      <Route path="/historiques/:resourceId" element={<Historique />} />


    </Routes>
  );
}

export default App;
