import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReportIssue } from "@/hooks/useOwner";
import { cn } from "@/lib/utils";
import type { IssueReason, OwnerBooking } from "@/types";

const REASONS: { value: IssueReason; label: string }[] = [
  { value: "unpaid_bill", label: "عدم پرداخت صورت‌حساب" },
  { value: "disturbance", label: "ایجاد مزاحمت/خسارت" },
];

/** Bottom-sheet form: owner reports user misconduct on a past booking so
 *  platform admins can act on the account. */
export function IssueSheet({
  booking,
  onClose,
}: {
  booking: OwnerBooking;
  onClose: () => void;
}) {
  const report = useReportIssue();
  const [reason, setReason] = useState<IssueReason | null>(null);
  const [note, setNote] = useState("");

  if (report.isSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 px-1 py-6 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary/12">
          <Check className="size-6 text-primary" />
        </span>
        <p className="text-sm font-extrabold text-ink">گزارش شما ثبت شد</p>
        <p className="text-xs text-muted-foreground">
          تیم پشتیبانی موضوع را بررسی می‌کند.
        </p>
        <Button variant="outline" className="mt-1 w-full" onClick={onClose}>
          بستن
        </Button>
      </div>
    );
  }

  return (
    <div className="px-1">
      <h2 className="text-lg font-black text-ink">گزارش مشکل</h2>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">
        درباره مهمان «{booking.user?.name ?? "مهمان"}»
      </p>

      <div className="mt-4 flex flex-col gap-2.5">
        {REASONS.map((r) => {
          const active = reason === r.value;
          return (
            <button
              key={r.value}
              onClick={() => setReason(r.value)}
              className={cn(
                "flex items-center justify-between gap-2 rounded-2xl border px-4 py-3 text-right text-sm font-bold",
                active
                  ? "border-primary/40 bg-primary/[0.07] text-primary"
                  : "border-border bg-paper text-ink/80"
              )}
            >
              {r.label}
              <span
                className={cn(
                  "flex size-5 flex-none items-center justify-center rounded-full border",
                  active ? "border-primary bg-primary text-white" : "border-border"
                )}
              >
                {active && <Check className="size-3.5" />}
              </span>
            </button>
          );
        })}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        placeholder="توضیح بیشتر (اختیاری)"
        className="mt-3 w-full resize-none rounded-xl border border-border bg-paper p-3 text-sm leading-relaxed text-ink outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/70"
      />

      {report.isError && (
        <p className="mt-2 text-center text-xs text-destructive">
          ثبت گزارش ناموفق بود. دوباره تلاش کنید.
        </p>
      )}

      <Button
        variant="cta"
        size="lg"
        className="mt-4 w-full"
        disabled={!reason || report.isPending}
        onClick={() =>
          reason &&
          report.mutate({
            bookingId: booking.id,
            cafeId: booking.cafeId,
            userId: booking.userId,
            reason,
            note: note.trim() || undefined,
          })
        }
      >
        {report.isPending ? <Loader2 className="size-5 animate-spin" /> : "ثبت گزارش"}
      </Button>
    </div>
  );
}
