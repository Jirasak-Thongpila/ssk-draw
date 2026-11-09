"use client";

import { useState } from "react";
import { checkTicketResult } from "@/actions/prize-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trophy, Search, CheckCircle2, XCircle } from "lucide-react";

export function TicketChecker() {
  const [ticketInput, setTicketInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    won?: boolean;
    ticketNumber?: string;
    wins?: { prizeTitle: string; unit: string; matchedNumber: string }[];
    message?: string;
  } | null>(null);

  const handleCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ticketInput.trim()) return;

    setLoading(true);
    try {
      const res = await checkTicketResult(ticketInput);
      setResult(res);
    } catch {
      setResult({ won: false, message: "เกิดข้อผิดพลาดในการตรวจรางวัล" });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCheck = (num: string) => {
    setTicketInput(num);
    setLoading(true);
    checkTicketResult(num)
      .then((res) => setResult(res))
      .catch(() => setResult({ won: false, message: "เกิดข้อผิดพลาด" }))
      .finally(() => setLoading(false));
  };

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-card/80 backdrop-blur-md p-6 sm:p-8 shadow-xl relative overflow-hidden">
      <div className="max-w-2xl mx-auto space-y-4 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              ตรวจผลสลากกาชาด จังหวัดศรีสะเกษ
            </h3>
            <p className="text-xs text-muted-foreground">
              กรอกหมายเลขสลาก ๕ หลักเพื่อตรวจผลรางวัลที่ ๑ - ๕ และรางวัลเลขท้าย ๓ ตัว
            </p>
          </div>
        </div>

        <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              maxLength={5}
              placeholder="กรอกหมายเลขสลาก เช่น 25701"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value.replace(/\D/g, ""))}
              className="pl-10 h-11 text-base font-mono tracking-widest bg-background/80 text-foreground"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !ticketInput.trim()}
            className="h-11 px-6 font-semibold bg-amber-500 hover:bg-amber-400 text-black shrink-0"
          >
            {loading ? "กำลังตรวจสอบ..." : "ตรวจผลรางวัล"}
          </Button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
          <span className="text-muted-foreground">เลขตัวอย่างสำหรับทดสอบ:</span>
          <button
            type="button"
            onClick={() => handleQuickCheck("25701")}
            className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono hover:bg-slate-700 cursor-pointer border border-border"
          >
            25701 (รางวัลที่ ๑)
          </button>
          <button
            type="button"
            onClick={() => handleQuickCheck("13579")}
            className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono hover:bg-slate-700 cursor-pointer border border-border"
          >
            13579 (ทอง ๑ บาท)
          </button>
          <button
            type="button"
            onClick={() => handleQuickCheck("01570")}
            className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono hover:bg-slate-700 cursor-pointer border border-border"
          >
            ...570 (เลขท้าย ๓ ตัว)
          </button>
        </div>

        {/* Result Message Box */}
        {result && (
          <div
            className={`mt-4 p-4 rounded-xl border animate-in fade-in-0 duration-200 ${
              result.won
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-slate-900 border-border text-slate-400"
            }`}
          >
            {result.won ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>
                    ขอแสดงความยินดีด้วย! สลากหมายเลข{" "}
                    <span className="font-mono underline font-bold">
                      {result.ticketNumber}
                    </span>{" "}
                    ถูกรางวัล
                  </span>
                </div>
                <div className="space-y-1.5 pl-7">
                  {result.wins?.map((w, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-xs text-foreground"
                    >
                      <div className="font-semibold text-emerald-300 text-sm">
                        {w.prizeTitle}
                      </div>
                      <div className="text-muted-foreground text-[11px] mt-0.5">
                        ตรงกับหมายเลข: <span className="font-mono text-emerald-400">{w.matchedNumber}</span>
                      </div>
                    </div>
                  ))}
                  <p className="text-[11px] text-muted-foreground pt-1">
                    * กรุณานำสลากฉบับจริงติดต่อขอรับรางวัลได้ที่ สำนักงานเหล่ากาชาดจังหวัดศรีสะเกษ
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 text-xs">
                <XCircle className="h-4 w-4 text-slate-500 shrink-0" />
                <span>
                  สลากหมายเลข <span className="font-mono font-semibold text-slate-300">{result.ticketNumber}</span> ไม่ตรงกับรางวัลใดในระบบ หรือยังไม่ได้ประกาศผล
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
