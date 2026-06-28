import { MapPin, Phone, Navigation, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Cafe } from "@/types";

/** Cafe + location card shared by the booking-details and guest-invite pages:
 *  name, neighborhood, call, directions (Neshan), and parking note. */
export function BookingCafeCard({ cafe }: { cafe?: Cafe }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-paper p-4">
      <div className="flex items-center gap-3">
        <div
          className="size-14 flex-none rounded-xl"
          style={{ backgroundColor: cafe?.coverColor ?? "#E0D8CB" }}
        />
        <div className="min-w-0 flex-1">
          <div className="text-base font-extrabold text-ink">
            {cafe?.name ?? "کافه"}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5 text-sage" />
            {cafe?.neighborhood ?? "—"}
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2.5">
        <a
          href={cafe?.phone ? `tel:${cafe.phone}` : undefined}
          className={cn(
            "flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border/60 bg-bg text-xs font-extrabold text-ink/80",
            !cafe?.phone && "pointer-events-none opacity-50"
          )}
        >
          <Phone className="size-4 text-primary" />
          تماس با کافه
        </a>
        <a
          href={cafe ? `https://neshan.org/maps/@${cafe.lat},${cafe.lng},16z` : undefined}
          target="_blank"
          rel="noreferrer"
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border/60 bg-bg text-xs font-extrabold text-ink/80"
        >
          <Navigation className="size-4 text-primary" />
          مسیریابی
        </a>
      </div>
      {cafe?.tags.includes("parking") && (
        <div className="mt-3 flex gap-2 border-t border-border/50 pt-3">
          <Car className="mt-0.5 size-4 flex-none text-sage" />
          <p className="text-xs leading-relaxed text-ink/60">
            <b className="font-extrabold text-ink/80">وضعیت پارکینگ:</b> دارای جای
            پارک اختصاصی.
          </p>
        </div>
      )}
    </div>
  );
}
