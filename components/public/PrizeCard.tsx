"use client";

import { SerializablePrize } from "@/actions/prize-actions";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Gift, ChevronRight } from "lucide-react";

interface PrizeCardProps {
  prize: SerializablePrize;
  onClick: () => void;
}

export function PrizeCard({ prize, onClick }: PrizeCardProps) {
  const isDrawn = prize.status === "drawn" && !!prize.winner?.name;

  const tierConfig: Record<
    string,
    { label: string; badgeVariant: "gold" | "emerald" | "secondary" | "slate"; borderClass: string }
  > = {
    grand: {
      label: "รางวัลที่ ๑ (ใหญ่สุด)",
      badgeVariant: "gold",
      borderClass: "border-amber-500/50 hover:border-amber-500/80 shadow-lg shadow-amber-500/5",
    },
    adjacent: {
      label: "ข้างเคียงรางวัลที่ ๑",
      badgeVariant: "gold",
      borderClass: "border-amber-500/30 hover:border-amber-500/60",
    },
    first: {
      label: "รางวัลที่ ๒",
      badgeVariant: "gold",
      borderClass: "border-amber-500/30 hover:border-amber-500/50",
    },
    second: {
      label: "รางวัลที่ ๓",
      badgeVariant: "emerald",
      borderClass: "border-emerald-500/30 hover:border-emerald-500/50",
    },
    third: {
      label: "รางวัลที่ ๔",
      badgeVariant: "emerald",
      borderClass: "border-emerald-500/30 hover:border-emerald-500/50",
    },
    fourth: {
      label: "รางวัลที่ ๕",
      badgeVariant: "secondary",
      borderClass: "border-border hover:border-slate-700",
    },
    suffix3: {
      label: "เลขท้าย ๓ ตัว (๑๐๐ รางวัล)",
      badgeVariant: "secondary",
      borderClass: "border-cyan-500/30 hover:border-cyan-500/60",
    },
    consolation: {
      label: "รางวัลปลอบใจ",
      badgeVariant: "slate",
      borderClass: "border-border hover:border-slate-700",
    },
    special: {
      label: "รางวัลพิเศษ",
      badgeVariant: "secondary",
      borderClass: "border-border hover:border-slate-700",
    },
  };

  const config = tierConfig[prize.tier] || {
    label: prize.tier,
    badgeVariant: "secondary",
    borderClass: "border-border",
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative rounded-xl border bg-card text-card-foreground p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer hover:-translate-y-1 ${config.borderClass}`}
    >
      <div>
        {/* Header: Tier & Quantity */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant={config.badgeVariant} className="text-xs">
            {config.label}
          </Badge>
          <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
            จำนวน {prize.quantity} {prize.unit}
          </span>
        </div>

        {/* Image Container */}
        <div className="relative aspect-16/10 rounded-lg overflow-hidden bg-slate-950 border border-border/80 mb-4">
          {prize.imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={prize.imageUrl}
              alt={prize.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-500">
              <Gift className="h-10 w-10 stroke-1" />
            </div>
          )}

          {/* Winner Overlay Banner if drawn */}
          {isDrawn && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-3 pt-6">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-400" />
                <span>มีผู้ขอรับรางวัลแล้ว!</span>
              </div>
              <div className="text-sm font-medium text-foreground truncate mt-0.5">
                {prize.winner?.name}
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <h4 className="text-base font-semibold text-foreground group-hover:text-amber-400 transition-colors line-clamp-2">
          {prize.title}
        </h4>

        {/* Description */}
        {prize.description && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
            {prize.description}
          </p>
        )}
      </div>

      {/* Footer Info: Winning Numbers or Remaining */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          {prize.winningNumbers && prize.winningNumbers.length > 0 ? (
            <div className="text-[11px] text-muted-foreground truncate max-w-[170px]">
              เลขที่ออก:{" "}
              <span className="font-mono text-amber-400 font-semibold">
                {prize.winningNumbers.slice(0, 3).join(", ")}
                {prize.winningNumbers.length > 3 && ` (+${prize.winningNumbers.length - 3})`}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">คงเหลือ:</span>
              <span className="font-mono font-semibold text-emerald-400">
                {prize.remaining}
              </span>
              <span className="text-muted-foreground font-mono">/ {prize.quantity} {prize.unit}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-muted-foreground group-hover:text-foreground font-medium transition-colors shrink-0">
          <span>ดูรายละเอียด</span>
          <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}
