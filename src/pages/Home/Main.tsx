import { useMemo, useState } from "react";
import { Search, MapPin, X, Loader2, ChevronLeft } from "lucide-react";
import { CafeCard } from "@/pages/Home/CafeCard";
import { CafeHeroCard } from "@/pages/Home/CafeHeroCard";
import { DongBanner } from "@/pages/Home/DongBanner";
import { useHomeSections, useCafes } from "@/hooks/useCafes";
import { useMyBookings } from "@/hooks/useBookings";
import { getHomeSections } from "@/api/cafes";
import { reverseGeocodeDistrict } from "@/api/geo";
import { findRecentOuting } from "@/api/bookings";
import { useAuthStore } from "@/store/authStore";
import { useLocationStore, type Coords } from "@/store/locationStore";
import { TAG_META } from "@/lib/tags";
import { cn, haversineM } from "@/lib/utils";
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

/** Override each cafe's distance with the real distance from the user's
 *  location, sorted nearest-first. No-op when we don't have coords. */
function byRealDistance(cafes: Cafe[], coords: Coords | null): Cafe[] {
  if (!coords) return cafes;
  return cafes
    .map((c) => ({ ...c, distanceM: haversineM(coords.lat, coords.lng, c.lat, c.lng) }))
    .sort((a, b) => a.distanceM - b.distanceM);
}

export default function Home() {
  const { data: sections, isPending, isError } = useHomeSections();
  const { data: allCafes = [] } = useCafes();

  const [q, setQ] = useState("");
  const [activeTags, setActiveTags] = useState<CafeTag[]>([]);
  const [geo, setGeo] = useState<"idle" | "locating" | "denied">("idle");

  const district = useLocationStore((s) => s.district);
  const coords = useLocationStore((s) => s.coords);
  const setLocation = useLocationStore((s) => s.setLocation);

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

  const toggleTag = (t: CafeTag) =>
    setActiveTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  /** Nearest cafe's neighbourhood — offline fallback when reverse geocoding fails. */
  function nearestNeighbourhood(c: Coords): string | null {
    return (
      byRealDistance(allCafes, c)[0]?.neighborhood ?? null
    );
  }

  function locateMe() {
    if (!navigator.geolocation) return setGeo("denied");
    setGeo("locating");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const name =
          (await reverseGeocodeDistrict(c.lat, c.lng)) ?? nearestNeighbourhood(c);
        setLocation(name, c);
        setGeo("idle");
      },
      () => setGeo("denied"),
      { enableHighAccuracy: true, timeout: 10_000 }
    );
  }

  const locationLabel =
    geo === "locating"
      ? "در حال یافتن موقعیت…"
      : geo === "denied"
      ? "دسترسی به موقعیت رد شد"
      : district ?? "موقعیت فعلی (اطراف من)";

  return (
    <div className="pb-4">
      {/* header */}
      <div className="flex items-center gap-3 px-4 pb-3 pt-4">
        <button
          onClick={locateMe}
          className="flex flex-1 items-center gap-2 rounded-2xl border border-border/60 bg-paper px-3 py-2 text-right shadow-sm"
        >
          {geo === "locating" ? (
            <Loader2 className="size-5 flex-none animate-spin text-cta" />
          ) : (
            <MapPin className="size-5 flex-none text-cta" />
          )}
          <div className="min-w-0">
            <div className="text-xs font-semibold text-muted-foreground">موقعیت شما</div>
            <div className="truncate text-sm font-extrabold text-ink">{locationLabel}</div>
          </div>
        </button>
      </div>

      {/* search */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-paper px-4 py-2.5 shadow-sm">
          <Search className="size-4 flex-none text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جستجوی نام کافه یا محله…"
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-ink outline-none placeholder:font-normal placeholder:text-muted-foreground"
          />
          {q && (
            <button onClick={() => setQ("")} aria-label="پاک کردن" className="flex-none">
              <X className="size-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* quick filter chips */}
      <div className="scrollbar-none flex items-center gap-2 overflow-x-auto px-4 pb-1">
        {filtering && (
          <button
            onClick={() => {
              setActiveTags([]);
              setQ("");
            }}
            className="flex flex-none items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-sm font-extrabold text-white"
          >
            <X className="size-4" />
            پاک کردن
          </button>
        )}
        {QUICK_FILTERS.map((tag) => {
          const on = activeTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                "flex-none rounded-full border px-3.5 py-2 text-sm font-semibold",
                on
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-paper text-ink/70"
              )}
            >
              {TAG_META[tag].label}
            </button>
          );
        })}
      </div>

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
                let list = sections[key] as Cafe[];
                if (key === "nearest") list = byRealDistance(list, coords);
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
        </>
      )}
    </div>
  );
}
