"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PrizeFiltersProps {
  rounds: string[];
  selectedRound: string;
  onSelectRound: (round: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  totalResults: number;
}

export function PrizeFilters({
  rounds,
  selectedRound,
  onSelectRound,
  selectedStatus,
  onSelectStatus,
  search,
  onSearchChange,
  totalResults,
}: PrizeFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search Bar & Round Pills */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Round Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => onSelectRound("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border cursor-pointer whitespace-nowrap transition-all ${
              selectedRound === "all"
                ? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
                : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-slate-700"
            }`}
          >
            ทุกรอบกิจกรรม
          </button>

          {rounds.map((round) => (
            <button
              key={round}
              type="button"
              onClick={() => onSelectRound(round)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border cursor-pointer whitespace-nowrap transition-all ${
                selectedRound === round
                  ? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-slate-700"
              }`}
            >
              {round}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="ค้นหาชื่อของรางวัล..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 bg-card/60"
          />
        </div>
      </div>

      {/* Sub-bar: Status Tabs & Results Count */}
      <div className="flex items-center justify-between border-t border-border/80 pt-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground hidden sm:inline">สถานะ:</span>
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-border">
            <button
              type="button"
              onClick={() => onSelectStatus("all")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                selectedStatus === "all"
                  ? "bg-slate-800 text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ทั้งหมด
            </button>
            <button
              type="button"
              onClick={() => onSelectStatus("available")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                selectedStatus === "available"
                  ? "bg-slate-800 text-emerald-400 font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ยังไม่แจก
            </button>
            <button
              type="button"
              onClick={() => onSelectStatus("drawn")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                selectedStatus === "drawn"
                  ? "bg-slate-800 text-amber-400 font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              จับฉลากแล้ว
            </button>
          </div>
        </div>

        <div className="text-muted-foreground font-mono">
          พบ <span className="text-foreground font-semibold">{totalResults}</span> รางวัลที่เผยแพร่
        </div>
      </div>
    </div>
  );
}
