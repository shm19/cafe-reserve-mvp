import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Pencil,
  Images,
  ChevronLeft,
  Star,
} from "lucide-react";
import { useOwnerCafe } from "@/hooks/useOwner";
import { useAuthStore } from "@/store/authStore";
import { faNum } from "@/lib/utils";

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
  const { data: cafe } = useOwnerCafe(owner?.id ?? "");

  return (
    <div className="px-5 pt-5">
      <h1 className="mb-4 text-2xl font-black text-ink">پروفایل کافه</h1>

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
    </div>
  );
}
