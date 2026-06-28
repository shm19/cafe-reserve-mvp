import { Outlet } from "react-router-dom";
import { PhoneFrame } from "@/components/PhoneFrame";

/** Detail shell: phone frame only, no bottom nav. Detail pages (cafe profile,
 *  booking sheet, booking details) manage their own header + sticky CTA. */
export function DetailLayout() {
  return (
    <PhoneFrame>
      <Outlet />
    </PhoneFrame>
  );
}
