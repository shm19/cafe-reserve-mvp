import { useState } from "react";
import { Star, Check, Reply, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReviewReply } from "@/hooks/useCafes";
import { cn, faNum, faDate, avatarColor } from "@/lib/utils";
import type { Review } from "@/types";

export function OwnerReviewCard({
  review,
  cafeId,
}: {
  review: Review;
  cafeId: string;
}) {
  const { reply, remove } = useReviewReply(cafeId);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const hasReply = !!review.ownerReply;

  function openEditor(initial = "") {
    setDraft(initial);
    setEditing(true);
  }
  function save() {
    if (!draft.trim()) return;
    reply.mutate(
      { id: review.id, text: draft.trim() },
      { onSuccess: () => setEditing(false) }
    );
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-paper p-4">
      <div className="flex items-center gap-2.5">
        <div
          className="flex size-9 flex-none items-center justify-center rounded-full text-sm font-extrabold text-white"
          style={{ backgroundColor: avatarColor(review.userName) }}
        >
          {review.userName.charAt(0)}
        </div>
        <span className="text-sm font-extrabold text-ink">{review.userName}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent-ink">
          <Star className="size-3 fill-accent text-accent" />
          {faNum(review.rating)}
        </span>
        <span className="ms-auto text-xs text-muted-foreground">
          {faDate(review.createdAt)}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink/80">{review.body}</p>

      {/* existing reply */}
      {hasReply && !editing && (
        <div className="mr-3 mt-3 rounded-xl border-r-2 border-primary bg-bg p-3">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary">
              <Check className="size-3.5" />
              پاسخ مدیر کافه
            </span>
            <span className="flex items-center gap-3">
              <button
                onClick={() => openEditor(review.ownerReply)}
                className="text-xs font-bold text-muted-foreground"
              >
                ویرایش پاسخ
              </button>
              <button
                onClick={() => remove.mutate(review.id)}
                disabled={remove.isPending}
                className="text-xs font-bold text-destructive"
              >
                حذف
              </button>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-ink/70">{review.ownerReply}</p>
        </div>
      )}

      {/* editor */}
      {editing && (
        <div className="mt-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder="پاسخ خود را بنویسید…"
            className="w-full resize-none rounded-xl border border-primary/35 bg-bg p-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-primary/30"
          />
          <div className="mt-2 flex gap-2.5">
            <Button
              variant="outline"
              className="flex-none"
              onClick={() => setEditing(false)}
            >
              انصراف
            </Button>
            <Button className="flex-1" disabled={reply.isPending} onClick={save}>
              {reply.isPending ? <Loader2 className="size-4 animate-spin" /> : "ثبت پاسخ"}
            </Button>
          </div>
        </div>
      )}

      {/* reply button */}
      {!hasReply && !editing && (
        <button
          onClick={() => openEditor("")}
          className={cn(
            "mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-primary"
          )}
        >
          <Reply className="size-4" />
          پاسخ به این نظر
        </button>
      )}
    </div>
  );
}
