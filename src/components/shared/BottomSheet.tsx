import { cn } from "@/lib/utils";

/**
 * Modal that slides up from the bottom over the current page, with a dimmed
 * backdrop (tap to close). The page stays mounted behind it.
 */
export function BottomSheet({
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
          "relative z-10 mt-auto w-full max-w-sm rounded-t-3xl bg-bg px-6 pb-7 pt-3 shadow-[0_-20px_50px_-20px_rgba(31,41,55,0.45)]",
          "animate-in slide-in-from-bottom-10 duration-300",
          className
        )}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-ink/15" />
        {children}
      </div>
    </div>
  );
}
