import { api, newId } from "@/api/client";
import type { Cafe, CafeTag, MenuItem, Photo, Review } from "@/types";

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

export async function createReview(input: {
  cafeId: string;
  userId: string;
  userName: string;
  rating: number;
  body: string;
}): Promise<Review> {
  const review = await api.post<Review>("/reviews", {
    id: newId("r"),
    ...input,
    createdAt: new Date().toISOString(),
  });
  // Recompute the cafe's aggregate rating + count so they aren't static.
  // (A real backend would do this server-side / via a trigger.)
  const all = await getCafeReviews(input.cafeId);
  const reviewCount = all.length;
  const avg = reviewCount
    ? all.reduce((sum, r) => sum + r.rating, 0) / reviewCount
    : 0;
  await api.patch<Cafe>(`/cafes/${input.cafeId}`, {
    reviewCount,
    rating: Math.round(avg * 10) / 10,
  });
  return review;
}

/** Owner replies to a customer review (or clears the reply). */
export const replyToReview = (id: string, ownerReply: string) =>
  api.patch<Review>(`/reviews/${id}`, { ownerReply });

export const removeReviewReply = (id: string) =>
  api.patch<Review>(`/reviews/${id}`, { ownerReply: null });

export function getCafePhotos(cafeId: string): Promise<Photo[]> {
  return api.get<Photo[]>("/photos", { cafeId });
}

export const addCafePhoto = (cafeId: string) =>
  api.post<Photo>("/photos", { id: newId("ph"), cafeId, url: "", isUgc: false });

export const deleteCafePhoto = (id: string) =>
  api.delete<unknown>(`/photos/${id}`);

/** Curated home rows, derived client-side from the cafe list. */
export async function getHomeSections() {
  const cafes = await getCafes();
  const byDistance = [...cafes].sort((a, b) => a.distanceM - b.distanceM);
  const byRating = [...cafes].sort((a, b) => b.rating - a.rating);
  const byReviews = [...cafes].sort((a, b) => b.reviewCount - a.reviewCount);
  return {
    featured: byRating.slice(0, 5), // hero row: best for reservation
    nearest: byDistance.slice(0, 6),
    groups: cafes.filter((c) => c.tags.includes("group_table")),
    cozy: cafes.filter((c) => c.tags.includes("quiet")),
    popular: byReviews.slice(0, 6), // most-reviewed
  };
}
