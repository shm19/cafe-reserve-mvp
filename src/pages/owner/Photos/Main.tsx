import { useNavigate } from "react-router-dom";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { useOwnerCafe } from "@/hooks/useOwner";
import { useCafePhotos, useCafePhotoActions } from "@/hooks/useCafes";
import { useAuthStore } from "@/store/authStore";

export default function OwnerPhotos() {
  const navigate = useNavigate();
  const owner = useAuthStore((s) => s.user);
  const { data: cafe } = useOwnerCafe(owner?.id ?? "");
  const cafeId = cafe?.id ?? "";
  const { data: photos = [] } = useCafePhotos(cafeId);
  const { add, remove } = useCafePhotoActions(cafeId);
  const swatch = cafe?.coverColor ?? "#E0D8CB";

  return (
    <div className="px-5 pt-4">
      {/* header */}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/owner/profile")}
          className="flex size-9 items-center justify-center rounded-xl border border-border bg-paper text-ink"
          aria-label="بازگشت"
        >
          <ArrowRight className="size-5" />
        </button>
        <h1 className="text-base font-black text-ink">تصاویر و منو</h1>
      </div>

      {/* cafe photos */}
      <h2 className="mb-3 px-1 text-sm font-extrabold text-ink">تصاویر کافه</h2>
      <div className="grid grid-cols-3 gap-2.5">
        {photos.map((p) => (
          <div
            key={p.id}
            className="relative aspect-square overflow-hidden rounded-xl"
            style={{ backgroundColor: swatch }}
          >
            <button
              onClick={() => remove.mutate(p.id)}
              disabled={remove.isPending}
              className="absolute left-1.5 top-1.5 flex size-6 items-center justify-center rounded-lg bg-black/55 text-white"
              aria-label="حذف عکس"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
        <button
          onClick={() => add.mutate()}
          disabled={add.isPending}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-[1.5px] border-dashed border-primary/45 bg-primary/5 text-primary disabled:opacity-50"
        >
          <Plus className="size-6" strokeWidth={1.5} />
          <span className="text-xs font-bold">افزودن عکس</span>
        </button>
      </div>

      {/* menu image */}
      <h2 className="mb-3 mt-6 px-1 text-sm font-extrabold text-ink">عکس منو</h2>
      <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-paper p-3">
        <div
          className="h-[74px] w-[60px] flex-none rounded-lg border border-border"
          style={{ backgroundColor: swatch }}
        />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-ink/80">منوی فعلی کافه</div>
          <div className="mt-1 text-xs font-semibold text-muted-foreground">
            آخرین به‌روزرسانی: ۱۲ خرداد
          </div>
          <button className="mt-2 h-9 w-full rounded-xl border-[1.5px] border-primary bg-primary/[0.06] text-xs font-extrabold text-primary">
            تغییر عکس منو
          </button>
        </div>
      </div>
    </div>
  );
}
