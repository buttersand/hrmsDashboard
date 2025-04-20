import { Outlet, Navigate, useLocation } from "react-router-dom";
import "../RootLayout.css";
import Aside from "./Aside";
import Header from "./Header";
import { useAuth } from "../contexts/AuthContext";

export default function RootLayout() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (isAuthenticated && isAuthPage) {
    return <Navigate to="/" replace />;
  }

  return isAuthenticated ? (
    <main className="main-layout">
      <div className="aside-wrapper">
        <Aside />
      </div>
      <div className="header-wrapper">
        <Header />
      </div>
      <div className="page-wrapper">
        <Outlet />
      </div>
    </main>
  ) : (
    <Outlet />
  );
}
