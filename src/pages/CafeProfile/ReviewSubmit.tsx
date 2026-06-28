import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCafe, useCreateReview } from "@/hooks/useCafes";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

export default function ReviewSubmit() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { data: cafe } = useCafe(id);
  const create = useCreateReview(id);

  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");

  const valid = rating > 0 && body.trim().length > 0;

  function submit() {
    if (!valid || !user) return;
    create.mutate(
      {
        cafeId: id,
        userId: user.id,
        userName: user.name,
        rating,
        body: body.trim(),
      },
      { onSuccess: () => navigate(`/app/cafe/${id}`) }
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* grab handle + header */}
      <div className="flex flex-none flex-col items-center pt-3">
        <span className="h-1.5 w-10 rounded-full bg-ink/15" />
      </div>
      <div className="flex flex-none items-center gap-3 px-5 pb-3 pt-3">
        <div
          className="size-11 flex-none rounded-xl"
          style={{ backgroundColor: cafe?.coverColor ?? "#E0D8CB" }}
        />
        <div className="min-w-0">
          <h1 className="text-lg font-black text-ink">ثبت نظر</h1>
          <div className="text-xs text-muted-foreground">
            {cafe ? `${cafe.name} · ${cafe.neighborhood}` : "—"}
          </div>
        </div>
      </div>

      {/* body */}
      <div className="scrollbar-none flex-1 overflow-y-auto px-5">
        {/* star rating */}
        <div className="mb-2.5 text-xs font-bold text-ink/60">امتیاز شما</div>
        <div className="mb-5 flex justify-center gap-2.5" dir="ltr">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setRating(n)}
              aria-label={`${n} ستاره`}
            >
              <Star
                className={cn(
                  "size-9",
                  n <= rating ? "fill-accent text-accent" : "fill-transparent text-border"
                )}
              />
            </button>
          ))}
        </div>

        {/* review text */}
        <div className="mb-2.5 text-xs font-bold text-ink/60">دیدگاه شما</div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder="تجربه‌تان از فضا، سرویس و کیفیت را بنویسید…"
          className="w-full resize-none rounded-2xl border border-border bg-paper p-3.5 text-sm leading-relaxed text-ink outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/70"
        />
      </div>

      {/* footer */}
      <div className="flex-none border-t border-border bg-paper px-5 pb-6 pt-3">
        {create.isError && (
          <p className="mb-2 text-center text-xs text-destructive">
            ثبت نظر ناموفق بود. دوباره تلاش کنید.
          </p>
        )}
        <Button
          variant="cta"
          size="lg"
          className="w-full"
          disabled={!valid || create.isPending}
          onClick={submit}
        >
          {create.isPending ? <Loader2 className="size-5 animate-spin" /> : "ثبت نظر"}
        </Button>
      </div>
    </div>
  );
}
