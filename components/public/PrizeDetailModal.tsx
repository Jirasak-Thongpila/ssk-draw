"use client";

import { SerializablePrize } from "@/actions/prize-actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Gift, Clock, AlertCircle } from "lucide-react";

interface PrizeDetailModalProps {
  prize: SerializablePrize | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrizeDetailModal({
  prize,
  open,
  onOpenChange,
}: PrizeDetailModalProps) {
  if (!prize) return null;

  const isDrawn = prize.status === "drawn" && !!prize.winner?.name;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="gold" className="text-xs">
              {prize.tier === "grand"
                ? "รางวัลที่ ๑"
                : prize.tier === "adjacent"
                ? "ข้างเคียงรางวัลที่ ๑"
                : prize.tier === "first"
                ? "รางวัลที่ ๒"
                : prize.tier === "second"
                ? "รางวัลที่ ๓"
                : prize.tier === "third"
                ? "รางวัลที่ ๔"
                : prize.tier === "fourth"
                ? "รางวัลที่ ๕"
                : prize.tier === "suffix3"
                ? "รางวัลเลขท้าย ๓ ตัว"
                : "ของรางวัล"}
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              จำนวน {prize.quantity} {prize.unit}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold leading-snug">
            {prize.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 my-2">
          {/* Main Prize Image */}
          {prize.imageUrl ? (
            <div className="rounded-lg overflow-hidden border border-border bg-slate-950 aspect-16/9">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={prize.imageUrl}
                alt={prize.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-slate-900 aspect-16/9 flex items-center justify-center text-slate-500">
              <Gift className="h-16 w-16 stroke-1" />
            </div>
          )}

          {/* Description */}
          {prize.description && (
            <div>
              <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                รายละเอียดของรางวัล
              </h5>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {prize.description}
              </p>
            </div>
          )}

          {/* Winning Numbers if available */}
          {prize.winningNumbers && prize.winningNumbers.length > 0 && (
            <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <span className="text-xs font-semibold text-amber-400 block mb-1">
                หมายเลขสลากที่ถูกรางวัล:
              </span>
              <div className="flex flex-wrap gap-2">
                {prize.winningNumbers.map((num, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-black/60 border border-amber-500/40 font-mono font-bold text-amber-400 text-sm tracking-wider"
                  >
                    {prize.tier === "suffix3" ? `เลขท้าย: ${num}` : num}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stock & Status Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-slate-900/60 border border-border text-xs">
            <div>
              <span className="text-muted-foreground block mb-0.5">สถานะของรางวัล</span>
              {isDrawn ? (
                <span className="text-amber-400 font-semibold inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  มีผู้รับรางวัลแล้ว
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  รอผู้ถูกรางวัลนำสลากมาขอรับ
                </span>
              )}
            </div>

            <div>
              <span className="text-muted-foreground block mb-0.5">จำนวนของรางวัล</span>
              <span className="font-mono text-foreground font-semibold">
                {prize.quantity} {prize.unit}
              </span>
            </div>
          </div>

          {/* Official Terms Note from Document */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-border text-[11px] text-muted-foreground space-y-1">
            <div className="font-semibold text-slate-300 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-amber-400" />
              <span>เงื่อนไขการขอรับรางวัลสลากกาชาด:</span>
            </div>
            <p>ก. รางวัลจะจ่ายแก่ผู้ถือสลากฉบับที่ถูกรางวัลนำมาขอรับเท่านั้น</p>
            <p>ข. ออกรางวัลในวันจันทร์ที่ ๔ มกราคม ๒๕๗๐ เวลา ๒๐.๓๐ น. ณ บริเวณเวทีกลางฯ</p>
            <p>ค. ขอรับรางวัลได้ที่สำนักงานเหล่ากาชาดจังหวัดศรีสะเกษ ถึง วันที่ ๙ กุมภาพันธ์ ๒๕๗๐</p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            ปิดหน้าต่าง
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
