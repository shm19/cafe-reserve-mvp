import { cn, faNum } from "@/lib/utils";

/** A single capacity-snapshot stat on the owner dashboard. */
export function StatCard({
  value,
  label,
  highlight,
}: {
  value: number;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex-1 rounded-2xl border p-3 text-center",
        highlight ? "border-cta/20 bg-cta/[0.08]" : "border-border/60 bg-paper"
      )}
    >
      <div className={cn("text-xl font-black", highlight ? "text-cta-ink" : "text-ink")}>
        {faNum(value)}
      </div>
      <div
        className={cn(
          "mt-1 text-xs font-bold",
          highlight ? "text-cta-ink" : "text-muted-foreground"
        )}
      >
        {label}
      </div>
    </div>
  );
}
