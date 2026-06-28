import { Navigate, Outlet } from "react-router-dom";
import { PhoneFrame } from "@/components/shared/PhoneFrame";
import { OwnerBottomNav } from "@/components/navigation/OwnerBottomNav";
import { useAuthStore } from "@/store/authStore";
import { useOwnerCafe } from "@/hooks/useOwner";

/** B2B shell: requires login and that the user owns at least one cafe.
 *  Ownership is derived from owning a cafe, not a fixed role. */
export function OwnerLayout() {
  const user = useAuthStore((s) => s.user);
  const { data: cafe, isPending } = useOwnerCafe(user?.id ?? "");

  if (!user) return <Navigate to="/auth" replace />;
  if (isPending) {
    return (
      <PhoneFrame>
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          در حال بارگذاری…
        </div>
      </PhoneFrame>
    );
  }
  if (!cafe) return <Navigate to="/app" replace />;

  return (
    <PhoneFrame>
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <Outlet />
      </div>
      <OwnerBottomNav />
    </PhoneFrame>
  );
}
