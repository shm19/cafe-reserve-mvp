import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOwnerBookings,
  getOwnerCafes,
  approveBooking,
  rejectBooking,
  reportNoShow,
} from "@/api/owner";

export const ownerKeys = {
  all: ["owner"] as const,
  bookings: (ownerId: string) =>
    [...ownerKeys.all, "bookings", ownerId] as const,
  cafe: (ownerId: string) => [...ownerKeys.all, "cafe", ownerId] as const,
};

export function useOwnerBookings(ownerId: string) {
  return useQuery({
    queryKey: ownerKeys.bookings(ownerId),
    queryFn: () => getOwnerBookings(ownerId),
    enabled: !!ownerId,
  });
}

/** The owner's primary cafe (first one). */
export function useOwnerCafe(ownerId: string) {
  return useQuery({
    queryKey: ownerKeys.cafe(ownerId),
    queryFn: async () => (await getOwnerCafes(ownerId))[0] ?? null,
    enabled: !!ownerId,
  });
}

/** Approve / reject / no-show — all refetch the owner's bookings on success. */
export function useOwnerActions(ownerId: string) {
  const qc = useQueryClient();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ownerKeys.bookings(ownerId) });

  const approve = useMutation({
    mutationFn: (id: string) => approveBooking(id),
    onSuccess: invalidate,
  });
  const reject = useMutation({
    mutationFn: (id: string) => rejectBooking(id),
    onSuccess: invalidate,
  });
  const noShow = useMutation({
    mutationFn: (v: { bookingId: string; cafeId: string; userId: string }) =>
      reportNoShow(v.bookingId, v.cafeId, v.userId),
    onSuccess: invalidate,
  });

  return { approve, reject, noShow };
}
