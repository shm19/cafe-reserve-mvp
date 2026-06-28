import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Share2, Check, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMarkSharePaid } from "@/hooks/useSplitBills";
import { useAuthStore } from "@/store/authStore";
import { cn, faNum, toman, avatarColor, faDateTime } from "@/lib/utils";
import type { BookingWithCafe, SplitBill } from "@/types";

export function SplitTracker({
  booking,
  split,
}: {
  booking?: BookingWithCafe;
  split: SplitBill;
}) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const markPaid = useMarkSharePaid();
  const [copied, setCopied] = useState(false);

  // The first share is the host (creator) and counts as settled.
  const settled = (paid: boolean, i: number) => paid || i === 0;
  const shareSum = split.shares.reduce((a, s) => a + s.amount, 0);
  const paidAmount = split.shares.reduce(
    (a, s, i) => (settled(s.paid, i) ? a + s.amount : a),
    0
  );
  const paidCount = split.shares.filter((s, i) => settled(s.paid, i)).length;
  const pct = shareSum > 0 ? Math.round((paidAmount / shareSum) * 100) : 0;

  function sendLink() {
    const link = `${location.origin}/app/split/${booking?.id ?? split.bookingId}`;
    navigator.clipboard?.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const subtitle = booking
    ? [booking.cafe?.name, faDateTime(booking.datetime), `${faNum(booking.partySize)} نفر`]
        .filter(Boolean)
        .join(" · ")
    : undefined;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* header */}
      <div className="flex flex-none items-center gap-3 px-4 pb-2 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex size-9 flex-none items-center justify-center rounded-xl border border-border bg-paper text-ink"
          aria-label="بازگشت"
        >
          <ArrowRight className="size-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg font-black text-ink">تقسیم دُنگ</h1>
          {subtitle && (
            <div className="truncate text-xs text-muted-foreground">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      <div className="scrollbar-none flex-1 overflow-y-auto px-4 pt-3">
        {/* total card */}
        <div className="rounded-2xl border border-border/70 bg-paper p-4 text-center shadow-sm">
          <div className="text-xs text-muted-foreground">مبلغ کل صورت‌حساب</div>
          <div className="mt-1 text-3xl font-black text-ink">
            {toman(shareSum)}
          </div>
        </div>

        {/* progress */}
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs text-ink/60">
            <span>
              <b className="text-primary">{faNum(paidCount)}</b> از{" "}
              {faNum(split.shares.length)} پرداخت شده
            </span>
            <span>
              {faNum(paidAmount.toLocaleString("en-US"))} از{" "}
              {faNum(shareSum.toLocaleString("en-US"))}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* participants */}
        <div className="mt-4 divide-y divide-border/60">
          {split.shares.map((s, i) => {
            const isHost = i === 0;
            const isYou = s.userOrName === user?.name;
            return (
              <div key={s.id} className="flex items-center gap-3 py-3">
                <div
                  className="flex size-10 flex-none items-center justify-center rounded-full text-sm font-extrabold text-white"
                  style={{ backgroundColor: avatarColor(s.userOrName) }}
                >
                  {s.userOrName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-ink">
                    {s.userOrName}
                    {isYou && (
                      <span className="text-xs font-medium text-muted-foreground">
                        {" "}
                        (شما)
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {toman(s.amount)}
                  </div>
                </div>
                {isHost ? (
                  <span className="flex-none rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground">
                    میزبان
                  </span>
                ) : s.paid ? (
                  <span className="flex-none inline-flex items-center gap-1 rounded-full bg-primary/12 px-3 py-1.5 text-xs font-bold text-primary">
                    <Check className="size-3.5" />
                    پرداخت‌شده
                  </span>
                ) : (
                  <button
                    onClick={() =>
                      markPaid.mutate({ billId: split.id, shareId: s.id })
                    }
                    disabled={markPaid.isPending}
                    className="flex-none inline-flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1.5 text-xs font-bold text-accent-ink disabled:opacity-50"
                  >
                    <Clock className="size-3.5" />
                    در انتظار
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* footer */}
      <div className="flex-none border-t border-border px-4 pb-6 pt-3">
        <p className="mb-2.5 px-2 text-center text-xs leading-relaxed text-muted-foreground">
          لینک پرداخت را بفرستید تا هر نفر سهم خودش را تسویه کند.
        </p>
        <Button variant="cta" size="lg" className="w-full gap-2" onClick={sendLink}>
          {copied ? (
            <>
              <Check className="size-5" />
              لینک کپی شد
            </>
          ) : (
            <>
              <Share2 className="size-5" />
              ارسال لینک پرداخت به گروه
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
