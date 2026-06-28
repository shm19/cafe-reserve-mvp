import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { homePathForRole } from "@/lib/roles";

/** Guard for the B2C app: requires login, and keeps owners/admins out of the
 *  customer app (they belong in their own panels). */
export function RequireAuth() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== "user") {
    return <Navigate to={homePathForRole(user.role)} replace />;
  }
  return <Outlet />;
}
