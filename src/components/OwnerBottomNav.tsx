import { NavLink } from "react-router-dom";
import { CalendarDays, Store, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/owner", label: "رزروها", icon: CalendarDays, end: true },
  { to: "/owner/profile", label: "پروفایل کافه", icon: Store, end: false },
  { to: "/owner/reports", label: "گزارشات مالی", icon: BarChart3, end: false },
];

export function OwnerBottomNav() {
  return (
    <nav className="flex-none flex items-center justify-around border-t border-border bg-paper px-4 pb-6 pt-2">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 text-xs font-semibold",
              isActive ? "text-primary" : "text-muted-foreground"
            )
          }
        >
          <Icon className="size-6" strokeWidth={2} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
