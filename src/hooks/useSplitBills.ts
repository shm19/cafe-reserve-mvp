import { useQuery } from "@tanstack/react-query";
import { getSplitBills } from "@/services/splitBill";

export const splitKeys = {
  all: ["splitBills"] as const,
  list: () => [...splitKeys.all, "list"] as const,
};

/** All split bills — used by My Bookings to look up each booking's split state. */
export function useAllSplitBills() {
  return useQuery({ queryKey: splitKeys.list(), queryFn: () => getSplitBills() });
}
