import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOwnerBookings,
  getOwnerCafes,
  addCafe,
  becomeOwner,
  updateCafe,
  approveBooking,
  rejectBooking,
  reportNoShow,
} from "@/api/owner";
import { useAuthStore } from "@/store/authStore";
import type { Cafe } from "@/types";

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

/** Register the user's first cafe, then promote them to owner (updates the
 *  session so the manager view unlocks immediately). */
export function useAddCafe(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<Cafe> & { name: string }) => {
      const cafe = await addCafe({ ...input, ownerId: userId });
      const user = await becomeOwner(userId);
      return { cafe, user };
    },
    onSuccess: ({ user }) => {
      useAuthStore.getState().setUser(user);
      qc.invalidateQueries({ queryKey: ownerKeys.cafe(userId) });
      qc.invalidateQueries({ queryKey: ["cafes"] });
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateCafe(ownerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: string; patch: Partial<Cafe> }) =>
      updateCafe(v.id, v.patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ownerKeys.cafe(ownerId) });
      qc.invalidateQueries({ queryKey: ["cafes"] }); // refresh customer-facing data
    },
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
