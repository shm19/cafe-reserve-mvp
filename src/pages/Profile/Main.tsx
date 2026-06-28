import { useNavigate } from "react-router-dom";
import {
  Wallet,
  ArrowDown,
  Landmark,
  Pencil,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { cn, faNum, toman, formatPhone } from "@/lib/utils";

/** Mask an IBAN for display, e.g. "IR1200…4421" -> "IR••• ۴۴۲۱". */
function maskIban(iban: string): string {
  return `IR••• ${faNum(iban.slice(-4))}`;
}

export default function Profile() {
  const navigate = useNavigate();
  const storeUser = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  // Fetch fresh (wallet/IBAN may differ from the login snapshot); fall back to
  // the store while loading.
  const { data: fetched } = useUser(storeUser?.id ?? "");
  const user = fetched ?? storeUser;

  function handleLogout() {
    logout();
    navigate("/auth", { replace: true });
  }

  if (!user) return null;

  return (
    <div className="px-5 pt-5">
      <h1 className="mb-4 text-2xl font-black text-ink">پروفایل</h1>

      {/* user card */}
      <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-paper p-4">
        <div className="flex size-14 flex-none items-center justify-center rounded-full bg-primary/15 text-2xl font-black text-primary">
          {user.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-base font-extrabold text-ink">{user.name}</div>
          <div dir="ltr" className="mt-1 text-right text-sm font-semibold text-muted-foreground">
            {formatPhone(user.phone)}
          </div>
        </div>
      </div>

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
        >
          <ArrowDown className="size-4" />
          برداشت به شبا
        </Button>
      </div>

      {/* bank settings */}
      <h2 className="mb-2.5 mt-5 px-1 text-sm font-extrabold text-ink">
        تنظیمات بانکی
      </h2>
      <button className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-paper p-3.5 text-right">
        <span className="flex size-10 flex-none items-center justify-center rounded-xl bg-primary/10">
          <Landmark className="size-5 text-primary" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-extrabold text-ink">
            حساب‌های بانکی و شماره شبا
          </span>
          {user.iban ? (
            <span className="mt-1 flex items-center gap-1.5">
              <span dir="ltr" className="text-xs font-semibold text-muted-foreground">
                {maskIban(user.iban)}
              </span>
              <span className="rounded-full bg-primary/12 px-2 py-0.5 text-xs font-bold text-primary">
                تأیید شده
              </span>
            </span>
          ) : (
            <span className="mt-1 block text-xs text-muted-foreground">
              ثبت نشده
            </span>
          )}
        </span>
        <ChevronLeft className="size-4 flex-none text-muted-foreground" />
      </button>

      {/* account management */}
      <h2 className="mb-2.5 mt-5 px-1 text-sm font-extrabold text-ink">
        مدیریت حساب
      </h2>
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-paper">
        <button className="flex w-full items-center gap-3 border-b border-border/50 p-3.5 text-right">
          <span className="flex size-9 flex-none items-center justify-center rounded-lg bg-ink/5">
            <Pencil className="size-4 text-muted-foreground" />
          </span>
          <span className="flex-1 text-sm font-bold text-ink/80">
            ویرایش اطلاعات کاربری
          </span>
          <ChevronLeft className="size-4 flex-none text-muted-foreground" />
        </button>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 p-3.5 text-right"
        >
          <span className="flex size-9 flex-none items-center justify-center rounded-lg bg-destructive/10">
            <LogOut className="size-4 text-destructive" />
          </span>
          <span className={cn("flex-1 text-sm font-bold text-destructive")}>
            خروج از حساب کاربری
          </span>
        </button>
      </div>
    </div>
  );
}
