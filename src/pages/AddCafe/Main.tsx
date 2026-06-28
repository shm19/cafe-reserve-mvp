import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Check, ImagePlus, FileImage, Loader2 } from "lucide-react";
import { PhoneFrame } from "@/components/shared/PhoneFrame";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { useAddCafe } from "@/hooks/useOwner";
import { useAuthStore } from "@/store/authStore";
import { TAG_META } from "@/lib/tags";
import { cn } from "@/lib/utils";
import type { CafeTag } from "@/types";
import {
  addCafeSchema,
  CANCELLATION_POLICIES,
  STEP_FIELDS,
  type AddCafeForm,
} from "./schema";

const ALL_TAGS = Object.keys(TAG_META) as CafeTag[];
const STEP_LABELS = ["۱ از ۴", "۲ از ۴", "۳ از ۴", "۴ از ۴"];

export default function AddCafe() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const add = useAddCafe(user?.id ?? "");
  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<AddCafeForm>({
    resolver: zodResolver(addCafeSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      tags: [],
      parkingNote: "",
      depositOn: false,
      cancellationPolicy: CANCELLATION_POLICIES[0],
    },
  });

  const tags = watch("tags");
  const depositOn = watch("depositOn");
  const toggleTag = (t: CafeTag) =>
    setValue("tags", tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t]);

  function onSubmit(v: AddCafeForm) {
    add.mutate(
      {
        name: v.name,
        phone: v.phone || undefined,
        address: v.address,
        tags: v.tags,
        parkingNote: v.parkingNote || undefined,
        maxPartySize: v.maxPartySize,
        depositThreshold: v.depositOn ? v.depositThreshold : undefined,
        depositAmount: v.depositOn ? v.depositAmount : undefined,
        cancellationPolicy: v.cancellationPolicy,
        lat: 35.7219, // Tehran default until the map picker is wired
        lng: 51.3347,
      },
      { onSuccess: () => navigate("/owner", { replace: true }) }
    );
  }

  async function next() {
    if (!(await trigger(STEP_FIELDS[step]))) return;
    if (step < 3) setStep(step + 1);
    else handleSubmit(onSubmit)();
  }

  const numCls =
    "h-11 rounded-xl border border-border bg-paper px-3 text-center text-sm font-extrabold text-ink outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <PhoneFrame>
      {/* header + progress */}
      <div className="flex-none px-4 pb-3.5 pt-4">
        <div className="flex items-center justify-between gap-2.5">
          <button
            onClick={() => navigate(-1)}
            className="flex size-9 items-center justify-center rounded-xl border border-border bg-paper text-ink"
            aria-label="بستن"
          >
            <X className="size-5" />
          </button>
          <h1 className="text-base font-black text-ink">ثبت کافه جدید</h1>
          <span className="rounded-full bg-primary/12 px-2.5 py-1 text-xs font-bold text-primary">
            {STEP_LABELS[step]}
          </span>
        </div>
        <div className="mt-3.5 flex gap-1.5">
          {STEP_LABELS.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                i <= step ? "bg-primary" : "bg-ink/10"
              )}
            />
          ))}
        </div>
      </div>

      {/* body */}
      <div className="scrollbar-none flex-1 overflow-y-auto px-4 pb-4">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-black text-ink">اطلاعات پایه و موقعیت</h2>
            <Field label="نام کافه" placeholder="مثلاً کافهٔ نقطه" {...register("name")} error={errors.name?.message} />
            <Field label="تلفن تماس" dir="ltr" placeholder="۰۲۱..." {...register("phone")} />
            {/* map placeholder — pin picker wired with the real map SDK later */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-ink/60">موقعیت روی نقشه</label>
              <div className="relative h-36 overflow-hidden rounded-2xl border border-border bg-[repeating-linear-gradient(0deg,#E7E2D6_0_22px,#EDE8DD_22px_23px),repeating-linear-gradient(90deg,#E7E2D6_0_28px,#EDE8DD_28px_29px)]">
                <span className="absolute bottom-2 right-2 rounded-lg bg-paper/90 px-2 py-1 text-[11px] font-bold text-muted-foreground">
                  انتخاب موقعیت دقیق پس از ثبت
                </span>
              </div>
            </div>
            <Field label="آدرس دقیق" placeholder="خیابان، کوچه، پلاک" {...register("address")} error={errors.address?.message} />
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-sm font-black text-ink">فیلترها و امکانات</h2>
            <div>
              <label className="mb-2.5 block text-xs font-bold text-ink/60">امکانات کافه</label>
              <div className="flex flex-wrap gap-2">
                {ALL_TAGS.map((t) => {
                  const on = tags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTag(t)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-bold",
                        on
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-border bg-paper text-ink/70"
                      )}
                    >
                      {on && <Check className="size-3.5" />}
                      {TAG_META[t].label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-ink/60">
                راهنمای پارکینگ و دسترسی{" "}
                <span className="font-semibold text-muted-foreground">(اختیاری)</span>
              </label>
              <textarea
                {...register("parkingNote")}
                rows={3}
                placeholder="مثلاً: کوچهٔ خلوت، جای پارک حاشیه‌ای"
                className="w-full resize-none rounded-xl border border-border bg-paper p-3 text-sm leading-relaxed text-ink outline-none focus:ring-2 focus:ring-primary/30"
              />
              <p className="mt-1.5 text-xs font-semibold text-muted-foreground">
                این متن فقط در صورت تکمیل، در صفحهٔ کافه به کاربران نمایش داده می‌شود.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-black text-ink">قوانین رزرو و هماهنگی</h2>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-ink/60">
                حداکثر ظرفیت قابل رزرو آنلاین <span className="font-semibold text-muted-foreground">(اختیاری)</span>
              </label>
              <input
                inputMode="numeric"
                placeholder="۲۰"
                {...register("maxPartySize")}
                className={cn(numCls, "w-full text-right", errors.maxPartySize && "border-destructive")}
              />
              {errors.maxPartySize && (
                <p className="mt-1 text-xs text-destructive">{errors.maxPartySize.message}</p>
              )}
            </div>

            <div className="rounded-2xl border border-border/70 bg-paper p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-extrabold text-ink">
                  دریافت بیعانه برای گروه‌های بزرگ
                </span>
                <Switch on={depositOn} onClick={() => setValue("depositOn", !depositOn)} />
              </div>
              {depositOn && (
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-muted-foreground">برای گروه‌های بزرگ‌تر از</span>
                    <span className="flex items-center gap-1.5">
                      <input inputMode="numeric" placeholder="۶" {...register("depositThreshold")} className={cn(numCls, "w-16")} />
                      <span className="text-xs font-bold text-muted-foreground">نفر</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-muted-foreground">مبلغ ثابت بیعانه</span>
                    <span className="flex items-center gap-1.5">
                      <input inputMode="numeric" placeholder="۱۰۰٬۰۰۰" {...register("depositAmount")} className={cn(numCls, "w-28 text-primary")} />
                      <span className="text-xs font-bold text-muted-foreground">تومان</span>
                    </span>
                  </div>
                  {(errors.depositThreshold || errors.depositAmount) && (
                    <p className="text-xs text-destructive">
                      {errors.depositThreshold?.message ?? errors.depositAmount?.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-ink/60">قوانین لغو رزرو</label>
              <select
                {...register("cancellationPolicy")}
                dir="rtl"
                className="h-12 w-full rounded-xl border border-border bg-paper px-3 text-sm font-bold text-ink outline-none focus:ring-2 focus:ring-primary/30"
              >
                {CANCELLATION_POLICIES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-sm font-black text-ink">گالری و منو</h2>
            {/* upload is a stub for the MVP — media handling lands with the real backend */}
            <div>
              <label className="mb-2 block text-xs font-bold text-ink/60">تصاویر محیط کافه</label>
              <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-2xl border-[1.6px] border-dashed border-primary/40 bg-primary/[0.04]">
                <span className="flex size-11 items-center justify-center rounded-full bg-primary/12">
                  <ImagePlus className="size-5 text-primary" />
                </span>
                <span className="text-sm font-extrabold text-primary">افزودن عکس محیط</span>
                <span className="text-xs font-semibold text-muted-foreground">پس از ثبت کافه قابل بارگذاری است</span>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold text-ink/60">عکس منو</label>
              <div className="flex h-24 items-center gap-3 rounded-2xl border-[1.6px] border-dashed border-cta/40 bg-cta/[0.05] px-4">
                <span className="flex size-12 flex-none items-center justify-center rounded-xl bg-cta/12">
                  <FileImage className="size-5 text-cta-ink" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-extrabold text-ink">آپلود عکس منو</span>
                  <span className="mt-1 block text-xs font-semibold text-muted-foreground">
                    به‌جای تایپ، عکس منوی خود را بارگذاری کنید.
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* footer */}
      <div className="flex flex-none items-center gap-2.5 border-t border-border bg-paper px-4 pb-6 pt-3.5">
        {step > 0 && (
          <Button variant="outline" size="lg" className="px-5" onClick={() => setStep(step - 1)}>
            مرحله قبل
          </Button>
        )}
        {add.isError && (
          <span className="text-xs text-destructive">ثبت ناموفق بود.</span>
        )}
        <Button size="lg" className="flex-1 text-base" disabled={add.isPending} onClick={next}>
          {add.isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : step === 3 ? (
            "ثبت کافه"
          ) : (
            "مرحله بعد"
          )}
        </Button>
      </div>
    </PhoneFrame>
  );
}
