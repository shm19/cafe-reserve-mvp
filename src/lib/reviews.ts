import type { Review } from "@/types";

export type ReviewSort = "popular" | "newest";

export const REVIEW_SORT_LABELS: Record<ReviewSort, string> = {
  popular: "محبوب‌ترین",
  newest: "جدیدترین",
};

/** Sort reviews by highest rating (then newest) or strictly newest. */
export function sortReviews(reviews: Review[], sort: ReviewSort): Review[] {
  const arr = [...reviews];
  if (sort === "newest") {
    arr.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  } else {
    arr.sort(
      (a, b) =>
        b.rating - a.rating || +new Date(b.createdAt) - +new Date(a.createdAt)
    );
  }
  return arr;
}
