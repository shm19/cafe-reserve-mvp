import { Star } from "lucide-react";
import { cn, faDate, avatarColor } from "@/lib/utils";
import type { Review } from "@/types";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex" dir="ltr" aria-label={`${rating} از ۵`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < Math.round(rating)
              ? "fill-accent text-accent"
              : "fill-transparent text-border"
          )}
        />
      ))}
    </div>
  );
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-paper p-4">
      <div className="flex items-center gap-2.5">
        <div
          className="flex size-9 items-center justify-center rounded-full text-sm font-extrabold text-white"
          style={{ backgroundColor: avatarColor(review.userName) }}
        >
          {review.userName.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="text-sm font-extrabold text-ink">
            {review.userName}
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {faDate(review.createdAt)}
          </div>
        </div>
        <Stars rating={review.rating} />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink/80">{review.body}</p>

      {review.ownerReply && (
        <div className="mr-3.5 mt-3 rounded-xl border-r-2 border-primary bg-bg p-3">
          <div className="mb-1 text-xs font-extrabold text-primary">
            پاسخ کافه
          </div>
          <div className="text-xs leading-relaxed text-ink/70">
            {review.ownerReply}
          </div>
        </div>
      )}
    </div>
  );
}
