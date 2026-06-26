import { Search, MapPin, Bell } from "lucide-react";
import { CafeCard } from "@/components/CafeCard";
import { useHomeSections } from "@/hooks/useCafes";
import { getHomeSections } from "@/services/cafes";
import type { Cafe } from "@/types";

type Sections = Awaited<ReturnType<typeof getHomeSections>>;

const ROWS: { key: keyof Sections; title: string }[] = [
  { key: "nearest", title: "نزدیک‌ترین‌ها به شما" },
  { key: "groups", title: "پای ثابت دورهمی‌ها" },
  { key: "cozy", title: "دنج و آرام" },
  { key: "popular", title: "محبوب‌ترین‌ها" },
];

export default function Home() {
  // react-query handles fetching, caching, loading and error state for us.
  const { data: sections, isPending, isError } = useHomeSections();

  return (
    <div className="pb-4">
      {/* header */}
      <div className="flex items-center gap-3 px-4 pb-3 pt-4">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border/60 bg-paper px-3 py-2 shadow-sm">
          <MapPin className="size-5 text-cta" />
          <div className="min-w-0">
            <div className="text-[9.5px] font-semibold text-muted-foreground">
              موقعیت شما
            </div>
            <div className="truncate text-[13.5px] font-extrabold text-ink">
              موقعیت فعلی (اطراف من)
            </div>
          </div>
        </div>
        <button className="flex size-11 items-center justify-center rounded-2xl border border-border/60 bg-paper shadow-sm">
          <Bell className="size-5 text-ink" />
        </button>
      </div>

      {/* search */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-paper px-4 py-3 shadow-sm">
          <Search className="size-4 text-muted-foreground" />
          <span className="text-[13.5px] text-muted-foreground">
            جستجوی نام کافه یا محله…
          </span>
        </div>
      </div>

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

      {sections &&
        ROWS.map(({ key, title }) => {
          const list = sections[key] as Cafe[];
          if (!list.length) return null;
          return (
            <section key={key} className="mt-4">
              <div className="flex items-center justify-between px-4 pb-3">
                <h2 className="text-[17px] font-extrabold text-ink">{title}</h2>
                <span className="text-xs font-bold text-primary">همه ›</span>
              </div>
              <div className="scrollbar-none flex gap-3 overflow-x-auto px-4 pb-1">
                {list.map((cafe) => (
                  <CafeCard key={cafe.id} cafe={cafe} />
                ))}
              </div>
            </section>
          );
        })}
    </div>
  );
}
