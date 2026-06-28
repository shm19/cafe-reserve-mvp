import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

/** Segmented control for people who are both a customer and a cafe owner —
 *  lets them hop between the user app and their manager panel. */
export function ViewSwitch({ current }: { current: "user" | "owner" }) {
  const navigate = useNavigate();
  const tab = (active: boolean) =>
    cn(
      "flex-1 rounded-xl py-2 text-sm font-extrabold transition-colors",
      active ? "bg-paper text-ink shadow-sm" : "text-muted-foreground"
    );
  return (
    <div className="mb-4 flex gap-1 rounded-2xl border border-border/60 bg-ink/[0.04] p-1">
      <button className={tab(current === "user")} onClick={() => navigate("/app/profile")}>
        نمای کاربری
      </button>
      <button className={tab(current === "owner")} onClick={() => navigate("/owner/profile")}>
        نمای مدیریت
      </button>
    </div>
  );
}
