import { Navigate, Outlet } from "react-router-dom";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { useAuthStore } from "@/store/authStore";

/** B2C shell: phone frame + bottom nav. Requires a logged-in user. */
export function AppLayout() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <PhoneFrame>
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <Outlet />
      </div>
      <BottomNav />
    </PhoneFrame>
  );
}
