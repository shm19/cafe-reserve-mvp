import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, ArrowDown, Landmark, Pencil, LogOut, Plus, Store, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/shared/BottomSheet";
import { ViewSwitch } from "@/components/shared/ViewSwitch";
import { IbanSheet } from "@/pages/Profile/IbanSheet";
import { useUser } from "@/hooks/useAuth";
import { useOwnerCafe } from "@/hooks/useOwner";
import { useAuthStore } from "@/store/authStore";
import { faNum, formatPhone, maskIban } from "@/lib/utils";

export default function Profile() {
  const navigate = useNavigate();
  const storeUser = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { data: fetched } = useUser(storeUser?.id ?? "");
  const { data: ownedCafe } = useOwnerCafe(storeUser?.id ?? "");
  const user = fetched ?? storeUser;
  const [ibanOpen, setIbanOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/auth", { replace: true });
  }

  if (!user) return null;

  return (
    <div className="px-5 pt-5">
      <h1 className="mb-4 text-2xl font-black text-ink">پروفایل</h1>

      {/* view switch — same position as the owner panel so it doesn't jump */}
      {ownedCafe && <ViewSwitch current="user" />}

      {/* user card — tap to edit */}
      <button
        onClick={() => navigate("/app/profile/edit")}
        className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-paper p-4 text-right"
      >
        <div className="flex size-14 flex-none items-center justify-center rounded-full bg-primary/15 text-2xl font-black text-primary">
          {user.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-base font-extrabold text-ink">{user.name}</div>
          <div dir="ltr" className="mt-1 text-right text-sm font-semibold text-muted-foreground">
            {formatPhone(user.phone)}
          </div>
        </div>
        <span className="flex size-9 flex-none items-center justify-center rounded-lg bg-ink/5">
          <Pencil className="size-4 text-muted-foreground" />
        </span>
      </button>

      {/* wallet card */}
      <div className="relative mt-4 overflow-hidden rounded-3xl bg-gradient-to-bl from-forest to-forest-deep p-5 shadow-lg">
        <div className="absolute -left-5 -top-8 size-28 rounded-full bg-sage/10" />
        <div className="flex items-center gap-2 text-xs font-bold text-white/70">
          <Wallet className="size-4 text-sage" />
          موجودی کیف پول شما
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-3xl font-black text-white">
            {faNum((user.walletBalance ?? 0).toLocaleString("en-US"))}
          </span>
          <span className="text-sm font-bold text-white/70">تومان</span>
        </div>
        <Button
          variant="cta"
          className="mt-4 w-full gap-2"
          disabled={!user.walletBalance}
          onClick={() => setIbanOpen(true)}
        >
          <ArrowDown className="size-4" />
          برداشت به شبا
        </Button>
      </div>

      {/* bank settings */}
      <h2 className="mb-2.5 mt-5 px-1 text-sm font-extrabold text-ink">
        تنظیمات بانکی
      </h2>
      <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-paper p-3.5">
        <span className="flex size-10 flex-none items-center justify-center rounded-xl bg-primary/10">
          <Landmark className="size-5 text-primary" />
        </span>
        <div className="min-w-0 flex-1">
          {user.iban ? (
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
          aria-label={user.iban ? "ویرایش شبا" : "افزودن شبا"}
        >
          {user.iban ? <Pencil className="size-4" /> : <Plus className="size-4" />}
        </button>
      </div>

      {/* register a cafe (customers who aren't owners yet) */}
      {!ownedCafe && (
        <>
          <h2 className="mb-2.5 mt-5 px-1 text-sm font-extrabold text-ink">
            کافه‌داری
          </h2>
          <button
            onClick={() => navigate("/app/add-cafe")}
            className="flex w-full items-center gap-3 rounded-2xl border border-primary/25 bg-primary/[0.06] p-4 text-right"
          >
            <span className="flex size-10 flex-none items-center justify-center rounded-xl bg-primary/12">
              <Store className="size-5 text-primary" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-extrabold text-ink">صاحب کافه هستید؟ ثبت کافه</span>
              <span className="mt-1 block text-xs font-semibold text-muted-foreground">
                رزروها را مدیریت کنید و کافه‌تان را به مشتری‌ها معرفی کنید
              </span>
            </span>
            <ChevronLeft className="size-4 flex-none text-muted-foreground" />
          </button>
        </>
      )}

      {/* account management — logout only */}
      <h2 className="mb-2.5 mt-5 px-1 text-sm font-extrabold text-ink">
        مدیریت حساب
      </h2>
      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-2xl border border-destructive/20 bg-transparent p-3.5 text-right"
      >
        <span className="flex size-9 flex-none items-center justify-center rounded-lg bg-destructive/10">
          <LogOut className="size-4 text-destructive" />
        </span>
        <span className="flex-1 text-sm font-extrabold text-destructive">
          خروج از حساب کاربری
        </span>
      </button>

      <BottomSheet open={ibanOpen} onClose={() => setIbanOpen(false)}>
        <IbanSheet user={user} onClose={() => setIbanOpen(false)} />
      </BottomSheet>
    </div>
  );
}
