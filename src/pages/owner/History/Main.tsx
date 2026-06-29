import { useState } from "react";
import { Check, UserX, Flag, Users } from "lucide-react";
import { BottomSheet } from "@/components/shared/BottomSheet";
import { IssueSheet } from "./IssueSheet";
import { useOwnerBookings, useNoShowBookingIds } from "@/hooks/useOwner";
import { useAuthStore } from "@/store/authStore";
import { cn, faNum, faDateTime } from "@/lib/utils";
import type { OwnerBooking } from "@/types";

export default function OwnerHistory() {
  const owner = useAuthStore((s) => s.user);
  const { data: bookings = [] } = useOwnerBookings(owner?.id ?? "");
  const { data: noShowIds } = useNoShowBookingIds();
  const [reportFor, setReportFor] = useState<OwnerBooking | null>(null);

  const now = Date.now();
  const history = bookings
    .filter(
      (b) =>
        (b.status === "confirmed" || b.status === "completed") &&
        new Date(b.datetime).getTime() < now
    )
    .sort((a, b) => +new Date(b.datetime) - +new Date(a.datetime));

  return (
    <div className="px-5 pt-5">
      <h1 className="mb-4 text-2xl font-black text-ink">تاریخچه رزروها</h1>

      {history.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          هنوز رزرو گذشته‌ای ثبت نشده است.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {history.map((b) => {
            const noShow = noShowIds?.has(b.id) ?? false;
            return (
              <div key={b.id} className="rounded-2xl border border-border/60 bg-paper p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[15px] font-extrabold text-ink">
                      {b.user?.name ?? "مهمان"}
                    </div>
                    <div className="mt-1 text-xs font-semibold text-muted-foreground">
                      {faDateTime(b.datetime)}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <Users className="size-3.5 text-sage" />
                      {faNum(b.partySize)} نفر
                    </div>
                  </div>
                  <span
                    className={cn(
                      "inline-flex flex-none items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold",
                      noShow
                        ? "bg-destructive/10 text-destructive"
                        : "bg-primary/12 text-primary"
                    )}
                  >
                    {noShow ? <UserX className="size-3.5" /> : <Check className="size-3.5" />}
                    {noShow ? "مشتری نیامد" : "حضور یافت"}
                  </span>
                </div>

                <div className="mt-3 border-t border-border/50 pt-2.5">
                  <button
                    onClick={() => setReportFor(b)}
                    className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground"
                  >
                    <Flag className="size-4 text-cta" />
                    گزارش مشکل
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BottomSheet open={!!reportFor} onClose={() => setReportFor(null)}>
        {reportFor && <IssueSheet booking={reportFor} onClose={() => setReportFor(null)} />}
      </BottomSheet>
    </div>
  );
}
