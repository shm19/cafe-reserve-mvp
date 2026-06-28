import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

/** Guard for the B2C app: just requires login. Owners are also customers, so
 *  they may use the user app and switch into their manager panel at will. */
export function RequireAuth() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/auth" replace />;
  return <Outlet />;
}
