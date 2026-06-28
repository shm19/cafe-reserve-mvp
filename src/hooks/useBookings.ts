import { useQuery } from "@tanstack/react-query";
import { getMyBookings } from "@/services/bookings";

export const bookingKeys = {
  all: ["bookings"] as const,
  mine: (userId: string) => [...bookingKeys.all, "mine", userId] as const,
};

export function useMyBookings(userId: string) {
  return useQuery({
    queryKey: bookingKeys.mine(userId),
    queryFn: () => getMyBookings(userId),
    enabled: !!userId,
  });
}
