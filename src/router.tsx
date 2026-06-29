import { createBrowserRouter, Navigate } from "react-router-dom";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import { DetailLayout } from "@/components/layout/DetailLayout";
import { OwnerLayout } from "@/components/layout/OwnerLayout";
import OwnerDashboard from "@/pages/owner/Dashboard/Main";
import OwnerProfileHub from "@/pages/owner/Profile/Main";
import OwnerReviews from "@/pages/owner/Reviews/Main";
import OwnerReports from "@/pages/owner/Reports/Main";
import OwnerEdit from "@/pages/owner/Edit/Main";
import OwnerPhotos from "@/pages/owner/Photos/Main";
import Auth from "@/pages/Auth/Main";
import AddCafe from "@/pages/AddCafe/Main";
import GuestBooking from "@/pages/GuestBooking/Main";
import Home from "@/pages/Home/Main";
import CafeList from "@/pages/CafeList/Main";
import CafeProfile from "@/pages/CafeProfile/Main";
import ReviewSubmit from "@/pages/CafeProfile/ReviewSubmit";
import Booking from "@/pages/Booking/Main";
import MyBookings from "@/pages/MyBookings/Main";
import Profile from "@/pages/Profile/Main";
import EditAccount from "@/pages/Profile/Edit/Main";
import BookingDetails from "@/pages/BookingDetails/Main";
import SplitBill from "@/pages/Split/Main";
import Placeholder from "@/components/shared/Placeholder";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/app" replace /> },
  { path: "/auth", element: <Auth /> },
  // Public guest invite — no auth.
  { path: "/invite/:id", element: <GuestBooking /> },

  // Everything under /app requires login (RequireAuth), then splits into:
  //  - AppLayout: tab screens with the bottom nav
  //  - DetailLayout: full-screen detail pages with their own CTA, no nav
  {
    path: "/app",
    element: <RequireAuth />,
    children: [
      // Full-screen wizard (own header + footer, no nav).
      { path: "add-cafe", element: <AddCafe /> },
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "cafes/:section", element: <CafeList /> },
          { path: "bookings", element: <MyBookings /> },
          { path: "profile", element: <Profile /> },
        ],
      },
      {
        element: <DetailLayout />,
        children: [
          { path: "cafe/:id", element: <CafeProfile /> },
          { path: "cafe/:id/review", element: <ReviewSubmit /> },
          { path: "profile/edit", element: <EditAccount /> },
          { path: "book/:cafeId", element: <Booking /> },
          { path: "booking/:id", element: <BookingDetails /> },
          { path: "split/:bookingId", element: <SplitBill /> },
        ],
      },
    ],
  },

  // B2B-lite (owner)
  {
    path: "/owner",
    element: <OwnerLayout />,
    children: [
      { index: true, element: <OwnerDashboard /> },
      { path: "profile", element: <OwnerProfileHub /> },
      { path: "profile/reviews", element: <OwnerReviews /> },
      { path: "profile/edit", element: <OwnerEdit /> },
      { path: "profile/photos", element: <OwnerPhotos /> },
      { path: "account/edit", element: <EditAccount /> },
      { path: "reports", element: <OwnerReports /> },
    ],
  },

  // Superadmin — built later
  { path: "/admin/*", element: <Placeholder title="پنل ادمین" /> },

  { path: "*", element: <Navigate to="/app" replace /> },
]);
