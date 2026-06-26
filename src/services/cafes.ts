import { api } from "@/lib/apiClient";
import type { Cafe, CafeTag, MenuItem, Review } from "@/types";

export interface CafeFilters {
  neighborhood?: string;
  tag?: CafeTag;
  q?: string;
}

export async function getCafes(filters: CafeFilters = {}): Promise<Cafe[]> {
  const cafes = await api.get<Cafe[]>("/cafes", {
    neighborhood: filters.neighborhood,
    status: "approved",
  });
  let result = cafes;
  if (filters.tag) result = result.filter((c) => c.tags.includes(filters.tag!));
  if (filters.q) {
    const q = filters.q.trim();
    result = result.filter(
      (c) => c.name.includes(q) || c.neighborhood.includes(q)
    );
  }
  return result;
}

export function getCafe(id: string): Promise<Cafe> {
  return api.get<Cafe>(`/cafes/${id}`);
}

export function getCafeMenu(cafeId: string): Promise<MenuItem[]> {
  return api.get<MenuItem[]>("/menuItems", { cafeId });
}

export function getCafeReviews(cafeId: string): Promise<Review[]> {
  return api.get<Review[]>("/reviews", { cafeId });
}

/** Curated home rows, derived client-side from the cafe list. */
export async function getHomeSections() {
  const cafes = await getCafes();
  const byDistance = [...cafes].sort((a, b) => a.distanceM - b.distanceM);
  const byRating = [...cafes].sort((a, b) => b.rating - a.rating);
  return {
    nearest: byDistance.slice(0, 6),
    groups: cafes.filter((c) => c.tags.includes("group_table")),
    cozy: cafes.filter((c) => c.tags.includes("quiet")),
    popular: byRating.slice(0, 6),
  };
}
