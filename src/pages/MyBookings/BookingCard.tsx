import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, Share2, Receipt, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, faNum, faDateTime } from "@/lib/utils";
import type { BookingWithCafe, SplitBill } from "@/types";

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  confirmed: { label: "تأیید‌شده", className: "bg-primary/12 text-primary" },
  pending: { label: "در انتظار تأیید", className: "bg-accent/20 text-accent-ink" },
  done: { label: "انجام شده", className: "bg-muted text-muted-foreground" },
};

export function BookingCard({
  booking,
  split,
  upcoming,
}: {
  booking: BookingWithCafe;
  split?: SplitBill;
  upcoming: boolean;
}) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const cafe = booking.cafe;

  function copyInvite() {
    const link = `${location.origin}/invite/${booking.id}`;
    navigator.clipboard?.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  const badge = upcoming
    ? STATUS_BADGE[booking.status] ?? STATUS_BADGE.pending
    : STATUS_BADGE.done;

  const paid = split?.shares.filter((s) => s.paid).length ?? 0;
  const total = split?.shares.length ?? 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-paper shadow-sm">
      {/* info — tap to open details */}
      <button
        onClick={() => navigate(`/app/booking/${booking.id}`)}
        className="flex w-full gap-3 p-4 text-right"
      >
        <div
          className="size-16 flex-none rounded-xl"
          style={{ backgroundColor: cafe?.coverColor ?? "#E0D8CB" }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <span className="truncate text-base font-extrabold text-ink">
              {cafe?.name ?? "کافه"}
            </span>
            <span
              className={cn(
                "flex-none rounded-full px-2.5 py-1 text-xs font-bold",
                badge.className
              )}
            >
              {badge.label}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-ink/60">
            <Calendar className="size-3.5 text-sage" />
            {faDateTime(booking.datetime)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-ink/60">
            <Users className="size-3.5 text-sage" />
            {faNum(booking.partySize)} نفر
          </div>
        </div>
      </button>

      {/* action area */}
      <div className="px-4 pb-4">
        {upcoming && (
          <Button variant="cta" className="w-full gap-2" onClick={copyInvite}>
            {copied ? (
              <>
                <Check className="size-4" />
                لینک دعوت کپی شد
              </>
            ) : (
              <>
                <Share2 className="size-4" />
                ارسال لینک دعوت
              </>
            )}
          </Button>
        )}

        {!upcoming && !split && (
          <Button
            variant="cta"
            className="w-full gap-2"
            onClick={() => navigate(`/app/split/${booking.id}`)}
          >
            <Receipt className="size-4" />
            محاسبه و تقسیم دُنگ
          </Button>
        )}

        {!upcoming && split?.status === "open" && (
          <>
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-cta-ink">
              <span className="size-2 rounded-full bg-cta" />
              در انتظار تسویه ({faNum(paid)} از {faNum(total)})
            </div>
            <Button
              variant="outline"
              className="w-full gap-2 border-cta text-cta"
              onClick={() => navigate(`/app/split/${booking.id}`)}
            >
              <Receipt className="size-4" />
              مشاهده وضعیت دُنگ
            </Button>
          </>
        )}

        {!upcoming && split?.status === "settled" && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <span className="size-2 rounded-full bg-primary" />
              تسویه کامل
            </span>
            <button
              onClick={() => navigate(`/app/split/${booking.id}`)}
              className="flex items-center gap-1.5 text-xs font-bold text-ink/60"
            >
              <FileText className="size-4" />
              مشاهده فاکتور
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
