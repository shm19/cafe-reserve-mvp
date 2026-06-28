import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { faNum, formatDistance } from "@/lib/utils";
import { Tag } from "@/components/Tag";
import type { Cafe } from "@/types";

export function CafeCard({ cafe }: { cafe: Cafe }) {
  return (
    <Link
      to={`/app/cafe/${cafe.id}`}
      className="w-52 flex-none overflow-hidden rounded-2xl border border-border/60 bg-paper shadow-sm"
    >
      <div className="relative h-28" style={{ backgroundColor: cafe.coverColor }}>
        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-xs font-extrabold text-ink">
          <Star className="size-3 fill-accent text-accent" /> {faNum(cafe.rating)}
        </span>
        <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-xs font-bold text-white">
          {formatDistance(cafe.distanceM)}
        </span>
      </div>
      <div className="p-3">
        <div className="truncate text-base font-extrabold text-ink">
          {cafe.name}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          {cafe.neighborhood}
        </div>
        {cafe.tags[0] && <Tag tag={cafe.tags[0]} className="mt-2 inline-block" />}
      </div>
    </Link>
  );
}
