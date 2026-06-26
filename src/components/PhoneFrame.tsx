import { cn } from "@/lib/utils";

/**
 * Mobile-first frame. On wide screens it renders a centered 375px "phone"
 * (matching the mockups); on small screens it fills the viewport.
 */
export function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-dvh w-full bg-muted/40 flex justify-center">
      <div
        className={cn(
          "relative w-full max-w-[420px] bg-bg min-h-dvh flex flex-col shadow-xl overflow-hidden",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
