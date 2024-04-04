import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";

import AddMeetingForm from "./pages/dashboard/AddMeetingForm";
import UpdateMeetingForm from "./pages/dashboard/UpdateMettingForm";
import DeleteSprint from "./pages/dashboard/DeleteSprint";
import UpdateSprint from "./pages/dashboard/UpdateSprint";
import AddSprint from "./pages/dashboard/AddSprint";
import React,{useState} from "react";
import MeetScreen from "./pages/dashboard/meetscreen";
import BacklogDetails from './pages/backlogs/backlogDetails'; 
import AddTask from './pages/backlogs/addTask'; 
import ModalTasks from "./pages/backlogs/modalTasks";
import AllMeetingsList from "./pages/dashboard/AllMeetingsList";


function App() {



  return (
    <div className="App">
     

      <Routes>
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      
         <Route path="/meeting/:linkMeet" element={<MeetScreen />} />
        <Route path="/meet/add" element={<AddMeetingForm />} />
        <Route path="/sprint/addsprint" element={<AddSprint />} />
        <Route path="/meet/update/:id" element={<UpdateMeetingForm />} />
        <Route path="/sprint/delete/:id" element={<DeleteSprint />} />
        <Route path="/sprint/update/:id" element={<UpdateSprint />} />
        <Route path="/meet/list" element={<AllMeetingsList />} />
        <Route path="/backlog/details/:id" element={<BacklogDetails />} />
        <Route path="/backlog/details/addTask/:id" element={<AddTask />} />
        <Route path="/backlog/details/modalTasks" element={<ModalTasks />} />
      </Routes>
    </div>
  );
}

export default App;
