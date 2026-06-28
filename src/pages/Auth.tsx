import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { PhoneFrame } from "@/components/PhoneFrame";
import { PhoneStep } from "@/components/auth/PhoneStep";
import { OtpStep } from "@/components/auth/OtpStep";
import { NameStep } from "@/components/auth/NameStep";
import { useAuthStore } from "@/store/authStore";
import { homePathForRole } from "@/lib/roles";
import type { User } from "@/types";

type Step = "phone" | "otp" | "name";

/**
 * Sign-up / sign-in orchestrator. Owns the step + phone, and decides where to
 * go after OTP verification: existing user -> straight into the app;
 * new user (valid code, no account) -> collect a name first.
 */
export default function Auth() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");

  if (user) return <Navigate to={homePathForRole(user.role)} replace />;

  function handleVerified(verified: User | null) {
    if (verified) {
      setUser(verified);
      navigate(homePathForRole(verified.role)); // owners -> /owner, etc.
    } else {
      setStep("name"); // valid code, brand-new user
    }
  }

  return (
    <PhoneFrame>
      {step === "phone" && (
        <PhoneStep
          defaultPhone={phone}
          onContinue={(p) => {
            setPhone(p);
            setStep("otp");
          }}
        />
      )}

      {step === "otp" && (
        <OtpStep
          phone={phone}
          onEdit={() => setStep("phone")}
          onVerified={handleVerified}
        />
      )}

      {step === "name" && (
        <NameStep phone={phone} onDone={() => navigate("/app")} />
      )}
    </PhoneFrame>
  );
}
