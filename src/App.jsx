// App.js
import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { SignIn } from './pages/auth';
import EmailSend from './pages/auth/EmailSend';
import VerifyOTP from './pages/auth/VerifyOTP';
import ChangePassword from './pages/auth/ChangePassword';
import AdminDashboard from './layouts/adminDashboard';
import AddTask from './pages/backlogs/addTask';
import ModalTasks from './pages/backlogs/modalTasks';
import BacklogDetails from './pages/backlogs/backlogDetails';



function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/admindashboard/*" element={<AdminDashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route path="/auth/forgot-password" element={<EmailSend />} /> 
      <Route path="/auth/verify-otp/:userId" element={<VerifyOTP />} />
      <Route path="/auth/change-password" element={<ChangePassword />}/>     
      <Route path="*" element={<SignIn />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      <Route path="/backlog/details/:id" element={<BacklogDetails />} />  
      <Route path="/backlog/details/addTask/:id" element={<AddTask />} />  
      <Route path="/backlog/details/modalTasks" element={<ModalTasks />} /> 
 
    </Routes>
  );
}

export default App;
