import { NavLink } from "react-router-dom";
import { Home, CalendarCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/app", label: "خانه", icon: Home, end: true },
  { to: "/app/bookings", label: "رزروهای من", icon: CalendarCheck, end: false },
  { to: "/app/profile", label: "پروفایل", icon: User, end: false },
];

export function BottomNav() {
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
