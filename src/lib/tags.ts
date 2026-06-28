import type { CafeTag } from "@/types";

export type TagVariant = "green" | "amber" | "rose";

/** Persian label + colour variant for each amenity/vibe tag. Single source of
 *  truth so the profile chips, home filters, and search all stay consistent. */
export const TAG_META: Record<CafeTag, { label: string; variant: TagVariant }> = {
  quiet: { label: "فضای آرام", variant: "green" },
  outdoor: { label: "فضای باز", variant: "rose" },
  power_outlet: { label: "دارای پریز", variant: "amber" },
  group_table: { label: "مناسب دورهمی", variant: "green" },
  parking: { label: "دارای جا پارک", variant: "amber" },
  football: { label: "پخش فوتبال", variant: "rose" },
  date: { label: "مناسب قرار", variant: "rose" },
  work: { label: "مناسب کار", variant: "green" },
};

export const TAG_VARIANT_CLASS: Record<TagVariant, string> = {
  green: "text-primary bg-primary/10",
  amber: "text-accent-ink bg-accent/20",
  rose: "text-rose-ink bg-rose/15",
};
