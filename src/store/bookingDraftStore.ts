import { create } from "zustand";

interface BookingDraft {
  cafeId?: string;
  datetime?: string;
  partySize: number;
  occasionNotes: string;
  set: (patch: Partial<Omit<BookingDraft, "set" | "reset">>) => void;
  reset: () => void;
}

const initial = { cafeId: undefined, datetime: undefined, partySize: 2, occasionNotes: "" };

export const useBookingDraft = create<BookingDraft>((set) => ({
  ...initial,
  set: (patch) => set(patch),
  reset: () => set(initial),
}));
