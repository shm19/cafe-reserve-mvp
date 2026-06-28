import { useState } from "react";
import { Wallet, ArrowDown, Landmark, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/shared/BottomSheet";
import { IbanSheet } from "@/pages/Profile/IbanSheet";
import { useOwnerBookings, useOwnerCafe } from "@/hooks/useOwner";
import { useUser } from "@/hooks/useAuth";
import { depositAmount } from "@/api/bookings";
import { useAuthStore } from "@/store/authStore";
import { faAmount, faDate, maskIban } from "@/lib/utils";

export default function OwnerReports() {
  const owner = useAuthStore((s) => s.user);
  const { data: fetched } = useUser(owner?.id ?? "");
  const user = fetched ?? owner;
  const { data: cafe } = useOwnerCafe(owner?.id ?? "");
  const { data: bookings = [] } = useOwnerBookings(owner?.id ?? "");
  const [ibanOpen, setIbanOpen] = useState(false);

  // Recent income = paid deposits on the owner's bookings (derived, no extra store).
  const credits = bookings
    .filter((b) => b.depositRequired && b.depositStatus === "paid")
    .map((b) => ({
      id: b.id,
      name: b.user?.name ?? "مهمان",
      date: b.createdAt,
      amount: depositAmount(cafe ?? undefined, b.partySize),
    }))
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const balance = credits.reduce((s, c) => s + c.amount, 0);

  return (
    <div className="px-5 pt-5">
      <h1 className="mb-4 text-2xl font-black text-ink">گزارشات مالی</h1>

      {/* withdrawable balance */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-bl from-forest to-forest-deep p-5 shadow-lg">
        <div className="absolute -left-5 -top-8 size-28 rounded-full bg-sage/10" />
        <div className="flex items-center gap-2 text-xs font-bold text-white/70">
          <Wallet className="size-4 text-sage" />
          موجودی قابل برداشت (بیعانه‌ها)
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-3xl font-black text-white">{faAmount(balance)}</span>
          <span className="text-sm font-bold text-white/70">تومان</span>
        </div>
        <Button
          variant="cta"
          className="mt-4 w-full gap-2"
          disabled={!balance}
          onClick={() => setIbanOpen(true)}
        >
          <ArrowDown className="size-4" />
          برداشت به شبا
        </Button>
      </div>

      {/* bank settings — add / edit IBAN (same sheet as the user side) */}
      <h2 className="mb-2.5 mt-5 px-1 text-sm font-extrabold text-ink">
        تنظیمات بانکی
      </h2>
      <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-paper p-3.5">
        <span className="flex size-10 flex-none items-center justify-center rounded-xl bg-primary/10">
          <Landmark className="size-5 text-primary" />
        </span>
        <div className="min-w-0 flex-1">
          {user?.iban ? (
            <span className="flex items-center gap-1.5">
              <span dir="ltr" className="text-sm font-extrabold text-ink">
                {maskIban(user.iban)}
              </span>
              <span className="rounded-full bg-primary/12 px-2 py-0.5 text-xs font-bold text-primary">
                تأیید شده
              </span>
            </span>
          ) : (
            <span className="text-sm font-extrabold text-ink">افزودن شماره شبا</span>
          )}
          <span className="mt-1 block text-xs font-semibold text-muted-foreground">
            شمارهٔ شبا برای واریز برداشت‌ها
          </span>
        </div>
        <button
          onClick={() => setIbanOpen(true)}
          className="flex size-9 flex-none items-center justify-center rounded-lg bg-ink/5 text-muted-foreground"
          aria-label={user?.iban ? "ویرایش شبا" : "افزودن شبا"}
        >
          {user?.iban ? <Pencil className="size-4" /> : <Plus className="size-4" />}
        </button>
      </div>

      {/* recent transactions */}
      <h2 className="mb-2.5 mt-5 px-1 text-sm font-extrabold text-ink">
        تراکنش‌های اخیر
      </h2>
      {credits.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          هنوز تراکنشی ثبت نشده است.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-paper">
          {credits.map((c, i) => (
            <div
              key={c.id}
              className={
                "flex items-center gap-3 p-3.5 " +
                (i < credits.length - 1 ? "border-b border-border/50" : "")
              }
            >
              <span className="flex size-9 flex-none items-center justify-center rounded-xl bg-primary/12">
                <ArrowDown className="size-4 text-primary" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-extrabold text-ink">
                  بیعانه رزرو {c.name}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {faDate(c.date)}
                </div>
              </div>
              <span dir="ltr" className="text-sm font-black text-primary">
                + {faAmount(c.amount)}
              </span>
            </div>
          ))}
        </div>
      )}

      {user && (
        <BottomSheet open={ibanOpen} onClose={() => setIbanOpen(false)}>
          <IbanSheet user={user} onClose={() => setIbanOpen(false)} />
        </BottomSheet>
      )}
    </div>
  );
}
