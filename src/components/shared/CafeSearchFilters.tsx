import { Search, X } from "lucide-react";
import { TAG_META } from "@/lib/tags";
import { cn } from "@/lib/utils";
import type { CafeTag } from "@/types";

const QUICK_FILTERS: CafeTag[] = [
  "parking",
  "outdoor",
  "power_outlet",
  "quiet",
  "group_table",
];

/** Search box + toggleable amenity chips. Controlled — the parent owns `q` and
 *  `activeTags` so it can drive its own results. Shared by home + list page. */
export function CafeSearchFilters({
  q,
  setQ,
  activeTags,
  setActiveTags,
}: {
  q: string;
  setQ: (v: string) => void;
  activeTags: CafeTag[];
  setActiveTags: (updater: (prev: CafeTag[]) => CafeTag[]) => void;
}) {
  const filtering = q.trim() !== "" || activeTags.length > 0;
  const toggleTag = (t: CafeTag) =>
    setActiveTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  return (
    <>
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
              setActiveTags(() => []);
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
    </>
  );
}
