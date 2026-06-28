import { api, newId } from "@/api/client";
import type { Booking, BookingStatus, BookingWithCafe, Cafe } from "@/types";

type DepositPolicy = Pick<Cafe, "depositThreshold" | "depositAmount">;

export interface NewBookingInput {
  cafeId: string;
  userId: string;
  datetime: string;
  partySize: number;
  occasionNotes?: string;
  depositRequired: boolean;
}

export function getMyBookings(userId: string): Promise<BookingWithCafe[]> {
  // _expand=cafe makes json-server embed each booking's cafe (via the cafeId
  // foreign key) — one request, no separate cafe lookup. A real backend would
  // do the equivalent join.
  return api.get<BookingWithCafe[]>("/bookings", { userId, _expand: "cafe" });
}

export function getBooking(id: string): Promise<BookingWithCafe> {
  return api.get<BookingWithCafe>(`/bookings/${id}`, { _expand: "cafe" });
}

/** A deposit is required when the party exceeds the cafe's threshold.
 *  Cafes without a threshold never take a deposit. */
export function requiresDeposit(
  cafe: DepositPolicy | undefined,
  partySize: number
): boolean {
  return cafe?.depositThreshold != null && partySize > cafe.depositThreshold;
}

/** The flat deposit for this cafe when required, else 0. */
export function depositAmount(
  cafe: DepositPolicy | undefined,
  partySize: number
): number {
  return requiresDeposit(cafe, partySize) ? cafe?.depositAmount ?? 0 : 0;
}

export function createBooking(input: NewBookingInput): Promise<Booking> {
  const booking: Booking = {
    id: newId("b"),
    ...input,
    status: "pending",
    depositStatus: input.depositRequired ? "pending" : "none",
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
 * Split a user's bookings into upcoming vs. past for the "my bookings" tabs.
 * Cancelled/rejected are dropped. Upcoming = soonest first; past = newest first.
 */
export function bucketBookings<T extends Booking>(
  bookings: T[]
): { upcoming: T[]; past: T[] } {
  const now = Date.now();
  const upcoming: T[] = [];
  const past: T[] = [];
  for (const b of bookings) {
    if (b.status === "cancelled" || b.status === "rejected") continue;
    const t = new Date(b.datetime).getTime();
    if (b.status === "completed" || t < now) past.push(b);
    else upcoming.push(b);
  }
  upcoming.sort((a, b) => +new Date(a.datetime) - +new Date(b.datetime));
  past.sort((a, b) => +new Date(b.datetime) - +new Date(a.datetime));
  return { upcoming, past };
}

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
