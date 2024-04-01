import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import BacklogDetails from './pages/backlogs/backlogDetails'; 
import AddTask from './pages/backlogs/addTask'; 
import ModalTasks from "./pages/backlogs/modalTasks";
import Conversation from "./pages/Chat/Conversation";
import Membres from "./pages/membres/Membres";
import Projects from "./pages/projects/Project";

function App() {
  return (
    <Routes>
      
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={ <Auth /> } />
      <Route path="/membres" element={ <Membres /> } />
        <Route path="/projects" element={<Projects/>} />
      <Route path="/conversation/:id" element={<Conversation />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      <Route path="/backlog/details/:id" element={<BacklogDetails />} />  
      <Route path="/backlog/details/addTask/:id" element={<AddTask />} />  
      <Route path="/backlog/details/modalTasks" element={ <ModalTasks /> } />  
       
    </Routes>
  );
}

export default App;
