import { createBrowserRouter, Navigate } from "react-router-dom";
import { RequireAuth } from "@/layouts/RequireAuth";
import { AppLayout } from "@/layouts/AppLayout";
import { DetailLayout } from "@/layouts/DetailLayout";
import Auth from "@/pages/Auth";
import Home from "@/pages/Home";
import CafeProfile from "@/pages/CafeProfile";
import Booking from "@/pages/Booking";
import MyBookings from "@/pages/MyBookings";
import BookingDetails from "@/pages/BookingDetails";
import Placeholder from "@/pages/Placeholder";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/app" replace /> },
  { path: "/auth", element: <Auth /> },

  // Everything under /app requires login (RequireAuth), then splits into:
  //  - AppLayout: tab screens with the bottom nav
  //  - DetailLayout: full-screen detail pages with their own CTA, no nav
  {
    path: "/app",
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "bookings", element: <MyBookings /> },
          { path: "profile", element: <Placeholder title="پروفایل و کیف پول" /> },
        ],
      },
      {
        element: <DetailLayout />,
        children: [
          { path: "cafe/:id", element: <CafeProfile /> },
          { path: "book/:cafeId", element: <Booking /> },
          { path: "booking/:id", element: <BookingDetails /> },
          { path: "split/:bookingId", element: <Placeholder title="تقسیم دُنگ" /> },
        ],
      },
    ],
  },

  // B2B-lite (owner) + Superadmin — built later
  { path: "/owner/*", element: <Placeholder title="پنل کافه‌دار" /> },
  { path: "/admin/*", element: <Placeholder title="پنل ادمین" /> },

  { path: "*", element: <Navigate to="/app" replace /> },
]);
