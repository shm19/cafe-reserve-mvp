import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  Share2,
  Star,
  MapPin,
  Phone,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/Tag";
import { ReviewCard } from "@/components/ReviewCard";
import { useCafe, useCafeMenu, useCafeReviews } from "@/hooks/useCafes";
import { faNum, toman } from "@/lib/utils";

export default function CafeProfile() {
  const { id = "" } = useParams();
  const navigate = useNavigate();

  const { data: cafe, isPending, isError } = useCafe(id);
  const { data: menu = [] } = useCafeMenu(id);
  const { data: reviews = [] } = useCafeReviews(id);

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        در حال بارگذاری…
      </div>
    );
  }

  if (isError || !cafe) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
        <p className="text-sm text-destructive">کافه پیدا نشد.</p>
        <Button variant="outline" onClick={() => navigate("/app")}>
          بازگشت به خانه
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* hero */}
      <div
        className="relative h-60 flex-none"
        style={{ backgroundColor: cafe.coverColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/40" />
        <button
          onClick={() => navigate(-1)}
          className="absolute right-4 top-12 flex size-9 items-center justify-center rounded-full bg-white/90 text-ink"
          aria-label="بازگشت"
        >
          <ArrowRight className="size-5" />
        </button>
        <div className="absolute left-4 top-12 flex gap-2">
          <button className="flex size-9 items-center justify-center rounded-full bg-white/90 text-ink">
            <Bookmark className="size-4" />
          </button>
          <button className="flex size-9 items-center justify-center rounded-full bg-white/90 text-ink">
            <Share2 className="size-4" />
          </button>
        </div>
        <span className="absolute bottom-3.5 left-4 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white">
          {faNum(1)} / {faNum(reviews.length || 1)}
        </span>
      </div>

      {/* scroll body */}
      <div className="scrollbar-none flex-1 overflow-y-auto px-5 pt-4">
        <h1 className="text-2xl font-black text-ink">{cafe.name}</h1>
        <div className="mt-1 text-xs text-muted-foreground">
          {cafe.neighborhood}
        </div>

        {/* trust + open status */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-ink">
            <Star className="size-4 fill-accent text-accent" />
            {faNum(cafe.rating)}
            <span className="text-xs font-semibold text-muted-foreground">
              ({faNum(cafe.reviewCount)} نظر)
            </span>
          </span>
          <span className="h-3.5 w-px bg-border" />
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            باز است · {cafe.openHours}
          </span>
        </div>

        {/* address + contact */}
        <div className="mt-4 flex flex-col gap-2.5">
          <div className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 size-4 flex-none text-muted-foreground" />
            <span className="text-sm leading-7 text-ink/70">
              {cafe.address ?? cafe.neighborhood}
            </span>
          </div>
          {cafe.phone && (
            <a
              href={`tel:${cafe.phone}`}
              className="flex items-center gap-2.5 text-sm text-ink/70"
            >
              <Phone className="size-4 flex-none text-muted-foreground" />
              <span dir="ltr">{cafe.phone}</span>
            </a>
          )}
        </div>

        {/* vibe + facility chips */}
        {cafe.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {cafe.tags.map((tag) => (
              <Tag key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* menu */}
        {menu.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 text-base font-extrabold text-ink">منوی کافه</h2>
            <div className="scrollbar-none -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
              {menu.map((item) => (
                <div
                  key={item.id}
                  className="flex h-28 w-36 flex-none flex-col justify-between rounded-2xl border border-border/60 bg-paper p-3"
                >
                  <div className="text-sm font-bold text-ink">
                    {item.name}
                  </div>
                  <div className="text-sm font-extrabold text-primary">
                    {toman(item.price)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* reviews */}
        <section className="mt-6 pb-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-ink">نظرات کاربران</h2>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-paper px-3 py-1.5 text-xs font-bold text-ink/70">
              محبوب‌ترین <ChevronDown className="size-3.5 text-primary" />
            </span>
          </div>

          {reviews.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              هنوز نظری ثبت نشده است.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* sticky CTA */}
      <div className="flex-none border-t border-border bg-paper px-5 pb-6 pt-3.5 shadow-[0_-14px_30px_-18px_rgba(31,41,55,0.3)]">
        <Button
          variant="cta"
          size="lg"
          className="w-full text-base"
          onClick={() => navigate(`/app/book/${cafe.id}`)}
        >
          رزرو رایگان
        </Button>
      </div>
    </div>
  );
}
