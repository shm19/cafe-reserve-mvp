import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Pause } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { StatCard } from "@/components/owner/StatCard";
import { OwnerBookingCard } from "@/components/owner/OwnerBookingCard";
import { useOwnerBookings } from "@/hooks/useOwner";
import { useAuthStore } from "@/store/authStore";
import { cn, faNum, faDayLabel } from "@/lib/utils";
import type { OwnerBooking } from "@/types";

export default function OwnerDashboard() {
  const owner = useAuthStore((s) => s.user);
  const { data: bookings = [], isPending } = useOwnerBookings(owner?.id ?? "");

  const [paused, setPaused] = useState(false);
  const [closedSlots, setClosedSlots] = useState<Record<string, boolean>>({});
  const [dayIdx, setDayIdx] = useState(0);

  const active = useMemo(
    () => bookings.filter((b) => b.status === "pending" || b.status === "confirmed"),
    [bookings]
  );

  // Days (date-only) with active bookings, ascending.
  const days = useMemo(
    () => Array.from(new Set(active.map((b) => b.datetime.slice(0, 10)))).sort(),
    [active]
  );
  const idx = days.length ? Math.min(dayIdx, days.length - 1) : 0;
  const selectedDay = days[idx];
  const dayBookings = active.filter((b) => b.datetime.slice(0, 10) === selectedDay);

  // Group the day's bookings into time slots.
  const slots = useMemo(() => {
    const map = new Map<string, OwnerBooking[]>();
    for (const b of dayBookings) {
      const t = b.datetime.slice(11, 16);
      if (!map.has(t)) map.set(t, []);
      map.get(t)!.push(b);
    }
    return [...map.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([time, list]) => ({ time, list }));
  }, [dayBookings]);

  const totalGuests = dayBookings.reduce((a, b) => a + b.partySize, 0);
  const pendingCount = dayBookings.filter((b) => b.status === "pending").length;

  return (
    <div className="px-5 pt-5">
      {/* header + pause */}
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-black text-ink">مدیریت رزروها</h1>
        <button
          onClick={() => setPaused((p) => !p)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold",
            paused ? "bg-cta text-white" : "border border-border bg-paper text-ink/70"
          )}
        >
          <Pause className="size-3.5" />
          {paused ? "رزرو آنلاین بسته است" : "بستن موقت رزرو آنلاین"}
        </button>
      </div>

      {/* date navigator */}
      {days.length > 0 && (
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-border/60 bg-paper px-2.5 py-2">
          <button
            onClick={() => setDayIdx((i) => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="flex size-8 items-center justify-center rounded-lg bg-bg text-ink/60 disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
          <div className="flex items-center gap-2 text-sm font-extrabold text-ink">
            <CalendarDays className="size-4 text-primary" />
            {faDayLabel(selectedDay)}
          </div>
          <button
            onClick={() => setDayIdx((i) => Math.min(days.length - 1, i + 1))}
            disabled={idx >= days.length - 1}
            className="flex size-8 items-center justify-center rounded-lg bg-bg text-ink/60 disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
        </div>
      )}

      {/* paused banner */}
      {paused && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-cta/20 bg-cta/10 px-3 py-2.5 text-xs font-bold text-cta-ink">
          <Pause className="size-4 flex-none" />
          رزرو آنلاین موقتاً بسته است — کاربران نمی‌توانند درخواست جدید ثبت کنند.
        </div>
      )}

      {/* snapshot */}
      <div className="mb-5 mt-4 flex gap-2.5">
        <StatCard value={dayBookings.length} label="کل رزروها" />
        <StatCard value={totalGuests} label="جمعیت کل" />
        <StatCard value={pendingCount} label="در انتظار بررسی" highlight />
      </div>

      {/* slots */}
      {isPending ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          در حال بارگذاری…
        </p>
      ) : slots.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          رزرو فعالی وجود ندارد.
        </p>
      ) : (
        <div className="flex flex-col gap-5 pb-4">
          {slots.map((slot) => {
            const closed = !!closedSlots[slot.time];
            const guests = slot.list.reduce((a, b) => a + b.partySize, 0);
            return (
              <div key={slot.time}>
                <div className="flex items-center justify-between gap-2 rounded-xl bg-ink/[0.03] px-3 py-2.5">
                  <div className="flex flex-col">
                    <span dir="ltr" className="text-lg font-black text-ink">
                      {faNum(slot.time)}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {faNum(slot.list.length)} رزرو · {faNum(guests)} نفر
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Switch
                      on={!closed}
                      onClick={() =>
                        setClosedSlots((s) => ({ ...s, [slot.time]: !closed }))
                      }
                    />
                    <span className="text-[10px] font-bold text-muted-foreground">
                      وضعیت رزرو
                    </span>
                  </div>
                </div>

                {closed ? (
                  <p className="py-2 text-center text-xs font-bold text-muted-foreground">
                    این سانس برای رزرو آنلاین بسته شد
                  </p>
                ) : (
                  <div className="mt-2.5 flex flex-col gap-2.5">
                    {slot.list.map((b) => (
                      <OwnerBookingCard key={b.id} booking={b} ownerId={owner!.id} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
