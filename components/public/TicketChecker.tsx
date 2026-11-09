"use client";

import { useState } from "react";
import { checkTicketResult } from "@/actions/prize-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Search, Ticket, XCircle } from "lucide-react";

export function TicketChecker() {
  const [ticketInput, setTicketInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<
    Awaited<ReturnType<typeof checkTicketResult>> | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\d{5}$/.test(ticketInput)) return;

    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await checkTicketResult(ticketInput);
      if (res.success) {
        setResult(res);
      } else {
        setError(res.message ?? "ไม่สามารถตรวจผลสลากได้ กรุณาลองใหม่อีกครั้ง");
      }
    } catch (caughtError) {
      console.error("Failed to check ticket result:", caughtError);
      setError("ไม่สามารถตรวจผลสลากได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <Ticket aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-primary">
              TICKET CHECKER
            </p>
            <h2 className="mt-1 text-xl font-bold text-foreground">
              ตรวจผลสลากของคุณ
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              กรอกหมายเลขสลาก 5 หลัก เพื่อตรวจรางวัลที่ประกาศแล้ว
            </p>
          </div>
        </div>

        <form onSubmit={handleCheck} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="text"
              maxLength={5}
              minLength={5}
              required
              inputMode="numeric"
              pattern="[0-9]{5}"
              autoComplete="off"
              aria-label="หมายเลขสลาก 5 หลัก"
              placeholder="กรอกหมายเลขสลาก 5 หลัก"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value.replace(/\D/g, ""))}
              className="h-12 bg-background pl-10 font-mono text-lg tracking-[0.2em] text-foreground"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !/^\d{5}$/.test(ticketInput)}
            className="h-12 shrink-0 px-6 font-semibold"
          >
            {loading ? "กำลังตรวจสอบ..." : "ตรวจสลาก"}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground">
          ระบบจะตรวจทั้งเลขสลากตรงรางวัลและเลขท้าย 3 ตัว โดยใช้เฉพาะผลที่ประกาศแล้ว
        </p>

        {error && (
          <p
            className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}

        {result?.success && (
          <div
            role="status"
            aria-live="polite"
            className={`rounded-2xl border p-4 ${
              result.won
                ? "border-emerald-600/25 bg-emerald-50 text-emerald-900"
                : "border-border bg-muted/50 text-muted-foreground"
            }`}
          >
            {result.won ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0" />
                  <span>
                    ยินดีด้วย สลากหมายเลข{" "}
                    <span className="font-mono">{result.ticketNumber}</span>{" "}
                    ถูกรางวัล
                  </span>
                </div>
                <div className="space-y-2 sm:pl-7">
                  {result.wins?.map((w, idx) => (
                    <div
                      key={`${w.tier}-${w.prizeTitle}-${idx}`}
                      className="rounded-xl border border-emerald-700/10 bg-white/70 p-3 text-sm"
                    >
                      <p className="font-semibold">{w.prizeTitle}</p>
                      <p className="mt-1 text-xs text-emerald-800/80">
                        {w.matchedNumber} · {w.unit}
                      </p>
                    </div>
                  ))}
                  <p className="pt-1 text-xs text-muted-foreground">
                    กรุณานำสลากฉบับจริงติดต่อขอรับรางวัลที่สำนักงานเหล่ากาชาดจังหวัดศรีสะเกษ
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 text-sm">
                <XCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  สลากหมายเลข{" "}
                  <span className="font-mono font-semibold text-foreground">
                    {result.ticketNumber}
                  </span>{" "}
                  ยังไม่ตรงกับรางวัลที่ประกาศในระบบ
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
