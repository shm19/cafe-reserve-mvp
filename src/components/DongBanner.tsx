import { useNavigate } from "react-router-dom";
import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Growth-hack banner nudging the user to split a recent group bill — the
 * product's core "dong" hook. Shown on home; tapping jumps to bookings where
 * a split can be started.
 */
export function DongBanner() {
  const navigate = useNavigate();
  return (
    <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-cta/20 bg-gradient-to-l from-peach-50 to-peach-100 p-3.5 shadow-md">
      <div className="flex size-12 flex-none items-center justify-center rounded-xl bg-paper shadow">
        <Receipt className="size-6 text-cta" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-black text-ink">دُنگ دورهمی اخیر</div>
        <div className="mt-0.5 text-xs font-semibold text-cta-ink">
          سهم بچه‌ها رو مشخص کن.
        </div>
      </div>
      <Button
        variant="cta"
        size="sm"
        className="flex-none"
        onClick={() => navigate("/app/bookings")}
      >
        محاسبه دُنگ
      </Button>
    </div>
  );
}
