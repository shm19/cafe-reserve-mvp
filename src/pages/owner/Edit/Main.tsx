import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { useOwnerCafe, useUpdateCafe } from "@/hooks/useOwner";
import { useAuthStore } from "@/store/authStore";
import { TAG_META } from "@/lib/tags";
import type { CafeTag } from "@/types";
import { cafeEditSchema, type CafeEditForm } from "./schema";

const ALL_TAGS = Object.keys(TAG_META) as CafeTag[];

export default function OwnerEdit() {
  const navigate = useNavigate();
  const owner = useAuthStore((s) => s.user);
  const { data: cafe } = useOwnerCafe(owner?.id ?? "");
  const update = useUpdateCafe(owner?.id ?? "");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<CafeEditForm>({
    resolver: zodResolver(cafeEditSchema),
    defaultValues: { name: "", phone: "", address: "", parkingNote: "", tags: [] },
  });

  // Seed the form once the cafe loads.
  useEffect(() => {
    if (!cafe) return;
    reset({
      name: cafe.name,
      phone: cafe.phone ?? "",
      address: cafe.address ?? "",
      parkingNote: cafe.parkingNote ?? "",
      tags: cafe.tags,
    });
  }, [cafe?.id, reset]);

  const tags = watch("tags");
  const toggleTag = (t: CafeTag) =>
    setValue("tags", tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t], {
      shouldDirty: true,
    });

  function onSubmit(values: CafeEditForm) {
    if (!cafe) return;
    update.mutate(
      {
        id: cafe.id,
        patch: {
          name: values.name,
          phone: values.phone || "",
          address: values.address || "",
          parkingNote: values.parkingNote || undefined,
          tags: values.tags,
        },
      },
      { onSuccess: () => navigate("/owner/profile") }
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-5 pt-4">
      {/* header */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => navigate("/owner/profile")}
          className="flex size-9 items-center justify-center rounded-xl border border-border bg-paper text-ink"
          aria-label="بازگشت"
        >
          <ArrowRight className="size-5" />
        </button>
        <h1 className="text-base font-black text-ink">ویرایش اطلاعات کافه</h1>
        <Button type="submit" size="sm" disabled={!isDirty || update.isPending}>
          {update.isPending ? <Loader2 className="size-4 animate-spin" /> : "ذخیره"}
        </Button>
      </div>

      {/* cafe info */}
      <h2 className="mb-3 px-1 text-sm font-extrabold text-ink">اطلاعات کافه</h2>
      <div className="flex flex-col gap-3">
        <Field label="نام کافه" {...register("name")} error={errors.name?.message} />
        <Field label="تلفن تماس" dir="ltr" {...register("phone")} />
        <Field label="آدرس دقیق" {...register("address")} />
      </div>

      {/* amenities */}
      <h2 className="mb-1 mt-6 px-1 text-sm font-extrabold text-ink">امکانات کافه</h2>
      <p className="mb-3 px-1 text-xs font-semibold text-muted-foreground">
        جهت نمایش در فیلترهای جست‌وجوی کاربران
      </p>
      <div className="rounded-2xl border border-border/60 bg-paper px-4">
        {ALL_TAGS.map((t, i) => (
          <div
            key={t}
            className={
              "flex items-center justify-between py-3 " +
              (i < ALL_TAGS.length - 1 ? "border-b border-border/50" : "")
            }
          >
            <span className="text-sm font-bold text-ink/80">{TAG_META[t].label}</span>
            <Switch on={tags.includes(t)} onClick={() => toggleTag(t)} />
          </div>
        ))}
      </div>

      {/* parking note */}
      <div className="mt-4 pb-4">
        <label className="mb-1.5 block text-xs font-bold text-ink/60">
          راهنمای پارکینگ و دسترسی{" "}
          <span className="font-semibold text-muted-foreground">(اختیاری)</span>
        </label>
        <textarea
          {...register("parkingNote")}
          rows={3}
          placeholder="مثلاً: کوچهٔ خلوت، جای پارک حاشیه‌ای موجود است"
          className="w-full resize-none rounded-xl border border-border bg-paper p-3 text-sm leading-relaxed text-ink outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
    </form>
  );
}
