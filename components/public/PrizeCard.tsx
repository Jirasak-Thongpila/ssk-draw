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
      label: "Grand Prize (รางวัลใหญ่)",
      badgeVariant: "gold",
      borderClass: "border-amber-500/40 hover:border-amber-500/70 shadow-lg shadow-amber-500/5",
    },
    first: {
      label: "รางวัลที่ 1",
      badgeVariant: "gold",
      borderClass: "border-amber-500/30 hover:border-amber-500/50",
    },
    second: {
      label: "รางวัลที่ 2",
      badgeVariant: "emerald",
      borderClass: "border-emerald-500/30 hover:border-emerald-500/50",
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
        {/* Header: Tier & Round */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant={config.badgeVariant} className="text-xs">
            {config.label}
          </Badge>
          <span className="text-xs font-mono text-muted-foreground bg-slate-800/80 px-2 py-0.5 rounded">
            {prize.round}
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
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-3 pt-6">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-400" />
                <span>มีผู้ได้รับรางวัลแล้ว!</span>
              </div>
              <div className="text-sm font-medium text-foreground truncate mt-0.5">
                {prize.winner?.name}
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <h4 className="text-base font-semibold text-foreground group-hover:text-amber-400 transition-colors line-clamp-1">
          {prize.title}
        </h4>

        {/* Description */}
        {prize.description && (
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
            {prize.description}
          </p>
        )}
      </div>

      {/* Footer Info: Remaining Count & Winner/Action */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">คงเหลือ:</span>
          <span
            className={`font-mono font-semibold ${
              prize.remaining === 0 ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {prize.remaining}
          </span>
          <span className="text-muted-foreground font-mono">/ {prize.quantity}</span>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground group-hover:text-foreground font-medium transition-colors">
          <span>ดูรายละเอียด</span>
          <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}
