import { useRef } from "react";
import { cn, toEnglishDigits } from "@/lib/utils";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
}

/**
 * Segmented numeric code input (one box per digit) with auto-advance,
 * backspace-to-previous, and paste support. Controlled: `value` is the
 * full code string, `onChange` reports the new string.
 */
export function OtpInput({
  value,
  onChange,
  length = 4,
  disabled,
  autoFocus,
}: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const focusAt = (i: number) => refs.current[Math.max(0, Math.min(i, length - 1))]?.focus();

  function handleChange(i: number, raw: string) {
    const digit = toEnglishDigits(raw).replace(/\D/g, "").slice(-1);
    if (!digit) return;
    const next = (value.slice(0, i) + digit + value.slice(i + 1)).slice(0, length);
    onChange(next);
    if (i < length - 1) focusAt(i + 1);
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (value[i]) {
        onChange(value.slice(0, i) + value.slice(i + 1));
      } else if (i > 0) {
        onChange(value.slice(0, i - 1) + value.slice(i));
        focusAt(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      focusAt(i + 1); // RTL: left = next
    } else if (e.key === "ArrowRight") {
      focusAt(i - 1);
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = toEnglishDigits(e.clipboardData.getData("text"))
      .replace(/\D/g, "")
      .slice(0, length);
    if (!text) return;
    e.preventDefault();
    onChange(text);
    focusAt(text.length);
  }

  return (
    <div className="flex justify-center gap-3" dir="ltr">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          autoFocus={autoFocus && i === 0}
          className={cn(
            "size-16 rounded-2xl border-2 bg-paper text-center text-3xl font-black text-ink shadow-sm outline-none transition-colors",
            "focus:border-cta focus:ring-2 focus:ring-cta/30",
            value[i] ? "border-primary" : "border-border",
            disabled && "opacity-50"
          )}
        />
      ))}
    </div>
  );
}
