import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdateUser } from "@/hooks/useAuth";
import { cn, toEnglishDigits } from "@/lib/utils";
import type { User } from "@/types";

const schema = z.object({
  digits: z.string().regex(/^\d{24}$/, "شماره شبا باید ۲۴ رقم باشد"),
});
type Form = z.infer<typeof schema>;

/** Content of the add/edit-IBAN bottom sheet. */
export function IbanSheet({ user, onClose }: { user: User; onClose: () => void }) {
  const update = useUpdateUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { digits: user.iban?.replace(/\D/g, "").slice(0, 24) ?? "" },
  });

  function onSubmit(values: Form) {
    update.mutate(
      { id: user.id, patch: { iban: `IR${values.digits}` } },
      { onSuccess: onClose }
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-lg font-black text-ink">شماره شبا</h2>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        شماره شبای ۲۴ رقمی خود را برای واریز برداشت‌ها وارد کنید.
      </p>

      <div className="mt-4">
        <label className="mb-2 block text-xs font-bold text-ink/60">شماره شبا</label>
        <div
          className={cn(
            "flex h-14 items-center gap-2 rounded-2xl border-[1.5px] bg-paper px-4",
            errors.digits ? "border-destructive" : "border-primary"
          )}
        >
          <span dir="ltr" className="text-sm font-extrabold text-ink">
            IR
          </span>
          <input
            dir="ltr"
            inputMode="numeric"
            autoFocus
            placeholder="۰۶۰ ۱۲۰ ۰۰۰۰ ۰۰۰۰ ۴۴۲۱"
            className="w-full bg-transparent text-sm font-bold tracking-wide text-ink outline-none placeholder:text-muted-foreground/60"
            {...register("digits", {
              setValueAs: (v) => toEnglishDigits(String(v)).replace(/\D/g, ""),
            })}
          />
        </div>
        {errors.digits && (
          <p className="mt-1.5 text-xs text-destructive">{errors.digits.message}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="cta"
        size="lg"
        className="mt-5 w-full"
        disabled={update.isPending}
      >
        {update.isPending ? <Loader2 className="size-5 animate-spin" /> : "ذخیره شماره شبا"}
      </Button>
    </form>
  );
}
