import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Coords = { lat: number; lng: number };

/** The user's last known location — district label + coordinates. Persisted so
 *  the home shows their saved district until they relocate. */
interface LocationState {
  district: string | null;
  coords: Coords | null;
  setLocation: (district: string | null, coords: Coords) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      district: null,
      coords: null,
      setLocation: (district, coords) => set({ district, coords }),
    }),
    { name: "cafe-reserve-location" }
  )
);
