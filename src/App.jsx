import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import AddMeetingForm from "./pages/dashboard/AddMeetingForm";
import UpdateMeetingForm from "./pages/dashboard/UpdateMettingForm";

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      <Route path="/meet/add" element={<AddMeetingForm />} />
      <Route path="/meet/update/:id" element={<UpdateMeetingForm />} />


    </Routes>
  );
}

export default App;
