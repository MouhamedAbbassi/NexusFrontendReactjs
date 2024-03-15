// App.js
import React from 'react';
import { Routes, Route } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { SignIn } from './pages/auth';
import EmailSend from './pages/auth/EmailSend';
import VerifyOTP from './pages/auth/VerifyOTP';
import ChangePassword from './pages/auth/ChangePassword';
function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route path="/auth/forgot-password" element={<EmailSend />} /> 
      <Route path="/auth/verify-otp/:userId" element={<VerifyOTP />} />
      <Route path="/auth/change-password" element={<ChangePassword />}/>     
      <Route path="*" element={<SignIn />} />
    </Routes>
  );
}

export default App;
