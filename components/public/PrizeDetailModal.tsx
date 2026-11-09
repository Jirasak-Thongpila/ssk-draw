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
import { Trophy, CheckCircle2, Gift, Clock, Calendar } from "lucide-react";

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
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="gold" className="text-xs">
              {prize.tier === "grand"
                ? "Grand Prize"
                : prize.tier === "first"
                ? "รางวัลที่ 1"
                : prize.tier === "second"
                ? "รางวัลที่ 2"
                : "รางวัล"}
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              {prize.round}
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

          {/* Stock & Status Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-slate-900/60 border border-border text-xs">
            <div>
              <span className="text-muted-foreground block mb-0.5">สถานะของรางวัล</span>
              {isDrawn ? (
                <span className="text-amber-400 font-semibold inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  จับฉลากแล้ว
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  พร้อมจับรางวัล
                </span>
              )}
            </div>

            <div>
              <span className="text-muted-foreground block mb-0.5">จำนวนคงเหลือ</span>
              <span className="font-mono text-foreground font-semibold">
                {prize.remaining} / {prize.quantity} รางวัล
              </span>
            </div>
          </div>

          {/* Winner Announcement Card if drawn */}
          {isDrawn && (
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Trophy className="h-4 w-4" />
                <span>ขอแสดงความยินดีกับผู้ได้รับรางวัล!</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="text-foreground text-sm font-semibold">
                  ผู้โชคดี: {prize.winner?.name}
                </div>
                {prize.winner?.ticketNumber && (
                  <div className="text-slate-300 font-mono">
                    หมายเลขฉลาก: {prize.winner.ticketNumber}
                  </div>
                )}
                {prize.winner?.announcedAt && (
                  <div className="text-muted-foreground flex items-center gap-1 text-[11px] pt-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      ประกาศผลเมื่อ:{" "}
                      {new Date(prize.winner.announcedAt).toLocaleString("th-TH")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
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
