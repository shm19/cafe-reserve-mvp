import { api, newId } from "@/lib/apiClient";
import type { Booking, Cafe, NoShowReport } from "@/types";

export async function getOwnerCafes(ownerId: string): Promise<Cafe[]> {
  return api.get<Cafe[]>("/cafes", { ownerId });
}

export async function getOwnerBookings(ownerId: string): Promise<Booking[]> {
  const cafes = await getOwnerCafes(ownerId);
  const ids = new Set(cafes.map((c) => c.id));
  const all = await api.get<Booking[]>("/bookings");
  return all.filter((b) => ids.has(b.cafeId));
}

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
