import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Plus, X, Loader2, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateSplitBill } from "@/hooks/useSplitBills";
import { VAT_RATE } from "@/services/splitBill";
import { useAuthStore } from "@/store/authStore";
import { cn, faNum, faAmount, parseAmount, avatarColor } from "@/lib/utils";
import type { BookingWithCafe } from "@/types";

let pidSeq = 0;
const newPid = () => `p${++pidSeq}`;

interface Person {
  id: string;
  name: string;
  amount: string;
}

export function SplitSetup({ booking }: { booking?: BookingWithCafe }) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const create = useCreateSplitBill();

  const [total, setTotal] = useState("");
  const [vatOn, setVatOn] = useState(false);
  // Start with one row per person on the reservation; host (you) prefilled.
  const makeInitialPeople = (): Person[] => {
    const n = Math.max(booking?.partySize ?? 2, 2);
    return Array.from({ length: n }, (_, i) => ({
      id: newPid(),
      name: i === 0 ? user?.name ?? "من" : "",
      amount: "",
    }));
  };
  const [people, setPeople] = useState<Person[]>(makeInitialPeople);

  const totalNum = parseAmount(total);
  const amounts = people.map((p) => parseAmount(p.amount));
  const subtotal = amounts.reduce((a, b) => a + b, 0);
  // With VAT on, 9% is added to each person's share; "collected" is what the
  // group actually pays and must equal the entered bill total.
  const finals = amounts.map((a) => (vatOn ? Math.round(a * (1 + VAT_RATE)) : a));
  const collected = finals.reduce((a, b) => a + b, 0);
  const remaining = totalNum - collected;
  const namesOk = people.every((p) => p.name.trim());
  const valid =
    totalNum > 0 && remaining === 0 && namesOk && people.length >= 2;

  const update = (id: string, patch: Partial<Person>) =>
    setPeople((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const add = () =>
    setPeople((ps) => [...ps, { id: newPid(), name: "", amount: "" }]);
  const remove = (id: string) =>
    setPeople((ps) => (ps.length > 2 ? ps.filter((p) => p.id !== id) : ps));

  function reset() {
    setTotal("");
    setVatOn(false);
    setPeople(makeInitialPeople());
  }

  function confirm() {
    if (!valid || !user || !booking) return;
    create.mutate({
      bookingId: booking.id,
      total: totalNum,
      tax: collected - subtotal, // 0 when VAT is off
      createdBy: user.id,
      participants: people.map((p, i) => ({
        name: p.name.trim(),
        amount: finals[i],
      })),
    });
  }

  // validation bar appearance
  const bar =
    totalNum === 0
      ? { text: "مبلغ کل صورت‌حساب را وارد کنید", cls: "bg-muted text-muted-foreground" }
      : remaining > 0
        ? { text: `${faAmount(remaining)} تومان باقی‌مانده`, cls: "bg-accent/20 text-accent-ink" }
        : remaining < 0
          ? { text: `${faAmount(-remaining)} تومان بیشتر از مبلغ کل`, cls: "bg-rose/15 text-rose-ink" }
          : { text: "مبالغ با مبلغ کل برابر است ✓", cls: "bg-primary/12 text-primary" };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* header */}
      <div className="flex flex-none items-center justify-between px-4 pb-3 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex size-9 items-center justify-center rounded-xl border border-border bg-paper text-ink"
          aria-label="بازگشت"
        >
          <ArrowRight className="size-5" />
        </button>
        <h1 className="text-base font-black text-ink">محاسبه دُنگ</h1>
        <button
          onClick={reset}
          className="text-xs font-bold text-muted-foreground"
        >
          بازنشانی
        </button>
      </div>

      {/* body */}
      <div className="scrollbar-none flex-1 overflow-y-auto px-4 pb-4">
        {/* total + vat */}
        <div className="rounded-2xl border border-border/70 bg-paper p-4">
          <div className="mb-2.5 text-xs font-bold text-ink/60">
            مبلغ کل صورت‌حساب
          </div>
          <div className="flex items-baseline gap-2 border-b-2 border-primary/30 pb-2.5">
            <input
              value={total ? faAmount(parseAmount(total)) : ""}
              onChange={(e) => setTotal(e.target.value)}
              inputMode="numeric"
              placeholder="۰"
              className="min-w-0 flex-1 bg-transparent text-3xl font-black text-ink outline-none placeholder:text-ink/30"
            />
            <span className="flex-none text-sm font-bold text-muted-foreground">
              تومان
            </span>
          </div>
          <button
            onClick={() => setVatOn((v) => !v)}
            className="mt-3.5 flex w-full items-center justify-between"
          >
            <span className="flex items-center gap-2 text-xs font-bold text-ink/80">
              <Percent className="size-4 text-primary" />
              افزودن مالیات بر ارزش افزوده (۹٪)
            </span>
            <span
              className={cn(
                "relative h-6 w-10 rounded-full transition-colors",
                vatOn ? "bg-primary" : "bg-ink/15"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 size-5 rounded-full bg-white transition-all",
                  vatOn ? "left-0.5" : "right-0.5"
                )}
              />
            </span>
          </button>
          {vatOn && (
            <p className="mt-2.5 rounded-xl bg-primary/[0.07] px-3 py-2 text-xs leading-relaxed text-ink/60">
              ۹٪ مالیات به سهم هر نفر اضافه می‌شود تا با فاکتور نهایی همخوانی
              داشته باشد.
            </p>
          )}
        </div>

        {/* participants */}
        <div className="mb-3 mt-5 flex items-center justify-between px-1">
          <span className="text-sm font-extrabold text-ink">
            افراد و مبلغ سفارش
          </span>
          <span className="text-xs text-muted-foreground">
            {faNum(people.length)} نفر
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {people.map((p, i) => (
            <div
              key={p.id}
              className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-paper p-2.5"
            >
              <div
                className="flex size-9 flex-none items-center justify-center rounded-full text-sm font-extrabold text-white"
                style={{ backgroundColor: avatarColor(p.name || "?") }}
              >
                {(p.name || "؟").charAt(0)}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <input
                  value={p.name}
                  onChange={(e) => update(p.id, { name: e.target.value })}
                  placeholder="نام"
                  className="w-full bg-transparent text-sm font-extrabold text-ink outline-none placeholder:text-muted-foreground/70"
                />
                <input
                  value={p.amount ? faAmount(parseAmount(p.amount)) : ""}
                  onChange={(e) => update(p.id, { amount: e.target.value })}
                  inputMode="numeric"
                  placeholder="مبلغ سفارش"
                  className="w-full bg-transparent text-xs font-bold text-primary outline-none placeholder:text-muted-foreground/70"
                />
              </div>
              {i === 0 ? (
                <span className="flex-none rounded-full bg-primary/12 px-2.5 py-1 text-xs font-bold text-primary">
                  میزبان
                </span>
              ) : (
                <button
                  onClick={() => remove(p.id)}
                  className="flex size-7 flex-none items-center justify-center rounded-full bg-bg text-rose"
                  aria-label="حذف"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          ))}

          <button
            onClick={add}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-primary/40 text-sm font-extrabold text-primary"
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-white">
              <Plus className="size-3.5" />
            </span>
            افزودن فرد جدید
          </button>
        </div>
      </div>

      {/* footer */}
      <div className="flex-none border-t border-border bg-paper px-4 pb-6 pt-3">
        <div
          className={cn(
            "mb-3 flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold",
            bar.cls
          )}
        >
          <span>{bar.text}</span>
          {totalNum > 0 && (
            <span className="opacity-80">مجموع: {faAmount(collected)}</span>
          )}
        </div>
        <Button
          variant="cta"
          size="lg"
          className="w-full"
          disabled={!valid || create.isPending}
          onClick={confirm}
        >
          {create.isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            "تأیید و ساخت لینک"
          )}
        </Button>
      </div>
    </div>
  );
}
