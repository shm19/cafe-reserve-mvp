import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PhoneFrame } from "@/components/shared/PhoneFrame";
import { BookingCafeCard } from "@/components/shared/BookingCafeCard";
import { InfoRow } from "@/components/shared/InfoRow";
import { useBooking } from "@/hooks/useBookings";
import { useUser } from "@/hooks/useAuth";
import { faNum, faDateTime } from "@/lib/utils";

/**
 * Public guest view of a booking invite (no auth). Reuses the shared cafe card
 * + info rows, but shows only the privacy-safe subset — no booking code,
 * deposit, status, or cancel controls.
 */
export default function GuestBooking() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: booking, isPending, isError } = useBooking(id);
  const { data: host } = useUser(booking?.userId ?? "");

  return (
    <PhoneFrame>
      {/* brand header */}
      <div className="flex flex-none items-center gap-2 px-4 pb-3 pt-4">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-base font-black text-white">
          ن
        </span>
        <span className="text-base font-black text-ink">نشست</span>
      </div>

      {isPending ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          در حال بارگذاری…
        </div>
      ) : isError || !booking ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
          <p className="text-sm text-destructive">این دعوت معتبر نیست.</p>
        </div>
      ) : (
        <>
          <div className="scrollbar-none flex-1 overflow-y-auto px-4 pb-4">
            {/* invite banner */}
            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-gradient-to-bl from-forest to-forest-deep p-4">
              <span className="flex size-10 flex-none items-center justify-center rounded-full bg-sage/25 text-lg font-black text-white">
                {host?.name?.charAt(0) ?? "م"}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-extrabold leading-relaxed text-white">
                  {host?.name ?? "میزبان"} شما را به این دورهمی دعوت کرده است
                </div>
                <div className="mt-0.5 text-xs text-white/65">
                  جزئیات قرار را اینجا ببینید
                </div>
              </div>
            </div>

            {/* cafe & location (shared) */}
            <BookingCafeCard cafe={booking.cafe} />

            {/* privacy-filtered details: no code, no deposit, no status */}
            <h2 className="mb-2.5 mt-5 px-1 text-sm font-extrabold text-ink">
              جزئیات قرار
            </h2>
            <div className="rounded-2xl border border-border/60 bg-paper px-4">
              <InfoRow label="تاریخ و ساعت">{faDateTime(booking.datetime)}</InfoRow>
              <InfoRow label="تعداد نفرات">{faNum(booking.partySize)} نفر</InfoRow>
              {booking.occasionNotes && (
                <div className="py-3">
                  <div className="mb-1.5 text-xs font-semibold text-ink/60">
                    درخواست ویژه
                  </div>
                  <p className="text-sm leading-relaxed text-ink/80">
                    {booking.occasionNotes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* acquisition CTA */}
          <div className="flex-none border-t border-border bg-paper px-4 pb-6 pt-3.5">
            <Button
              variant="cta"
              size="lg"
              className="w-full text-base"
              onClick={() => navigate("/auth")}
            >
              شما هم با نشست رزرو کنید
            </Button>
          </div>
        </>
      )}
    </PhoneFrame>
  );
}
