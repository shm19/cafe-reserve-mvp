import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Phone,
  Navigation,
  Car,
  Info,
  RotateCcw,
  Receipt,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking, useCancelBooking } from "@/hooks/useBookings";
import { useSplitByBooking } from "@/hooks/useSplitBills";
import { depositAmount } from "@/services/bookings";
import { cn, faNum, faDateTime, toman } from "@/lib/utils";
import type { BookingStatus } from "@/types";

const PILL: Record<
  BookingStatus,
  { label: string; dot: string; cls: string }
> = {
  pending: { label: "در انتظار تأیید", dot: "bg-cta", cls: "bg-accent/20 text-accent-ink" },
  confirmed: { label: "تأیید‌شده", dot: "bg-primary", cls: "bg-primary/12 text-primary" },
  completed: { label: "انجام شده", dot: "bg-muted-foreground", cls: "bg-muted text-muted-foreground" },
  cancelled: { label: "لغو شده", dot: "bg-destructive", cls: "bg-destructive/10 text-destructive" },
  rejected: { label: "رد شده", dot: "bg-destructive", cls: "bg-destructive/10 text-destructive" },
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 py-3 last:border-0">
      <span className="text-xs font-semibold text-ink/60">{label}</span>
      <span className="text-sm font-extrabold text-ink">{children}</span>
    </div>
  );
}

export default function BookingDetails() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: booking, isPending, isError } = useBooking(id);
  const { data: split } = useSplitByBooking(id);
  const cancel = useCancelBooking();

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        در حال بارگذاری…
      </div>
    );
  }
  if (isError || !booking) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
        <p className="text-sm text-destructive">رزرو پیدا نشد.</p>
        <Button variant="outline" onClick={() => navigate("/app/bookings")}>
          بازگشت
        </Button>
      </div>
    );
  }

  const cafe = booking.cafe;
  const pill = PILL[booking.status];
  const isUpcoming = booking.status === "pending" || booking.status === "confirmed";
  const deposit = depositAmount(cafe, booking.partySize);
  const refund = Math.round(deposit * 0.8); // 20% fee on late cancel

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* header */}
      <div className="flex flex-none items-center justify-between gap-3 px-4 pb-3 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex size-9 items-center justify-center rounded-xl border border-border bg-paper text-ink"
          aria-label="بازگشت"
        >
          <ArrowRight className="size-5" />
        </button>
        <h1 className="text-base font-black text-ink">جزئیات رزرو</h1>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
            pill.cls
          )}
        >
          <span className={cn("size-1.5 rounded-full", pill.dot)} />
          {pill.label}
        </span>
      </div>

      {/* body */}
      <div className="scrollbar-none flex-1 overflow-y-auto px-4 pb-6">
        {/* cafe & location */}
        <div className="rounded-2xl border border-border/60 bg-paper p-4">
          <div className="flex items-center gap-3">
            <div
              className="size-14 flex-none rounded-xl"
              style={{ backgroundColor: cafe?.coverColor ?? "#E0D8CB" }}
            />
            <div className="min-w-0 flex-1">
              <div className="text-base font-extrabold text-ink">
                {cafe?.name ?? "کافه"}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5 text-sage" />
                {cafe?.neighborhood ?? "—"}
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-2.5">
            <a
              href={cafe?.phone ? `tel:${cafe.phone}` : undefined}
              className={cn(
                "flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border/60 bg-bg text-xs font-extrabold text-ink/80",
                !cafe?.phone && "pointer-events-none opacity-50"
              )}
            >
              <Phone className="size-4 text-primary" />
              تماس با کافه
            </a>
            <a
              href={
                cafe
                  ? `https://neshan.org/maps/@${cafe.lat},${cafe.lng},16z`
                  : undefined
              }
              target="_blank"
              rel="noreferrer"
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border/60 bg-bg text-xs font-extrabold text-ink/80"
            >
              <Navigation className="size-4 text-primary" />
              مسیریابی
            </a>
          </div>
          {cafe?.tags.includes("parking") && (
            <div className="mt-3 flex gap-2 border-t border-border/50 pt-3">
              <Car className="mt-0.5 size-4 flex-none text-sage" />
              <p className="text-xs leading-relaxed text-ink/60">
                <b className="font-extrabold text-ink/80">وضعیت پارکینگ:</b> دارای
                جای پارک اختصاصی.
              </p>
            </div>
          )}
        </div>

        {/* core details */}
        <h2 className="mb-2.5 mt-5 px-1 text-sm font-extrabold text-ink">
          جزئیات رزرو
        </h2>
        <div className="rounded-2xl border border-border/60 bg-paper px-4">
          <Row label="کد رزرو">
            <span dir="ltr">#{booking.id}</span>
          </Row>
          <Row label="تاریخ و ساعت">{faDateTime(booking.datetime)}</Row>
          <Row label="تعداد نفرات">{faNum(booking.partySize)} نفر</Row>
          {booking.depositRequired && (
            <Row label="بیعانه">
              {booking.depositStatus === "paid" ? (
                <span className="text-primary">{toman(deposit)}</span>
              ) : (
                <span className="text-cta-ink">در انتظار پرداخت</span>
              )}
            </Row>
          )}
          <div className="py-3">
            <div className="mb-1.5 text-xs font-semibold text-ink/60">
              درخواست ویژه
            </div>
            <p className="text-sm leading-relaxed text-ink/80">
              {booking.occasionNotes || "—"}
            </p>
          </div>
        </div>

        {/* split bill (completed) */}
        {booking.status === "completed" && (
          <div className="mt-4 rounded-2xl border border-cta/20 bg-cta/[0.08] p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-cta-ink">
              <span className="size-2 rounded-full bg-cta" />
              {split
                ? split.status === "settled"
                  ? "دُنگ تسویه شد"
                  : `در انتظار تسویه (${faNum(
                      split.shares.filter((s) => s.paid).length
                    )} از ${faNum(split.shares.length)})`
                : "هزینه را با دوستان تقسیم کنید"}
            </div>
            <Button
              variant="cta"
              className="w-full gap-2"
              onClick={() => navigate(`/app/split/${booking.id}`)}
            >
              <Receipt className="size-4" />
              {split
                ? split.status === "settled"
                  ? "مشاهده فاکتور"
                  : "مشاهده وضعیت دُنگ"
                : "محاسبه دُنگ"}
            </Button>
          </div>
        )}

        {/* cancellation (upcoming) */}
        {isUpcoming && (
          <>
            <div className="mt-5 rounded-2xl bg-ink/[0.03] p-4">
              <div className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold text-ink/80">
                <Info className="size-4 text-muted-foreground" />
                قوانین لغو رزرو
              </div>
              <p className="text-xs leading-relaxed text-ink/60">
                لغو رایگان تا ۲۴ ساعت قبل از موعد. پس از آن، بیعانه با کسر کارمزد
                به کیف پول شما بازمی‌گردد.
              </p>
            </div>
            {cancel.isError && (
              <p className="mt-3 text-center text-xs text-destructive">
                لغو ناموفق بود. دوباره تلاش کنید.
              </p>
            )}
            <Button
              variant="ghost"
              className="mt-3 w-full text-destructive hover:bg-destructive/5"
              disabled={cancel.isPending}
              onClick={() => cancel.mutate(booking.id)}
            >
              {cancel.isPending ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                "کنسل کردن رزرو"
              )}
            </Button>
          </>
        )}

        {/* refund note (cancelled / rejected) */}
        {(booking.status === "cancelled" || booking.status === "rejected") && (
          <div className="mt-4 flex gap-2.5 rounded-2xl border border-destructive/15 bg-destructive/5 p-4">
            <RotateCcw className="mt-0.5 size-4 flex-none text-destructive" />
            <p className="text-xs leading-relaxed text-destructive/90">
              {booking.status === "rejected"
                ? "این درخواست توسط کافه رد شد."
                : "این رزرو لغو شده است."}
              {deposit > 0 &&
                booking.depositStatus === "paid" &&
                ` مبلغ ${toman(refund)} (بیعانه با کسر کارمزد) به کیف پول شما بازگردانده شد.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
