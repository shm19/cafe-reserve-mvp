import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getHomeSections,
  getCafe,
  getCafeMenu,
  getCafeReviews,
  replyToReview,
  removeReviewReply,
} from "@/api/cafes";

/**
 * Query-key factory. Every cache entry for cafes is keyed off here, so
 * invalidation later is precise (e.g. queryClient.invalidateQueries({ queryKey: cafeKeys.detail(id) })).
 * Keep keys serializable arrays — react-query compares them structurally.
 */
export const cafeKeys = {
  all: ["cafes"] as const,
  home: () => [...cafeKeys.all, "home"] as const,
  detail: (id: string) => [...cafeKeys.all, "detail", id] as const,
  menu: (id: string) => [...cafeKeys.all, "menu", id] as const,
  reviews: (id: string) => [...cafeKeys.all, "reviews", id] as const,
};

export function useHomeSections() {
  return useQuery({
    queryKey: cafeKeys.home(),
    queryFn: () => getHomeSections(),
  });
}

export function useCafe(id: string) {
  return useQuery({
    queryKey: cafeKeys.detail(id),
    queryFn: () => getCafe(id),
    enabled: !!id, // don't fire until we actually have an id
  });
}

export function useCafeMenu(id: string) {
  return useQuery({
    queryKey: cafeKeys.menu(id),
    queryFn: () => getCafeMenu(id),
    enabled: !!id,
  });
}

export function useCafeReviews(id: string) {
  return useQuery({
    queryKey: cafeKeys.reviews(id),
    queryFn: () => getCafeReviews(id),
    enabled: !!id,
  });
}

/** Owner-side: reply to / remove a reply on a review, then refetch that cafe's reviews. */
export function useReviewReply(cafeId: string) {
  const qc = useQueryClient();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: cafeKeys.reviews(cafeId) });
  const reply = useMutation({
    mutationFn: (v: { id: string; text: string }) => replyToReview(v.id, v.text),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => removeReviewReply(id),
    onSuccess: invalidate,
  });
  return { reply, remove };
}
