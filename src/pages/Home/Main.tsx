import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { CafeCard } from "@/pages/Home/CafeCard";
import { CafeHeroCard } from "@/pages/Home/CafeHeroCard";
import { DongBanner } from "@/pages/Home/DongBanner";
import { LocationChip } from "@/components/shared/LocationChip";
import { CafeSearchFilters } from "@/components/shared/CafeSearchFilters";
import { useHomeSections, useCafes } from "@/hooks/useCafes";
import { useMyBookings } from "@/hooks/useBookings";
import { getHomeSections } from "@/api/cafes";
import { findRecentOuting } from "@/api/bookings";
import { useAuthStore } from "@/store/authStore";
import { useLocationStore } from "@/store/locationStore";
import { byRealDistance, type SectionKey } from "@/lib/cafeSections";
import type { Cafe, CafeTag } from "@/types";

type Sections = Awaited<ReturnType<typeof getHomeSections>>;

const ROWS: { key: Extract<SectionKey, keyof Sections>; title: string }[] = [
  { key: "nearest", title: "نزدیک‌ترین‌ها به شما" },
  { key: "groups", title: "پای ثابت دورهمی‌ها" },
  { key: "cozy", title: "دنج و آرام" },
  { key: "popular", title: "محبوب‌ترین‌ها" },
];

function SectionHeader({ title, to }: { title: string; to: string }) {
  return (
    <div className="mb-3 flex items-center justify-between px-4">
      <h2 className="text-lg font-extrabold text-ink">{title}</h2>
      <Link to={to} className="flex items-center text-xs font-bold text-primary">
        همه <ChevronLeft className="size-4" />
      </Link>
    </div>
  );
}

export default function Home() {
  const { data: sections, isPending, isError } = useHomeSections();
  const { data: allCafes = [] } = useCafes();
  const coords = useLocationStore((s) => s.coords);

  const [q, setQ] = useState("");
  const [activeTags, setActiveTags] = useState<CafeTag[]>([]);

  const user = useAuthStore((s) => s.user);
  const { data: myBookings = [] } = useMyBookings(user?.id ?? "");
  const recentOuting = findRecentOuting(myBookings);

  const term = q.trim();
  const filtering = term !== "" || activeTags.length > 0;

  const results = useMemo(() => {
    const matched = allCafes.filter(
      (c) =>
        (term === "" || c.name.includes(term) || c.neighborhood.includes(term)) &&
        activeTags.every((t) => c.tags.includes(t))
    );
    return byRealDistance(matched, coords);
  }, [allCafes, term, activeTags, coords]);

  return (
    <div className="pb-4">
      {/* header */}
      <div className="px-4 pb-3 pt-4">
        <LocationChip />
      </div>

      <CafeSearchFilters
        q={q}
        setQ={setQ}
        activeTags={activeTags}
        setActiveTags={setActiveTags}
      />

      {/* RESULTS view (search / filter active) */}
      {filtering ? (
        <section className="mt-4">
          <p className="mb-3 px-4 text-xs font-bold text-muted-foreground">
            {results.length > 0 ? "نتایج جستجو" : "کافه‌ای مطابق جستجوی شما پیدا نشد"}
          </p>
          <div className="grid grid-cols-2 gap-3 px-4">
            {results.map((cafe) => (
              <CafeCard key={cafe.id} cafe={cafe} className="w-full" />
            ))}
          </div>
        </section>
      ) : (
        <>
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
                  <SectionHeader title="بهترین کافه‌ها برای رزرو" to="/app/cafes/featured" />
                  <div className="scrollbar-none flex gap-3.5 overflow-x-auto px-4 pb-1.5">
                    {sections.featured.map((cafe) => (
                      <CafeHeroCard key={cafe.id} cafe={cafe} />
                    ))}
                  </div>
                </section>
              )}

              {/* standard carousels */}
              {ROWS.map(({ key, title }) => {
                let list = sections[key] as Cafe[];
                if (key === "nearest") list = byRealDistance(list, coords);
                if (!list.length) return null;
                return (
                  <section key={key} className="mt-5">
                    <SectionHeader title={title} to={`/app/cafes/${key}`} />
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
        </>
      )}
    </div>
  );
}
