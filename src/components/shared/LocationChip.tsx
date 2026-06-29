import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { useCafes } from "@/hooks/useCafes";
import { reverseGeocodeDistrict } from "@/api/geo";
import { useLocationStore, type Coords } from "@/store/locationStore";
import { haversineM } from "@/lib/utils";

/** The "موقعیت شما" chip. Tapping it asks for the browser location, reverse-
 *  geocodes it to a district name, and persists it. Self-contained so home and
 *  the list page share one source of truth. */
export function LocationChip() {
  const { data: allCafes = [] } = useCafes();
  const district = useLocationStore((s) => s.district);
  const setLocation = useLocationStore((s) => s.setLocation);
  const [geo, setGeo] = useState<"idle" | "locating" | "denied">("idle");

  /** Nearest cafe's neighbourhood — offline fallback when geocoding fails. */
  function nearestNeighbourhood(c: Coords): string | null {
    return (
      [...allCafes].sort(
        (a, b) =>
          haversineM(c.lat, c.lng, a.lat, a.lng) -
          haversineM(c.lat, c.lng, b.lat, b.lng)
      )[0]?.neighborhood ?? null
    );
  }

  function locateMe() {
    if (!navigator.geolocation) return setGeo("denied");
    setGeo("locating");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const name =
          (await reverseGeocodeDistrict(c.lat, c.lng)) ?? nearestNeighbourhood(c);
        setLocation(name, c);
        setGeo("idle");
      },
      () => setGeo("denied"),
      { enableHighAccuracy: true, timeout: 10_000 }
    );
  }

  const label =
    geo === "locating"
      ? "در حال یافتن موقعیت…"
      : geo === "denied"
      ? "دسترسی به موقعیت رد شد"
      : district ?? "موقعیت فعلی (اطراف من)";

  return (
    <button
      onClick={locateMe}
      className="flex w-full items-center gap-2 rounded-2xl border border-border/60 bg-paper px-3 py-2 text-right shadow-sm"
    >
      {geo === "locating" ? (
        <Loader2 className="size-5 flex-none animate-spin text-cta" />
      ) : (
        <MapPin className="size-5 flex-none text-cta" />
      )}
      <div className="min-w-0">
        <div className="text-xs font-semibold text-muted-foreground">موقعیت شما</div>
        <div className="truncate text-sm font-extrabold text-ink">{label}</div>
      </div>
    </button>
  );
}
