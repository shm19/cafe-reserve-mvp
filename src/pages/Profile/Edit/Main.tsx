import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Camera, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { BottomSheet } from "@/components/shared/BottomSheet";
import { VerifyPhoneSheet } from "@/pages/Profile/VerifyPhoneSheet";
import { useUser, useUpdateUser } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { toEnglishDigits } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(1, "نام را وارد کنید"),
  phone: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
});
type Form = z.infer<typeof schema>;

export default function EditAccount() {
  const navigate = useNavigate();
  const storeUser = useAuthStore((s) => s.user);
  const { data: fetched } = useUser(storeUser?.id ?? "");
  const user = fetched ?? storeUser;
  const update = useUpdateUser();
  const [pending, setPending] = useState<{ name: string; phone: string } | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "" },
  });

  useEffect(() => {
    if (user) reset({ name: user.name, phone: user.phone });
  }, [user?.id, reset]);

  function onSubmit(values: Form) {
    if (!user) return;
    // Changing the phone number requires verifying the new number first
    // (opens the OTP bottom sheet over this page).
    if (values.phone !== user.phone) {
      setPending({ name: values.name, phone: values.phone });
      return;
    }
    update.mutate(
      { id: user.id, patch: { name: values.name } },
      { onSuccess: () => navigate("/app/profile") }
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-hidden">
      {/* header */}
      <div className="flex flex-none items-center justify-between gap-2 px-4 pb-3 pt-4">
        <button
          type="button"
          onClick={() => navigate("/app/profile")}
          className="flex size-9 items-center justify-center rounded-xl border border-border bg-paper text-ink"
          aria-label="بازگشت"
        >
          <ArrowRight className="size-5" />
        </button>
        <h1 className="text-base font-black text-ink">ویرایش اطلاعات</h1>
        <Button type="submit" size="sm" disabled={!isDirty || update.isPending}>
          {update.isPending ? <Loader2 className="size-4 animate-spin" /> : "ذخیره"}
        </Button>
      </div>

      {/* body */}
      <div className="scrollbar-none flex-1 overflow-y-auto px-5 pt-2">
        {/* avatar */}
        <div className="flex flex-col items-center py-4 pb-7">
          <div className="relative size-24">
            <div className="flex size-24 items-center justify-center rounded-full bg-primary/15 text-4xl font-black text-primary">
              {user?.name.charAt(0) ?? "؟"}
            </div>
            <button
              type="button"
              className="absolute bottom-0 left-0 flex size-9 items-center justify-center rounded-full border-[3px] border-bg bg-primary text-white"
              aria-label="تغییر عکس"
            >
              <Camera className="size-4" />
            </button>
          </div>
          <span className="mt-3 text-xs font-bold text-primary">
            تغییر عکس پروفایل
          </span>
        </div>

        <div className="flex flex-col gap-5">
          <Field label="نام و نام خانوادگی" {...register("name")} error={errors.name?.message} />
          <div>
            <Field
              label="شماره موبایل"
              dir="ltr"
              error={errors.phone?.message}
              {...register("phone", {
                setValueAs: (v) => toEnglishDigits(String(v)).trim(),
              })}
            />
            <div className="mt-2.5 flex items-start gap-2 rounded-xl border border-accent/30 bg-accent/12 p-3">
              <Info className="mt-0.5 size-4 flex-none text-accent-ink" />
              <p className="text-xs leading-relaxed text-accent-ink">
                با تغییر شمارهٔ موبایل، یک کد تأیید جدید برای شمارهٔ جدید ارسال
                می‌شود.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomSheet open={!!pending} onClose={() => setPending(null)}>
        {pending && user && (
          <VerifyPhoneSheet
            userId={user.id}
            patch={pending}
            onClose={() => setPending(null)}
          />
        )}
      </BottomSheet>
    </form>
  );
}
