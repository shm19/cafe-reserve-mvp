// Domain model — this is the API contract. db.json matches these shapes,
// and the real backend will implement them later.

export type Role = "user" | "owner" | "admin";

export type CafeTag =
  | "quiet"
  | "outdoor"
  | "power_outlet"
  | "group_table"
  | "parking"
  | "football"
  | "date"
  | "work";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "cancelled"
  | "completed";

export type PaymentStatus = "none" | "pending" | "paid" | "refunded";

export interface User {
  id: string;
  phone: string;
  name: string;
  role: Role;
  points: number;
}

export interface Photo {
  id: string;
  cafeId: string;
  url: string;
  isUgc: boolean;
  uploadedBy?: string;
}

export interface MenuItem {
  id: string;
  cafeId: string;
  name: string;
  price: number;
}

export interface Review {
  id: string;
  cafeId: string;
  userId: string;
  userName: string;
  rating: number;
  body: string;
  createdAt: string;
  ownerReply?: string;
}

export interface Cafe {
  id: string;
  name: string;
  neighborhood: string;
  lat: number;
  lng: number;
  description: string;
  status: "pending" | "approved";
  ownerId?: string;
  iban?: string;
  address?: string;
  phone?: string;
  openHours: string;
  // Deposit policy: a flat `depositAmount` is required when the party size
  // exceeds `depositThreshold`. Cafes without a threshold never take a deposit.
  depositThreshold?: number;
  depositAmount?: number;
  rating: number;
  reviewCount: number;
  distanceM: number;
  tags: CafeTag[];
  coverColor: string; // placeholder swatch until real photos
  socialLinks?: { instagram?: string; telegram?: string };
}

export interface Share {
  id: string;
  splitBillId: string;
  userOrName: string;
  amount: number;
  paid: boolean;
  paymentRef?: string;
}

export interface SplitBill {
  id: string;
  bookingId: string;
  total: number;
  tax: number;
  createdBy: string;
  status: "open" | "settled";
  shares: Share[];
}

export interface Invite {
  id: string;
  bookingId: string;
  token: string;
  joinedUserIds: string[];
}

export interface Booking {
  id: string;
  cafeId: string;
  userId: string;
  datetime: string;
  partySize: number;
  occasionNotes?: string;
  status: BookingStatus;
  depositRequired: boolean;
  depositStatus: PaymentStatus;
  createdAt: string;
}

/** A booking with its cafe embedded (json-server `_expand=cafe`, or a real
 *  backend join). Used by lists that show cafe info per booking. */
export interface BookingWithCafe extends Booking {
  cafe?: Cafe;
}

export interface NoShowReport {
  id: string;
  bookingId: string;
  cafeId: string;
  userId: string;
  createdAt: string;
}
