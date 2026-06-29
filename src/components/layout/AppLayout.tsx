import { Outlet } from "react-router-dom";
import { PhoneFrame } from "@/components/shared/PhoneFrame";
import { BottomNav } from "@/components/navigation/BottomNav";

/** Tab shell: phone frame + scrollable content + bottom nav.
 *  Used for the top-level tab screens (home, bookings, profile). */
export function AppLayout() {
  return (
    <PhoneFrame>
      <div data-scroll-root className="flex-1 overflow-y-auto scrollbar-none">
        <Outlet />
      </div>
      <BottomNav />
    </PhoneFrame>
  );
}
