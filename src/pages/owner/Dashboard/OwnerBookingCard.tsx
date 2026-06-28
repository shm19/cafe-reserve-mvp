import { Users, Check, UserX, Phone, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOwnerActions } from "@/hooks/useOwner";
import { faNum } from "@/lib/utils";
import type { OwnerBooking } from "@/types";

/** A single reservation on the owner dashboard: guest info + approve/reject
 *  (pending) or confirmed status + no-show. */
export function OwnerBookingCard({
  booking,
  ownerId,
}: {
  booking: OwnerBooking;
  ownerId: string;
}) {
  const { approve, reject, noShow } = useOwnerActions(ownerId);
  const busy = approve.isPending || reject.isPending;

  return (
    <div className="rounded-2xl border border-border/60 bg-paper p-3.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-extrabold text-ink">
            {booking.user?.name ?? "مهمان"}
          </span>
          {booking.user?.phone && (
            <a
              href={`tel:${booking.user.phone}`}
              className="flex size-7 items-center justify-center rounded-lg border border-primary/20 bg-primary/[0.08] text-primary"
            >
              <Phone className="size-3.5" />
            </a>
          )}
        </div>
        <span className="flex items-center gap-1.5 text-xs font-bold text-ink/60">
          <Users className="size-3.5 text-sage" />
          {faNum(booking.partySize)} نفر
        </span>
      </div>

      {booking.occasionNotes && (
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-accent/15 px-2.5 py-1 text-xs font-bold text-accent-ink">
          <Star className="size-3" />
          {booking.occasionNotes}
        </div>
      )}

      {booking.status === "pending" ? (
        <div className="mt-3 flex gap-2.5">
          <Button
            variant="outline"
            className="flex-1"
            disabled={busy}
            onClick={() => reject.mutate(booking.id)}
          >
            رد درخواست
          </Button>
          <Button
            variant="cta"
            className="flex-1"
            disabled={busy}
            onClick={() => approve.mutate(booking.id)}
          >
            {approve.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "تأیید رزرو"
            )}
          </Button>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1.5 text-xs font-bold text-primary">
            <Check className="size-3.5" />
            تأیید‌شده
          </span>
          <button
            onClick={() =>
              noShow.mutate({
                bookingId: booking.id,
                cafeId: booking.cafeId,
                userId: booking.userId,
              })
            }
            disabled={noShow.isPending}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground disabled:opacity-50"
          >
            <UserX className="size-4" />
            {noShow.isSuccess ? "ثبت شد" : "مشتری نیامد"}
          </button>
        </div>
      )}
    </div>
  );
}
