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

/**
 * The user's most recent *past* outing (confirmed or completed, within the
 * last `withinDays`) — i.e. a gathering whose bill could still be split.
 * Returns null if there isn't one. Drives the home "split your dong" banner.
 */
export function findRecentOuting(
  bookings: Booking[],
  withinDays = 7
): Booking | null {
  const now = Date.now();
  const windowMs = withinDays * 24 * 60 * 60 * 1000;
  return (
    bookings
      .filter((b) => b.status === "completed" || b.status === "confirmed")
      .filter((b) => {
        const t = new Date(b.datetime).getTime();
        return t <= now && now - t <= windowMs;
      })
      .sort((a, b) => +new Date(b.datetime) - +new Date(a.datetime))[0] ?? null
  );
}
