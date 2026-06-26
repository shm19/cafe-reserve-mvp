import { useState } from "react";
import { Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSendOtp } from "@/hooks/useAuth";
import { toEnglishDigits } from "@/lib/utils";

export function PhoneStep({
  defaultPhone,
  onContinue,
}: {
  defaultPhone: string;
  onContinue: (phone: string) => void;
}) {
  const [phone, setPhone] = useState(defaultPhone);
  const [error, setError] = useState("");
  const sendOtp = useSendOtp();

  function submit() {
    const p = toEnglishDigits(phone).trim();
    if (!/^09\d{9}$/.test(p)) {
      setError("شمارهٔ موبایل معتبر نیست (مثلاً ۰۹۱۲۳۴۵۶۷۸۹).");
      return;
    }
    setError("");
    sendOtp.mutate(p, { onSuccess: () => onContinue(p) });
  }

  return (
    <div className="flex flex-1 flex-col px-7 pb-7 pt-14">
      {/* brand */}
      <div className="flex flex-col items-center">
        <div className="flex size-20 items-center justify-center rounded-3xl bg-primary text-4xl font-black text-white shadow-lg">
          ن
        </div>
        <div className="mt-3 text-lg font-black text-ink">نشست</div>
      </div>

      <div className="mt-10">
        <h1 className="text-2xl font-black text-ink">خوش آمدید</h1>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          برای ورود یا ثبت‌نام، شمارهٔ موبایل خود را وارد کنید.
        </p>
      </div>

      <div className="mt-7">
        <label className="mb-2 block text-[13px] font-bold text-ink/70">
          شمارهٔ موبایل
        </label>
        <div className="flex h-14 items-center gap-3 rounded-2xl border-[1.5px] border-primary bg-paper px-4 shadow-sm focus-within:ring-2 focus-within:ring-primary/30">
          <Phone className="size-5 text-muted-foreground" />
          <input
            dir="ltr"
            inputMode="numeric"
            maxLength={11}
            value={phone}
            onChange={(e) => setPhone(toEnglishDigits(e.target.value))}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="09123456789"
            className="w-full bg-transparent text-center text-lg tracking-wide outline-none placeholder:text-muted-foreground/60"
          />
        </div>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>

      <div className="flex-1" />

      <p className="mb-3 px-2 text-center text-[11.5px] leading-7 text-muted-foreground">
        با ادامه، <span className="font-bold text-primary">قوانین و شرایط</span> و{" "}
        <span className="font-bold text-primary">حریم خصوصی</span> را می‌پذیرید.
      </p>
      <Button
        variant="cta"
        size="lg"
        className="w-full"
        disabled={sendOtp.isPending}
        onClick={submit}
      >
        {sendOtp.isPending ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          "ارسال کد تأیید"
        )}
      </Button>
    </div>
  );
}
