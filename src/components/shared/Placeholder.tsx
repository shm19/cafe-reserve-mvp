import { Link } from "react-router-dom";
import { Construction } from "lucide-react";

/** Temporary stub for screens not built yet. Replace per the roadmap. */
export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-20 text-center">
      <Construction className="size-10 text-sage" />
      <h1 className="text-lg font-extrabold text-ink">{title}</h1>
      <p className="text-sm text-muted-foreground">
        این صفحه طبق رودمپ ساخته می‌شود.
      </p>
      <Link to="/app" className="text-sm font-bold text-primary">
        بازگشت به خانه
      </Link>
    </div>
  );
}
