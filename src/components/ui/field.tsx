import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/** Labeled text input that forwards its ref — works directly with
 *  react-hook-form's `register()`. */
export const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, error, className, ...props }, ref) => (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-ink/60">{label}</label>
      <input
        ref={ref}
        {...props}
        className={cn(
          "h-12 w-full rounded-xl border bg-paper px-3 text-sm font-bold text-ink outline-none focus:ring-2 focus:ring-primary/30",
          error ? "border-destructive" : "border-border",
          className
        )}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
);
Field.displayName = "Field";
