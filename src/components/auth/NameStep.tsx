import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegister } from "@/hooks/useAuth";

export function NameStep({
  phone,
  onDone,
}: {
  phone: string;
  onDone: () => void;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const register = useRegister();

  function submit() {
    if (!name.trim()) {
      setError("نام را وارد کنید.");
      return;
    }
    setError("");
    register.mutate({ phone, name: name.trim() }, { onSuccess: onDone });
  }

  return (
    <div className="flex flex-1 flex-col px-7 pb-7 pt-12 text-center">
      <div className="flex justify-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-sage/25">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary">
            <Star className="size-7 text-white" />
          </div>
        </div>
      </div>

      <h1 className="mt-7 text-2xl font-black text-ink">به نشست خوش آمدید!</h1>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">
        دوست دارید شما را چه صدا کنیم؟
      </p>

      <div className="mt-8 text-right">
        <label className="mb-2 block text-[13px] font-bold text-ink/70">
          نام و نام خانوادگی
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="مثلاً محمدرضا"
          autoFocus
          className="h-14 w-full rounded-2xl border-[1.5px] border-primary bg-paper px-4 shadow-sm outline-none focus:ring-2 focus:ring-primary/30"
        />
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>

      <div className="flex-1" />

      <Button
        variant="cta"
        size="lg"
        className="w-full"
        disabled={register.isPending}
        onClick={submit}
      >
        {register.isPending ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          "شروع گشت‌وگذار"
        )}
      </Button>
    </div>
  );
}
