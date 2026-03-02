import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireSeller() {
  const { isAuthed, isSeller, isAdmin } = useAuth();

  if (!isAuthed) return <Navigate to="/login" replace />;
  if (!isSeller && !isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}
