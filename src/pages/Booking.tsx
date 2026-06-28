import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, Minus, Plus, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCafe } from "@/hooks/useCafes";
import { useCreateBooking } from "@/hooks/useBookings";
import { requiresDeposit } from "@/services/bookings";
import { useAuthStore } from "@/store/authStore";
import { cn, faNum, toman } from "@/lib/utils";

const DEPOSIT_AMOUNT = 100_000;
const MIN_GUESTS = 1;
const MAX_GUESTS = 12;

// Fixed demo slots; some marked unavailable to mirror the design.
const TIME_SLOTS: { time: string; full?: boolean }[] = [
  { time: "17:00" },
  { time: "18:30" },
  { time: "20:00", full: true },
  { time: "21:30" },
  { time: "22:30" },
];

const pad = (n: number) => String(n).padStart(2, "0");
const dateKey = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function nextDays(count: number) {
  const weekday = new Intl.DateTimeFormat("fa-IR", { weekday: "long" });
  const dayMonth = new Intl.DateTimeFormat("fa-IR", {
    day: "numeric",
    month: "long",
  });
  return Array.from({ length: count }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const label = i === 0 ? "امروز" : i === 1 ? "فردا" : weekday.format(d);
    return { key: dateKey(d), label, sub: dayMonth.format(d) };
  });
}

export default function Booking() {
  const { cafeId = "" } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { data: cafe, isPending: cafeLoading } = useCafe(cafeId);
  const createBooking = useCreateBooking();

  const days = nextDays(7);
  const [date, setDate] = useState(days[0].key);
  const [time, setTime] = useState<string | null>(null);
  const [partySize, setPartySize] = useState(2);
  const [notes, setNotes] = useState("");

  const deposit = requiresDeposit(partySize);

  function confirm() {
    if (!time || !user) return;
    createBooking.mutate(
      {
        cafeId,
        userId: user.id,
        datetime: `${date}T${time}:00`,
        partySize,
        occasionNotes: notes.trim() || undefined,
      },
      { onSuccess: (booking) => navigate(`/app/booking/${booking.id}`) }
    );
  }

  if (cafeLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        در حال بارگذاری…
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* grab handle */}
      <div className="flex flex-none justify-center pb-0.5 pt-3">
        <span className="h-1.5 w-10 rounded-full bg-ink/15" />
      </div>

      {/* header */}
      <div className="flex flex-none items-center justify-between border-b border-border/70 px-5 pb-3 pt-2">
        <div>
          <h1 className="text-lg font-black text-ink">رزرو میز</h1>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {cafe ? `${cafe.name} · ${cafe.neighborhood}` : "—"}
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex size-9 items-center justify-center rounded-full bg-bg text-ink/60"
          aria-label="بستن"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* body */}
      <div className="scrollbar-none flex-1 overflow-y-auto px-5 py-4">
        {/* date */}
        <h2 className="mb-2.5 text-sm font-extrabold text-ink">تاریخ</h2>
        <div className="scrollbar-none -mx-5 mb-5 flex gap-2 overflow-x-auto px-5">
          {days.map((d) => (
            <button
              key={d.key}
              onClick={() => setDate(d.key)}
              className={cn(
                "w-16 flex-none rounded-xl py-2.5 text-center transition-colors",
                date === d.key
                  ? "bg-primary text-white shadow"
                  : "border border-border bg-bg text-ink/70"
              )}
            >
              <div className="text-xs font-bold">{d.label}</div>
              <div className="mt-0.5 text-xs opacity-80">{d.sub}</div>
            </button>
          ))}
        </div>

        {/* time */}
        <h2 className="mb-2.5 text-sm font-extrabold text-ink">ساعت</h2>
        <div className="scrollbar-none -mx-5 mb-5 flex gap-2 overflow-x-auto px-5">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot.time}
              disabled={slot.full}
              onClick={() => setTime(slot.time)}
              dir="ltr"
              className={cn(
                "flex-none rounded-xl px-4 py-2.5 text-sm font-bold transition-colors",
                slot.full
                  ? "cursor-not-allowed border border-dashed border-border text-muted-foreground line-through"
                  : time === slot.time
                    ? "bg-primary text-white shadow"
                    : "border border-border bg-bg text-ink/70"
              )}
            >
              {faNum(slot.time)}
            </button>
          ))}
        </div>

        {/* guests stepper */}
        <div className="mb-3.5 flex items-center justify-between rounded-2xl bg-bg px-4 py-3">
          <span className="text-sm font-extrabold text-ink">تعداد نفرات</span>
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => setPartySize((n) => Math.max(MIN_GUESTS, n - 1))}
              disabled={partySize <= MIN_GUESTS}
              className="flex size-9 items-center justify-center rounded-full border border-border bg-paper text-ink disabled:opacity-40"
              aria-label="کاهش"
            >
              <Minus className="size-4" />
            </button>
            <span className="min-w-7 text-center text-xl font-black text-ink">
              {faNum(partySize)}
            </span>
            <button
              onClick={() => setPartySize((n) => Math.min(MAX_GUESTS, n + 1))}
              disabled={partySize >= MAX_GUESTS}
              className="flex size-9 items-center justify-center rounded-full border border-border bg-paper text-ink disabled:opacity-40"
              aria-label="افزایش"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        {/* deposit & cancellation policy */}
        <div className="mb-5 rounded-2xl border border-border/70 bg-ink/[0.03] p-4">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="size-4 text-muted-foreground" />
            <span className="text-sm font-extrabold text-ink">
              جزئیات بیعانه و لغو
            </span>
          </div>
          <ul className="flex flex-col gap-2.5 text-xs leading-relaxed text-ink/70">
            <li className="flex gap-2.5">
              <span className="mt-1.5 size-1.5 flex-none rounded-full bg-primary" />
              <span>
                برای رزرو بالای <b className="text-ink">۶ نفر</b>، پرداخت{" "}
                <b className="text-ink">{toman(DEPOSIT_AMOUNT)}</b> بیعانه الزامی
                است.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 size-1.5 flex-none rounded-full bg-primary" />
              <span>
                لغو <b className="text-primary">رایگان</b> و بازگشت وجه تا{" "}
                <b className="text-ink">۲۴ ساعت</b> قبل.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 size-1.5 flex-none rounded-full bg-rose" />
              <span>
                لغو دیرهنگام یا عدم حضور، مشمول{" "}
                <b className="text-rose-ink">کسر جریمه</b> از بیعانه می‌شود.
              </span>
            </li>
          </ul>
        </div>

        {/* special request */}
        <h2 className="mb-2 text-sm font-extrabold text-ink">
          درخواست ویژه{" "}
          <span className="text-xs font-medium text-muted-foreground">
            (اختیاری)
          </span>
        </h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="مثلاً: میز نزدیک تلویزیون برای تماشای بازی، یا فضای دنج گوشهٔ سالن…"
          className="w-full resize-none rounded-xl border border-border bg-paper p-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/70"
        />
      </div>

      {/* footer */}
      <div className="flex-none border-t border-border px-5 pb-6 pt-3">
        {createBooking.isError && (
          <p className="mb-2 text-center text-xs text-destructive">
            ثبت رزرو ناموفق بود. دوباره تلاش کنید.
          </p>
        )}
        <Button
          variant="cta"
          size="lg"
          className="w-full justify-between"
          disabled={!time || createBooking.isPending}
          onClick={confirm}
        >
          {createBooking.isPending ? (
            <Loader2 className="mx-auto size-5 animate-spin" />
          ) : (
            <>
              <span>{deposit ? "تأیید و پرداخت" : "ثبت درخواست رزرو"}</span>
              {deposit && <span className="text-sm">{toman(DEPOSIT_AMOUNT)}</span>}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
