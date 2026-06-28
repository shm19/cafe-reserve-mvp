import { useMemo, useState } from "react";
import { BookingCard } from "@/pages/MyBookings/BookingCard";
import { useMyBookings } from "@/hooks/useBookings";
import { useAllSplitBills } from "@/hooks/useSplitBills";
import { bucketBookings } from "@/api/bookings";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

type Tab = "upcoming" | "past";

export default function MyBookings() {
  const user = useAuthStore((s) => s.user);
  const { data: bookings = [], isPending } = useMyBookings(user?.id ?? "");
  const { data: splits = [] } = useAllSplitBills();
  const [tab, setTab] = useState<Tab>("upcoming");

  const splitMap = useMemo(
    () => new Map(splits.map((s) => [s.bookingId, s])),
    [splits]
  );
  const { upcoming, past } = useMemo(() => bucketBookings(bookings), [bookings]);
  const list = tab === "upcoming" ? upcoming : past;

  return (
    <div className="px-5 pt-5">
      <h1 className="mb-4 text-2xl font-black text-ink">رزروهای من</h1>

      {/* tabs */}
      <div className="mb-4 flex rounded-2xl bg-ink/5 p-1">
        {(["upcoming", "past"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-xl py-2 text-sm font-bold transition-colors",
              tab === t ? "bg-paper text-ink shadow-sm" : "text-muted-foreground"
            )}
          >
            {t === "upcoming" ? "پیش‌رو" : "گذشته"}
          </button>
        ))}
      </div>

      {isPending ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          در حال بارگذاری…
        </p>
      ) : list.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          {tab === "upcoming"
            ? "رزرو پیش‌رویی ندارید."
            : "هنوز رزرو گذشته‌ای ندارید."}
        </p>
      ) : (
        <div className="flex flex-col gap-3.5 pb-4">
          {list.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              split={splitMap.get(b.id)}
              upcoming={tab === "upcoming"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
