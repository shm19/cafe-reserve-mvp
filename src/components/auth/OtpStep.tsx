import { useState } from "react";
import { ArrowRight, RotateCw, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/OtpInput";
import { useVerifyOtp, useSendOtp } from "@/hooks/useAuth";
import { useCountdown } from "@/hooks/useCountdown";
import { faNum, formatPhone } from "@/lib/utils";
import type { User } from "@/types";

const CODE_LENGTH = 4;

export function OtpStep({
  phone,
  onEdit,
  onVerified,
}: {
  phone: string;
  onEdit: () => void;
  onVerified: (user: User | null) => void;
}) {
  const [code, setCode] = useState("");
  const verify = useVerifyOtp();
  const resend = useSendOtp();
  const { seconds, done, restart } = useCountdown(60);

  function submit(value = code) {
    if (value.length < CODE_LENGTH) return;
    verify.mutate({ phone, code: value }, { onSuccess: onVerified });
  }

  function handleChange(value: string) {
    setCode(value);
    if (verify.isError) verify.reset(); // clear the error as they retype
    if (value.length === CODE_LENGTH) submit(value); // auto-submit when full
  }

  function handleResend() {
    resend.mutate(phone, {
      onSuccess: () => {
        setCode("");
        verify.reset();
        restart();
      },
    });
  }

  const mmss = `${faNum(String(Math.floor(seconds / 60)).padStart(2, "0"))}:${faNum(
    String(seconds % 60).padStart(2, "0")
  )}`;

  return (
    <div className="flex flex-1 flex-col px-7 pb-7 pt-4">
      <button
        onClick={onEdit}
        className="flex size-10 items-center justify-center rounded-xl border border-border bg-paper text-ink"
        aria-label="بازگشت"
      >
        <ArrowRight className="size-5" />
      </button>

      <div className="mt-6">
        <h1 className="text-2xl font-black text-ink">کد تأیید</h1>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          کد ۴ رقمی ارسال‌شده به شمارهٔ خود را وارد کنید.
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span dir="ltr" className="text-sm font-bold text-ink">
            {formatPhone(phone)}
          </span>
          <button onClick={onEdit} className="text-[12.5px] font-extrabold text-primary">
            ویرایش
          </button>
        </div>
      </div>

      <div className="mt-9">
        <OtpInput value={code} onChange={handleChange} length={CODE_LENGTH} autoFocus />
      </div>

      {verify.isError && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border-r-[3px] border-rose bg-rose/10 p-3.5 text-rose">
          <AlertCircle className="mt-0.5 size-5 flex-none" />
          <p className="text-[13px] leading-6">{(verify.error as Error).message}</p>
        </div>
      )}

      {/* resend: countdown, then a button */}
      <div className="mt-6 text-center">
        {!done ? (
          <p className="text-[12.5px] text-muted-foreground">
            ارسال مجدد کد تا{" "}
            <span dir="ltr" className="font-bold text-ink">
              {mmss}
            </span>
          </p>
        ) : (
          <Button
            variant="outline"
            className="w-full gap-2 border-primary text-primary"
            disabled={resend.isPending}
            onClick={handleResend}
          >
            {resend.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <RotateCw className="size-4" />
                ارسال مجدد کد
              </>
            )}
          </Button>
        )}
      </div>

      <div className="flex-1" />

      <Button
        variant="cta"
        size="lg"
        className="w-full"
        disabled={code.length < CODE_LENGTH || verify.isPending}
        onClick={() => submit()}
      >
        {verify.isPending ? <Loader2 className="size-5 animate-spin" /> : "تأیید"}
      </Button>
    </div>
  );
}
