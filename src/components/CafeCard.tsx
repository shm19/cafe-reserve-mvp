import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { faNum } from "@/lib/utils";
import type { Cafe } from "@/types";

export function CafeCard({ cafe }: { cafe: Cafe }) {
  const distance =
    cafe.distanceM >= 1000
      ? `${faNum((cafe.distanceM / 1000).toFixed(1))} کیلومتر`
      : `${faNum(cafe.distanceM)} متر`;

  return (
    <Link
      to={`/app/cafe/${cafe.id}`}
      className="flex-none w-[210px] overflow-hidden rounded-2xl bg-paper border border-border/60 shadow-sm"
    >
      <div
        className="h-28 relative"
        style={{ backgroundColor: cafe.coverColor }}
      >
        <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-xs font-extrabold text-ink">
          <Star className="size-3 fill-accent text-accent" /> {faNum(cafe.rating)}
        </span>
        <span className="absolute top-2 left-2 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-bold text-white">
          {distance}
        </span>
      </div>
      <div className="p-3">
        <div className="truncate text-[15px] font-extrabold text-ink">
          {cafe.name}
        </div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">
          {cafe.neighborhood}
        </div>
        <span className="mt-2 inline-block rounded-md bg-primary/10 px-2 py-1 text-[10.5px] font-bold text-primary">
          امکان رزرو
        </span>
      </div>
    </Link>
  );
}
