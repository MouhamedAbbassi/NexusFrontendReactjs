import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import AddMeetingForm from "./pages/dashboard/AddMeetingForm";
import UpdateMeetingForm from "./pages/dashboard/UpdateMettingForm";
import DeleteSprint from "./pages/dashboard/DeleteSprint";
import UpdateSprint from "./pages/dashboard/UpdateSprint";
import AddSprint from "./pages/dashboard/AddSprint";

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />


      <Route path="/meet/add" element={<AddMeetingForm />} />
      <Route path="/sprint/addsprint" element={<AddSprint />} />

      <Route path="/meet/update/:id" element={<UpdateMeetingForm />} />

      <Route path="/sprint/delete/:id" element={<DeleteSprint />} />
      <Route path="/sprint/update/:id" element={<UpdateSprint />} />




    </Routes>
  );
}

export default App;
