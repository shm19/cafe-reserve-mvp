import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { faNum, formatDistance } from "@/lib/utils";
import type { Cafe } from "@/types";

/** Large featured card for the home hero carousel. */
export function CafeHeroCard({ cafe }: { cafe: Cafe }) {
  return (
    <Link
      to={`/app/cafe/${cafe.id}`}
      className="w-72 flex-none overflow-hidden rounded-3xl border border-border/50 bg-paper shadow-lg"
    >
      <div
        className="relative h-40"
        style={{ backgroundColor: cafe.coverColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute inset-x-3.5 bottom-3 flex items-end justify-between">
          <div>
            <div className="text-lg font-black text-white">{cafe.name}</div>
            <div className="mt-0.5 text-xs text-white/85">
              {cafe.neighborhood} · {formatDistance(cafe.distanceM)}
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs font-extrabold text-ink">
            <Star className="size-3 fill-accent text-accent" />
            {faNum(cafe.rating)}
          </span>
        </div>
      </div>
    </Link>
  );
}
