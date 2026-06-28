/** Label/value row used in booking detail cards. */
export function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 py-3 last:border-0">
      <span className="text-xs font-semibold text-ink/60">{label}</span>
      <span className="text-sm font-extrabold text-ink">{children}</span>
    </div>
  );
}
