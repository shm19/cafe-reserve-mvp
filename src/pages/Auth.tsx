import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { sendOtp, verifyOtp, registerUser, MOCK_OTP } from "@/services/auth";

type Step = "phone" | "otp" | "name";

export default function Auth() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function handlePhone() {
    if (phone.length < 11) return setError("شماره موبایل معتبر نیست.");
    setError("");
    await sendOtp(phone);
    setStep("otp");
  }

  async function handleOtp() {
    const user = await verifyOtp(phone, code);
    if (user === null && code !== MOCK_OTP) return setError("کد تأیید اشتباه است.");
    if (user) {
      setUser(user);
      navigate("/app");
    } else {
      setStep("name"); // verified but new user
    }
  }

  async function handleName() {
    if (!name.trim()) return setError("نام را وارد کنید.");
    const user = await registerUser(phone, name.trim());
    setUser(user);
    navigate("/app");
  }

  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col justify-center gap-6 px-7">
        <div>
          <h1 className="text-2xl font-black text-ink">کافه رزرو</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            رزرو و هماهنگی دورهمی، بی‌دردسر.
          </p>
        </div>

        {step === "phone" && (
          <div className="space-y-3">
            <label className="text-sm font-bold text-ink">شمارهٔ موبایل</label>
            <input
              dir="ltr"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09xxxxxxxxx"
              className="w-full rounded-xl border border-input bg-paper px-4 py-3 text-center text-lg outline-none focus:ring-2 focus:ring-ring"
            />
            <Button className="w-full" onClick={handlePhone}>
              دریافت کد تأیید
            </Button>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-3">
            <label className="text-sm font-bold text-ink">
              کد تأیید را وارد کنید
            </label>
            <input
              dir="ltr"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="------"
              className="w-full rounded-xl border border-input bg-paper px-4 py-3 text-center text-2xl tracking-[0.4em] outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground">
              کد آزمایشی: {MOCK_OTP}
            </p>
            <Button className="w-full" onClick={handleOtp}>
              تأیید
            </Button>
          </div>
        )}

        {step === "name" && (
          <div className="space-y-3">
            <label className="text-sm font-bold text-ink">نام شما</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً محمدرضا"
              className="w-full rounded-xl border border-input bg-paper px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
            />
            <Button className="w-full" onClick={handleName}>
              ورود به اپ
            </Button>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </PhoneFrame>
  );
}
