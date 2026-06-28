import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Pencil,
  Images,
  ChevronLeft,
  Star,
  LogOut,
} from "lucide-react";
import { ViewSwitch } from "@/components/shared/ViewSwitch";
import { useOwnerCafe } from "@/hooks/useOwner";
import { useAuthStore } from "@/store/authStore";
import { faNum, formatPhone } from "@/lib/utils";

const MENU = [
  {
    to: "reviews",
    icon: MessageSquare,
    title: "مدیریت و پاسخ به نظرات",
    sub: "پاسخ به نظرات مشتریان و رسیدگی به بازخوردها",
  },
  {
    to: "edit",
    icon: Pencil,
    title: "ویرایش اطلاعات و امکانات",
    sub: "نام، تلفن، آدرس و فیلترهای امکانات کافه",
  },
  {
    to: "photos",
    icon: Images,
    title: "آلبوم تصاویر و عکس منو",
    sub: "مدیریت تصاویر محیط و به‌روزرسانی عکس منو",
  },
];

export default function OwnerProfileHub() {
  const navigate = useNavigate();
  const owner = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { data: cafe } = useOwnerCafe(owner?.id ?? "");

  function handleLogout() {
    logout();
    navigate("/auth", { replace: true });
  }

  return (
    <div className="px-5 pt-5">
      <h1 className="mb-4 text-2xl font-black text-ink">پروفایل کافه</h1>

      <ViewSwitch current="owner" />

      {/* cafe overview */}
      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-border/60 bg-paper p-3.5">
        <div
          className="size-16 flex-none rounded-2xl"
          style={{ backgroundColor: cafe?.coverColor ?? "#E0D8CB" }}
        />
        <div className="min-w-0 flex-1">
          <div className="text-lg font-black text-ink">{cafe?.name ?? "—"}</div>
          {cafe && (
            <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-bold text-accent-ink">
              <Star className="size-3 fill-accent text-accent" />
              {faNum(cafe.rating)} از {faNum(cafe.reviewCount)} نظر
            </div>
          )}
        </div>
      </div>

      {/* menu */}
      <div className="flex flex-col gap-3">
        {MENU.map(({ to, icon: Icon, title, sub }) => (
          <button
            key={to}
            onClick={() => navigate(`/owner/profile/${to}`)}
            className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-paper p-4 text-right"
          >
            <span className="flex size-11 flex-none items-center justify-center rounded-xl bg-primary/10">
              <Icon className="size-5 text-primary" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-extrabold text-ink">{title}</span>
              <span className="mt-1 block text-xs font-semibold text-muted-foreground">
                {sub}
              </span>
            </span>
            <ChevronLeft className="size-4 flex-none text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* owner account */}
      <h2 className="mb-2.5 mt-6 px-1 text-sm font-extrabold text-ink">
        حساب کاربری
      </h2>
      {owner && (
        <button
          onClick={() => navigate("/owner/account/edit")}
          className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-paper p-4 text-right"
        >
          <div className="flex size-12 flex-none items-center justify-center rounded-full bg-primary/15 text-xl font-black text-primary">
            {owner.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-extrabold text-ink">{owner.name}</div>
            <div dir="ltr" className="mt-0.5 text-right text-xs font-semibold text-muted-foreground">
              {formatPhone(owner.phone)}
            </div>
          </div>
          <Pencil className="size-4 flex-none text-muted-foreground" />
        </button>
      )}
      <button
        onClick={handleLogout}
        className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-destructive/20 p-3.5 text-right"
      >
        <span className="flex size-9 flex-none items-center justify-center rounded-lg bg-destructive/10">
          <LogOut className="size-4 text-destructive" />
        </span>
        <span className="flex-1 text-sm font-extrabold text-destructive">
          خروج از حساب کاربری
        </span>
      </button>
    </div>
  );
}
