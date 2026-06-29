import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Info, RotateCcw, Receipt, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingCafeCard } from "@/components/shared/BookingCafeCard";
import { InfoRow } from "@/components/shared/InfoRow";
import { useBooking, useCancelBooking } from "@/hooks/useBookings";
import { useSplitByBooking } from "@/hooks/useSplitBills";
import { cn, faNum, faDateTime } from "@/lib/utils";
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
        <BookingCafeCard cafe={cafe} />

        {/* core details */}
        <h2 className="mb-2.5 mt-5 px-1 text-sm font-extrabold text-ink">
          جزئیات رزرو
        </h2>
        <div className="rounded-2xl border border-border/60 bg-paper px-4">
          <InfoRow label="کد رزرو">
            <span dir="ltr">#{booking.id}</span>
          </InfoRow>
          <InfoRow label="تاریخ و ساعت">{faDateTime(booking.datetime)}</InfoRow>
          <InfoRow label="تعداد نفرات">{faNum(booking.partySize)} نفر</InfoRow>
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
                رزرو رایگان است و هر زمان می‌توانید آن را لغو کنید. لطفاً در صورت
                انصراف، رزرو خود را لغو کنید تا میز برای دیگران آزاد شود.
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
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
