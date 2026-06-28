import { cn } from "@/lib/utils";

/** Minimal on/off toggle switch. */
export function Switch({
  on,
  onClick,
  className,
}: {
  on: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={cn(
        "relative h-6 w-10 flex-none rounded-full transition-colors",
        on ? "bg-primary" : "bg-ink/15",
        className
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-5 rounded-full bg-white transition-all",
          on ? "left-0.5" : "right-0.5"
        )}
      />
    </button>
  );
}
