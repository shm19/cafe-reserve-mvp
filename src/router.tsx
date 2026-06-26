import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import Auth from "@/pages/Auth";
import Home from "@/pages/Home";
import Placeholder from "@/pages/Placeholder";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/app" replace /> },
  { path: "/auth", element: <Auth /> },

  // B2C app (requires login; AppLayout guards + renders the phone shell)
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "cafe/:id", element: <Placeholder title="پروفایل کافه" /> },
      { path: "book/:cafeId", element: <Placeholder title="رزرو و هماهنگی" /> },
      { path: "bookings", element: <Placeholder title="رزروهای من" /> },
      { path: "booking/:id", element: <Placeholder title="جزئیات رزرو" /> },
      { path: "split/:bookingId", element: <Placeholder title="تقسیم دُنگ" /> },
      { path: "profile", element: <Placeholder title="پروفایل و کیف پول" /> },
    ],
  },

  // B2B-lite (owner) — built Day 2
  { path: "/owner", element: <Placeholder title="پنل کافه‌دار" /> },
  { path: "/owner/*", element: <Placeholder title="پنل کافه‌دار" /> },

  // Superadmin — built Day 2
  { path: "/admin", element: <Placeholder title="پنل ادمین" /> },
  { path: "/admin/*", element: <Placeholder title="پنل ادمین" /> },

  { path: "*", element: <Navigate to="/app" replace /> },
]);
