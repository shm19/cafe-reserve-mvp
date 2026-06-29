import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Tracks which notifications the user has cleared. Persisted so a dismissed
 *  alert stays gone across sessions. */
interface NotificationState {
  dismissed: string[];
  dismiss: (id: string) => void;
  clear: (ids: string[]) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      dismissed: [],
      dismiss: (id) =>
        set((s) => (s.dismissed.includes(id) ? s : { dismissed: [...s.dismissed, id] })),
      clear: (ids) =>
        set((s) => ({ dismissed: [...new Set([...s.dismissed, ...ids])] })),
    }),
    { name: "cafe-reserve-notif" }
  )
);
