import { cn } from "@/lib/utils";

/**
 * Dropdown panel that slides down from the top over the current page, with a
 * dimmed backdrop (tap to close). The page stays mounted behind it.
 */
export function TopSheet({
  open,
  onClose,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-center" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/40 animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 mb-auto flex max-h-[80%] w-full max-w-sm flex-col overflow-hidden rounded-b-3xl bg-bg pb-3 pt-2 shadow-[0_20px_50px_-20px_rgba(31,41,55,0.45)]",
          "animate-in slide-in-from-top-8 duration-300",
          className
        )}
      >
        {children}
        <div className="mx-auto mt-3 h-1.5 w-10 flex-none rounded-full bg-ink/15" />
      </div>
    </div>
  );
}
