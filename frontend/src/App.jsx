import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Candidates from "./pages/Candidates";
import Attendance from "./pages/Attendance";
import Employees from "./pages/Employees";
import Leave from "./pages/Leave";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./contexts/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Registration />} />

          <Route element={<ProtectedRoute />}>
            <Route index element={<Candidates />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="employees" element={<Employees />} />
            <Route path="leave" element={<Leave />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
