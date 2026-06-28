import { api, newId } from "@/api/client";
import type { Booking, Cafe, NoShowReport, OwnerBooking, User } from "@/types";

export async function getOwnerCafes(ownerId: string): Promise<Cafe[]> {
  return api.get<Cafe[]>("/cafes", { ownerId });
}

/** Bookings across the owner's cafes, with the guest embedded (_expand=user). */
export async function getOwnerBookings(ownerId: string): Promise<OwnerBooking[]> {
  const cafes = await getOwnerCafes(ownerId);
  const ids = new Set(cafes.map((c) => c.id));
  const all = await api.get<OwnerBooking[]>("/bookings", { _expand: "user" });
  return all.filter((b) => ids.has(b.cafeId));
}

export const updateCafe = (id: string, patch: Partial<Cafe>) =>
  api.patch<Cafe>(`/cafes/${id}`, patch);

export const approveBooking = (id: string) =>
  api.patch<Booking>(`/bookings/${id}`, { status: "confirmed" });

export const rejectBooking = (id: string) =>
  api.patch<Booking>(`/bookings/${id}`, { status: "rejected" });

export function addCafe(input: Partial<Cafe> & { name: string; ownerId: string }): Promise<Cafe> {
  const cafe: Cafe = {
    id: newId("c"),
    neighborhood: "",
    lat: 0,
    lng: 0,
    description: "",
    status: "pending",
    openHours: "",
    rating: 0,
    reviewCount: 0,
    distanceM: 0,
    tags: [],
    coverColor: "#E6DECF",
    ...input,
  };
  return api.post<Cafe>("/cafes", cafe);
}

/** Promote a customer to owner once they register their first cafe. */
export const becomeOwner = (userId: string) =>
  api.patch<User>(`/users/${userId}`, { role: "owner" });

export function reportNoShow(bookingId: string, cafeId: string, userId: string) {
  const report: NoShowReport = {
    id: newId("ns"),
    bookingId,
    cafeId,
    userId,
    createdAt: new Date().toISOString(),
  };
  return api.post<NoShowReport>("/noShowReports", report);
}
