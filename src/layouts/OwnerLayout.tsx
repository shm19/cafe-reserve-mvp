import { Navigate, Outlet } from "react-router-dom";
import { PhoneFrame } from "@/components/PhoneFrame";
import { OwnerBottomNav } from "@/components/OwnerBottomNav";
import { useAuthStore } from "@/store/authStore";

/** B2B shell: requires an owner; otherwise bounces to login or the B2C app. */
export function OwnerLayout() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== "owner") return <Navigate to="/app" replace />;

  return (
    <PhoneFrame>
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <Outlet />
      </div>
      <OwnerBottomNav />
    </PhoneFrame>
  );
}
