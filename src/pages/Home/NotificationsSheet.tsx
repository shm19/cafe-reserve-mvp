import { useNavigate } from "react-router-dom";
import { Check, X, BellOff } from "lucide-react";
import { useNotificationStore } from "@/store/notificationStore";
import { cn, faDateTime } from "@/lib/utils";
import type { BookingWithCafe } from "@/types";

/** Notifications = reservations the cafe has approved or rejected, newest first.
 *  Each can be cleared individually, and the page stays behind the panel. */
export function NotificationsSheet({
  bookings,
  onClose,
}: {
  bookings: BookingWithCafe[];
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const dismissed = useNotificationStore((s) => s.dismissed);
  const dismiss = useNotificationStore((s) => s.dismiss);
  const clear = useNotificationStore((s) => s.clear);

  const items = bookings
    .filter(
      (b) =>
        (b.status === "confirmed" || b.status === "rejected") &&
        !dismissed.includes(b.id)
    )
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return (
    <>
      {/* header */}
      <div className="flex flex-none items-center justify-between gap-3 px-5 pb-3 pt-2">
        <h2 className="text-lg font-black text-ink">اعلان‌ها</h2>
        {items.length > 0 && (
          <button
            onClick={() => clear(items.map((b) => b.id))}
            className="text-xs font-bold text-primary"
          >
            پاک کردن همه
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
          <BellOff className="size-7 text-muted-foreground" />
          <p className="text-sm font-semibold text-muted-foreground">
            اعلان جدیدی ندارید
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5 overflow-y-auto scrollbar-none px-5">
          {items.map((b) => {
            const approved = b.status === "confirmed";
            return (
              <li key={b.id} className="relative">
                <button
                  onClick={() => {
                    onClose();
                    navigate(`/app/booking/${b.id}`);
                  }}
                  className="flex w-full items-start gap-3 rounded-2xl border border-border/60 bg-paper p-3.5 pl-10 text-right"
                >
                  <span
                    className={cn(
                      "flex size-9 flex-none items-center justify-center rounded-full",
                      approved ? "bg-primary/12" : "bg-destructive/10"
                    )}
                  >
                    {approved ? (
                      <Check className="size-4 text-primary" />
                    ) : (
                      <X className="size-4 text-destructive" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-extrabold text-ink">
                      {approved
                        ? `رزرو شما در «${b.cafe?.name ?? "کافه"}» تأیید شد`
                        : `رزرو شما در «${b.cafe?.name ?? "کافه"}» رد شد`}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-muted-foreground">
                      {faDateTime(b.datetime)}
                    </span>
                  </span>
                </button>
                {/* clear this notification */}
                <button
                  onClick={() => dismiss(b.id)}
                  aria-label="پاک کردن اعلان"
                  className="absolute left-2 top-2 flex size-6 items-center justify-center rounded-full bg-ink/5 text-muted-foreground"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
