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
    <div className="flex h-dvh w-full justify-center bg-muted/40">
      {/* h-dvh (not min-h) so inner overflow-y-auto regions scroll and any
          flex-none footer / bottom nav stays pinned to the bottom. */}
      <div
        className={cn(
          "relative flex h-dvh w-full max-w-sm flex-col overflow-hidden bg-bg shadow-xl",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
