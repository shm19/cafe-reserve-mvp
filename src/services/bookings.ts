import { api, newId } from "@/lib/apiClient";
import type { Booking, BookingStatus } from "@/types";

const DEPOSIT_THRESHOLD = 6; // party size at/above which a deposit is required

export interface NewBookingInput {
  cafeId: string;
  userId: string;
  datetime: string;
  partySize: number;
  occasionNotes?: string;
}

export function getMyBookings(userId: string): Promise<Booking[]> {
  return api.get<Booking[]>("/bookings", { userId });
}

export function getBooking(id: string): Promise<Booking> {
  return api.get<Booking>(`/bookings/${id}`);
}

export function requiresDeposit(partySize: number): boolean {
  return partySize >= DEPOSIT_THRESHOLD;
}

export function createBooking(input: NewBookingInput): Promise<Booking> {
  const depositRequired = requiresDeposit(input.partySize);
  const booking: Booking = {
    id: newId("b"),
    ...input,
    status: "pending",
    depositRequired,
    depositStatus: depositRequired ? "pending" : "none",
    createdAt: new Date().toISOString(),
  };
  return api.post<Booking>("/bookings", booking);
}

export function setBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking> {
  return api.patch<Booking>(`/bookings/${id}`, { status });
}

export const cancelBooking = (id: string) =>
  setBookingStatus(id, "cancelled");
