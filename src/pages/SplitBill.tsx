import { useParams } from "react-router-dom";
import { SplitSetup } from "@/components/split/SplitSetup";
import { SplitTracker } from "@/components/split/SplitTracker";
import { useBooking } from "@/hooks/useBookings";
import { useSplitByBooking } from "@/hooks/useSplitBills";

/**
 * Split-bill screen. Two modes off the same route:
 *  - no split yet  -> SplitSetup (calculate + create)
 *  - split exists  -> SplitTracker (progress + mark paid)
 */
export default function SplitBill() {
  const { bookingId = "" } = useParams();
  const { data: booking, isPending: bookingLoading } = useBooking(bookingId);
  const { data: split, isPending: splitLoading } = useSplitByBooking(bookingId);

  if (bookingLoading || splitLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        در حال بارگذاری…
      </div>
    );
  }

  return split ? (
    <SplitTracker booking={booking} split={split} />
  ) : (
    <SplitSetup booking={booking} />
  );
}
