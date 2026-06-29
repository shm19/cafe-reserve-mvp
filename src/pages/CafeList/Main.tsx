import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { CafeCard } from "@/pages/Home/CafeCard";
import { LocationChip } from "@/components/shared/LocationChip";
import { CafeSearchFilters } from "@/components/shared/CafeSearchFilters";
import { useCafes } from "@/hooks/useCafes";
import { useLocationStore } from "@/store/locationStore";
import { SECTIONS, isSectionKey, byRealDistance } from "@/lib/cafeSections";
import { faNum } from "@/lib/utils";
import type { CafeTag } from "@/types";

const PAGE = 8;

export default function CafeList() {
  const { section } = useParams();
  const navigate = useNavigate();
  const { data: allCafes = [], isPending } = useCafes();
  const coords = useLocationStore((s) => s.coords);

  const [q, setQ] = useState("");
  const [activeTags, setActiveTags] = useState<CafeTag[]>([]);
  const [count, setCount] = useState(PAGE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const term = q.trim();

  // Full group list, distance-sorted for "nearest" or whenever we have coords,
  // then narrowed by the search box + amenity chips.
  const list = useMemo(() => {
    if (!isSectionKey(section)) return [];
    let base = SECTIONS[section].select(allCafes);
    if (section === "nearest" || coords) base = byRealDistance(base, coords);
    return base.filter(
      (c) =>
        (term === "" || c.name.includes(term) || c.neighborhood.includes(term)) &&
        activeTags.every((t) => c.tags.includes(t))
    );
  }, [section, allCafes, coords, term, activeTags]);

  // Reset paging whenever the result set changes.
  useEffect(() => setCount(PAGE), [section, term, activeTags, coords]);

  const visible = list.slice(0, count);
  const hasMore = count < list.length;

  // Load more as the sentinel scrolls into view (root = the layout's scroller).
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const root = el.closest("[data-scroll-root]");
    const io = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setCount((c) => c + PAGE),
      { root, rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore]);

  if (!isSectionKey(section)) return <Navigate to="/app" replace />;

  return (
    <div className="pb-4">
      {/* header */}
      <div className="flex items-center gap-3 px-4 pb-3 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex size-9 flex-none items-center justify-center rounded-xl border border-border bg-paper text-ink"
          aria-label="بازگشت"
        >
          <ArrowRight className="size-5" />
        </button>
        <h1 className="text-lg font-black text-ink">{SECTIONS[section].title}</h1>
      </div>

      <div className="px-4 pb-3">
        <LocationChip />
      </div>
      <CafeSearchFilters
        q={q}
        setQ={setQ}
        activeTags={activeTags}
        setActiveTags={setActiveTags}
      />

      {/* results */}
      {isPending ? (
        <p className="px-4 py-10 text-center text-sm text-muted-foreground">
          در حال بارگذاری…
        </p>
      ) : list.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-muted-foreground">
          کافه‌ای مطابق جستجوی شما پیدا نشد
        </p>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-2 gap-3 px-4">
            {visible.map((cafe) => (
              <CafeCard key={cafe.id} cafe={cafe} className="w-full" />
            ))}
          </div>
          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center py-5">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
