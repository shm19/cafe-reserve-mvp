import { Search, MapPin, Bell, SlidersHorizontal, ChevronLeft } from "lucide-react";
import { CafeCard } from "@/pages/Home/CafeCard";
import { CafeHeroCard } from "@/pages/Home/CafeHeroCard";
import { DongBanner } from "@/pages/Home/DongBanner";
import { useHomeSections } from "@/hooks/useCafes";
import { useMyBookings } from "@/hooks/useBookings";
import { getHomeSections } from "@/api/cafes";
import { findRecentOuting } from "@/api/bookings";
import { useAuthStore } from "@/store/authStore";
import { TAG_META } from "@/lib/tags";
import type { Cafe, CafeTag } from "@/types";

type Sections = Awaited<ReturnType<typeof getHomeSections>>;

const ROWS: { key: keyof Sections; title: string }[] = [
  { key: "nearest", title: "نزدیک‌ترین‌ها به شما" },
  { key: "groups", title: "پای ثابت دورهمی‌ها" },
  { key: "cozy", title: "دنج و آرام" },
  { key: "popular", title: "محبوب‌ترین‌ها" },
];

const QUICK_FILTERS: CafeTag[] = [
  "parking",
  "outdoor",
  "power_outlet",
  "quiet",
  "group_table",
];

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center justify-between px-4">
      <h2 className="text-lg font-extrabold text-ink">{title}</h2>
      <span className="flex items-center text-xs font-bold text-primary">
        همه <ChevronLeft className="size-4" />
      </span>
    </div>
  );
}

export default function Home() {
  const { data: sections, isPending, isError } = useHomeSections();

  // Show the split-bill banner only if the user has a recent outing to split.
  const user = useAuthStore((s) => s.user);
  const { data: myBookings = [] } = useMyBookings(user?.id ?? "");
  const recentOuting = findRecentOuting(myBookings);

  return (
    <div className="pb-4">
      {/* header */}
      <div className="flex items-center gap-3 px-4 pb-3 pt-4">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border/60 bg-paper px-3 py-2 shadow-sm">
          <MapPin className="size-5 text-cta" />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-muted-foreground">
              موقعیت شما
            </div>
            <div className="truncate text-sm font-extrabold text-ink">
              موقعیت فعلی (اطراف من)
            </div>
          </div>
        </div>
        <button className="relative flex size-11 items-center justify-center rounded-2xl border border-border/60 bg-paper shadow-sm">
          <Bell className="size-5 text-ink" />
          <span className="absolute left-2.5 top-2.5 size-2 rounded-full border border-paper bg-cta" />
        </button>
      </div>

      {/* search */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-paper px-4 py-3 shadow-sm">
          <Search className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            جستجوی نام کافه یا محله…
          </span>
        </div>
      </div>

      {/* quick filter chips */}
      <div className="scrollbar-none flex items-center gap-2 overflow-x-auto px-4 pb-1">
        <button className="flex flex-none items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-sm font-extrabold text-white">
          <SlidersHorizontal className="size-4" />
          فیلترها
        </button>
        <span className="h-5 w-px flex-none bg-border" />
        {QUICK_FILTERS.map((tag) => (
          <button
            key={tag}
            className="flex-none rounded-full border border-border bg-paper px-3.5 py-2 text-sm font-semibold text-ink/70"
          >
            {TAG_META[tag].label}
          </button>
        ))}
      </div>

      {/* split-bill growth banner — only when there's a recent outing */}
      {recentOuting && (
        <div className="px-4 pt-2">
          <DongBanner bookingId={recentOuting.id} />
        </div>
      )}

      {isError && (
        <p className="px-4 py-8 text-center text-sm text-destructive">
          اتصال به سرور برقرار نشد. مطمئن شوید json-server اجراست (npm run mock).
        </p>
      )}

      {isPending && (
        <p className="px-4 py-8 text-center text-sm text-muted-foreground">
          در حال بارگذاری…
        </p>
      )}

      {sections && (
        <>
          {/* hero: best for reservation */}
          {sections.featured.length > 0 && (
            <section className="mt-5">
              <SectionHeader title="بهترین کافه‌ها برای رزرو" />
              <div className="scrollbar-none flex gap-3.5 overflow-x-auto px-4 pb-1.5">
                {sections.featured.map((cafe) => (
                  <CafeHeroCard key={cafe.id} cafe={cafe} />
                ))}
              </div>
            </section>
          )}

          {/* standard carousels */}
          {ROWS.map(({ key, title }) => {
            const list = sections[key] as Cafe[];
            if (!list.length) return null;
            return (
              <section key={key} className="mt-5">
                <SectionHeader title={title} />
                <div className="scrollbar-none flex gap-3 overflow-x-auto px-4 pb-0.5">
                  {list.map((cafe) => (
                    <CafeCard key={cafe.id} cafe={cafe} />
                  ))}
                </div>
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}
