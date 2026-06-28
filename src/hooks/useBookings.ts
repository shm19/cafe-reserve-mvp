import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyBookings,
  getBooking,
  createBooking,
  cancelBooking,
  type NewBookingInput,
} from "@/api/bookings";

export const bookingKeys = {
  all: ["bookings"] as const,
  mine: (userId: string) => [...bookingKeys.all, "mine", userId] as const,
  detail: (id: string) => [...bookingKeys.all, "detail", id] as const,
};

export function useMyBookings(userId: string) {
  return useQuery({
    queryKey: bookingKeys.mine(userId),
    queryFn: () => getMyBookings(userId),
    enabled: !!userId,
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: () => getBooking(id),
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: NewBookingInput) => createBooking(input),
    // Refetch the user's bookings so "my bookings" and the home banner update.
    onSuccess: (booking) =>
      qc.invalidateQueries({ queryKey: bookingKeys.mine(booking.userId) }),
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    onSuccess: (booking) => {
      qc.invalidateQueries({ queryKey: bookingKeys.detail(booking.id) });
      qc.invalidateQueries({ queryKey: bookingKeys.mine(booking.userId) });
    },
  });
}
