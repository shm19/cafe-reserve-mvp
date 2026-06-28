import { useNavigate } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { OwnerReviewCard } from "./OwnerReviewCard";
import { useOwnerCafe } from "@/hooks/useOwner";
import { useCafeReviews } from "@/hooks/useCafes";
import { useAuthStore } from "@/store/authStore";
import { faNum } from "@/lib/utils";

export default function OwnerReviews() {
  const navigate = useNavigate();
  const owner = useAuthStore((s) => s.user);
  const { data: cafe } = useOwnerCafe(owner?.id ?? "");
  const { data: reviews = [], isPending } = useCafeReviews(cafe?.id ?? "");

  return (
    <div className="px-5 pt-4">
      {/* header */}
      <div className="mb-3 flex items-center gap-3">
        <button
          onClick={() => navigate("/owner/profile")}
          className="flex size-9 items-center justify-center rounded-xl border border-border bg-paper text-ink"
          aria-label="بازگشت"
        >
          <ArrowRight className="size-5" />
        </button>
        <h1 className="text-base font-black text-ink">نظرات مشتریان</h1>
      </div>

      {cafe && (
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-bold text-accent-ink">
          <Star className="size-3 fill-accent text-accent" />
          {faNum(cafe.rating)} از {faNum(cafe.reviewCount)} نظر
        </div>
      )}

      {isPending ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          در حال بارگذاری…
        </p>
      ) : reviews.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          هنوز نظری ثبت نشده است.
        </p>
      ) : (
        <div className="flex flex-col gap-3 pb-4">
          {reviews.map((r) => (
            <OwnerReviewCard key={r.id} review={r} cafeId={cafe!.id} />
          ))}
        </div>
      )}
    </div>
  );
}
