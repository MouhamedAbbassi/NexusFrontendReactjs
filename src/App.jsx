import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import BacklogDetails from './pages/backlogs/backlogDetails'; 
import AddTask from './pages/backlogs/addTask'; 
import ModalTasks from "./pages/backlogs/modalTasks";
import AddBacklog from "./pages/backlogs/addBacklog";
function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      <Route path="/backlog/details/:id" element={<BacklogDetails />} />  
      <Route path="/backlog/details/addTask/:id" element={<AddTask />} />  
      <Route path="/backlog/details/modalTasks" element={<ModalTasks />} />  
      <Route path="/dashboard/addBacklog" element={<AddBacklog />} />  
    </Routes>
  );
}

export default App;
