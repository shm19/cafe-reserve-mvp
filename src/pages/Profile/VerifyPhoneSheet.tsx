import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/pages/Auth/OtpInput";
import { useSendOtp, useUpdateUser } from "@/hooks/useAuth";
import { useCountdown } from "@/hooks/useCountdown";
import { MOCK_OTP } from "@/api/auth";
import { faNum, formatPhone } from "@/lib/utils";
import type { User } from "@/types";

const CODE_LENGTH = 4;

/** Content of the "verify new phone" bottom sheet. Verifies the new number,
 *  then applies the pending profile changes. */
export function VerifyPhoneSheet({
  userId,
  patch,
  onClose,
}: {
  userId: string;
  patch: Partial<User>;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const sendOtp = useSendOtp();
  const update = useUpdateUser();
  const { seconds, done, restart } = useCountdown(60);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const newPhone = patch.phone ?? "";

  // Send the code to the new number when the sheet opens.
  useEffect(() => {
    if (newPhone) sendOtp.mutate(newPhone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function confirm() {
    if (code.length < CODE_LENGTH) return;
    if (code !== MOCK_OTP) {
      setError("کد تأیید اشتباه است.");
      return;
    }
    update.mutate(
      { id: userId, patch },
      { onSuccess: () => navigate("/app/profile") }
    );
  }

  const mmss = `${faNum(String(Math.floor(seconds / 60)).padStart(2, "0"))}:${faNum(
    String(seconds % 60).padStart(2, "0")
  )}`;

  return (
    <div>
      <h2 className="text-lg font-black text-ink">تأیید شمارهٔ جدید</h2>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        کد ۴ رقمی ارسال‌شده به شمارهٔ جدید را وارد کنید.
      </p>
      <div dir="ltr" className="mt-1 text-sm font-extrabold text-ink">
        {formatPhone(newPhone)}
      </div>

      <div className="mt-5">
        <OtpInput
          value={code}
          onChange={(v) => {
            setCode(v);
            if (error) setError("");
          }}
          length={CODE_LENGTH}
          autoFocus
        />
      </div>

      {error && <p className="mt-3 text-center text-sm text-destructive">{error}</p>}

      <div className="mt-4 text-center text-xs text-muted-foreground">
        {done ? (
          <button
            onClick={() => {
              sendOtp.mutate(newPhone);
              setCode("");
              restart();
            }}
            className="font-bold text-primary"
          >
            ارسال مجدد کد
          </button>
        ) : (
          <span>
            ارسال مجدد کد تا{" "}
            <span dir="ltr" className="font-bold text-ink">
              {mmss}
            </span>
          </span>
        )}
      </div>

      <div className="mt-5 flex gap-2.5">
        <Button variant="outline" className="flex-none" onClick={onClose}>
          انصراف
        </Button>
        <Button
          variant="cta"
          className="flex-1"
          disabled={code.length < CODE_LENGTH || update.isPending}
          onClick={confirm}
        >
          {update.isPending ? <Loader2 className="size-5 animate-spin" /> : "تأیید و ذخیره"}
        </Button>
      </div>
    </div>
  );
}
