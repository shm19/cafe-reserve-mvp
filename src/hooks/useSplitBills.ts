import { useQuery } from "@tanstack/react-query";
import { getSplitBills, getSplitBillByBooking } from "@/services/splitBill";

export const splitKeys = {
  all: ["splitBills"] as const,
  list: () => [...splitKeys.all, "list"] as const,
  byBooking: (bookingId: string) =>
    [...splitKeys.all, "byBooking", bookingId] as const,
};

/** All split bills — used by My Bookings to look up each booking's split state. */
export function useAllSplitBills() {
  return useQuery({ queryKey: splitKeys.list(), queryFn: () => getSplitBills() });
}

/** The split bill for a single booking (or null if none yet). */
export function useSplitByBooking(bookingId: string) {
  return useQuery({
    queryKey: splitKeys.byBooking(bookingId),
    queryFn: async () => (await getSplitBillByBooking(bookingId))[0] ?? null,
    enabled: !!bookingId,
  });
}
