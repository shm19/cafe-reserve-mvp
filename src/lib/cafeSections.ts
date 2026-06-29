import { haversineM } from "@/lib/utils";
import type { Coords } from "@/store/locationStore";
import type { Cafe } from "@/types";

export type SectionKey = "featured" | "nearest" | "groups" | "cozy" | "popular";

/** Title + full-list selector for each home carousel. The list page reuses
 *  these so "همه" shows exactly the same group, just complete. */
export const SECTIONS: Record<
  SectionKey,
  { title: string; select: (cafes: Cafe[]) => Cafe[] }
> = {
  featured: {
    title: "بهترین کافه‌ها برای رزرو",
    select: (c) => [...c].sort((a, b) => b.rating - a.rating),
  },
  nearest: {
    title: "نزدیک‌ترین‌ها به شما",
    select: (c) => [...c].sort((a, b) => a.distanceM - b.distanceM),
  },
  groups: {
    title: "پای ثابت دورهمی‌ها",
    select: (c) => c.filter((x) => x.tags.includes("group_table")),
  },
  cozy: {
    title: "دنج و آرام",
    select: (c) => c.filter((x) => x.tags.includes("quiet")),
  },
  popular: {
    title: "محبوب‌ترین‌ها",
    select: (c) => [...c].sort((a, b) => b.reviewCount - a.reviewCount),
  },
};

export function isSectionKey(k?: string): k is SectionKey {
  return !!k && k in SECTIONS;
}

/** Override each cafe's distance with the real distance from the user's
 *  location, sorted nearest-first. No-op when we don't have coords. */
export function byRealDistance(cafes: Cafe[], coords: Coords | null): Cafe[] {
  if (!coords) return cafes;
  return cafes
    .map((c) => ({ ...c, distanceM: haversineM(coords.lat, coords.lng, c.lat, c.lng) }))
    .sort((a, b) => a.distanceM - b.distanceM);
}
