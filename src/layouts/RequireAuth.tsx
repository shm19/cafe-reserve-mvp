import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

/** Guard layout: renders child routes only when logged in, else -> /auth.
 *  Shared by both the tab layout and the detail layout. */
export function RequireAuth() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/auth" replace />;
  return <Outlet />;
}
