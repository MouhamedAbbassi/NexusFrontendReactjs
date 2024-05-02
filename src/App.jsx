// App.js
import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { SignIn, SignOut } from './pages/auth';
import EmailSend from './pages/auth/EmailSend';
import VerifyOTP from './pages/auth/VerifyOTP';
import ChangePassword from './pages/auth/ChangePassword';
import AdminDashboard from './layouts/adminDashboard';
import AddTask from './pages/backlogs/addTask';
import ModalTasks from './pages/backlogs/modalTasks';
import BacklogDetails from './pages/backlogs/backlogDetails';
import MeetScreen from './pages/dashboard/meetscreen';
import AddMeetingForm from './pages/dashboard/AddMeetingForm';
import AddSprint from './pages/dashboard/AddSprint';
import UpdateMeetingForm from './pages/dashboard/UpdateMettingForm';
import DeleteSprint from './pages/dashboard/DeleteSprint';
import UpdateSprint from './pages/dashboard/UpdateSprint';
import AllMeetingsList from './pages/dashboard/AllMeetingsList';
import ResourceEditForm from './pages/ressources/ResourceEditForm';
import RessourceDetails from './pages/ressources/RessourcesDetails';
import RessourceForm from './pages/ressources/RessourceForm';
import Historique from './pages/dashboard/historique';
import Membres from './pages/membres/Membres';
import Projects from './pages/projects/Project';
import Conversation from './pages/Chat/Conversation';
import AddBacklog from './pages/backlogs/addBacklog';
import TasksList from './pages/backlogs/tasksList';
import { Home } from './pages/dashboard';
import PrivateRoute from './PrivateRoutes';
import { Unauthorized } from './pages/unauthorized';
import HistoriqueDetails from './pages/historique/historiqueDetails';



function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={ < Dashboard/> }/>
      <Route path="/home/*" element={<Home />} />
      <Route path="/admindashboard/*" element={ <PrivateRoute  element ={< AdminDashboard/> } roles={["admin"]} />}/>
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      
      <Route path="/auth/forgot-password" element={<EmailSend />} /> 
      <Route path="/auth/verify-otp/:userId" element={<VerifyOTP />} />
      <Route path="/auth/change-password" element={<ChangePassword />}/>     
      <Route path="*" element={<SignIn />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      <Route path="/backlog/details/:id" element={<BacklogDetails />} />  
      <Route path="/backlog/details/addTask/:id" element={<AddTask />} />  
      <Route path="/backlog/details/modalTasks" element={<ModalTasks />} /> 
      <Route path="/meeting/:linkMeet" element={<MeetScreen />} />
        <Route path="/meet/add" element={<AddMeetingForm />} />
        <Route path="/sprint/addsprint" element={<AddSprint />} />
        <Route path="/meet/update/:id" element={<UpdateMeetingForm />} />
        <Route path="/sprint/delete/:id" element={<DeleteSprint />} />
        <Route path="/sprint/update/:id" element={<UpdateSprint />} />
        <Route path="/meet/list" element={<AllMeetingsList />} />
        <Route path="/edit/:id" element={<ResourceEditForm/>} />
      <Route path="/ressources/:id" element={<RessourceDetails/>} />
      <Route path="/form" element={<RessourceForm />} />
      <Route path="/historiques/:resourceId" element={<Historique />} />
      <Route path="/membres" element={ <Membres /> } />
      <Route path="/projects" element={<Projects/>} />
      <Route path="/conversation/:id" element={<Conversation />} />
      <Route path="/dashboard/addBacklog" element={<AddBacklog />} />  
      <Route path="/dashboard/tasksList/:id" element={<TasksList />} />
      <Route path="/historiques/details/:id" element={<HistoriqueDetails/>} />


 
    </Routes>
  );
}

export default App;
