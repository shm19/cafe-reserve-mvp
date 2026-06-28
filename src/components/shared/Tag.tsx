import { cn } from "@/lib/utils";
import { TAG_META, TAG_VARIANT_CLASS } from "@/lib/tags";
import type { CafeTag } from "@/types";

/** Coloured amenity/vibe chip, e.g. «فضای باز». */
export function Tag({ tag, className }: { tag: CafeTag; className?: string }) {
  const meta = TAG_META[tag];
  if (!meta) return null;
  return (
    <span
      className={cn(
        "rounded-lg px-2.5 py-1.5 text-xs font-bold",
        TAG_VARIANT_CLASS[meta.variant],
        className
      )}
    >
      {meta.label}
    </span>
  );
}
