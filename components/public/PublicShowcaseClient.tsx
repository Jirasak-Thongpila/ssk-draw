"use client";

import { useState } from "react";
import { SerializablePrize } from "@/actions/prize-actions";
import { PrizeFilters } from "@/components/public/PrizeFilters";
import { PrizeGrid } from "@/components/public/PrizeGrid";
import { TicketChecker } from "@/components/public/TicketChecker";
import { OfficialLotteryBoard } from "@/components/public/OfficialLotteryBoard";
import { Calendar, MapPin, Phone, Table, LayoutGrid } from "lucide-react";

interface PublicShowcaseClientProps {
  initialPrizes: SerializablePrize[];
}

export function PublicShowcaseClient({ initialPrizes }: PublicShowcaseClientProps) {
  const [viewMode, setViewMode] = useState<"board" | "grid">("board");
  const [selectedRound, setSelectedRound] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [search, setSearch] = useState("");

  const rounds = Array.from(new Set(initialPrizes.map((p) => p.round))).filter(Boolean);

  const filteredPrizes = initialPrizes.filter((prize) => {
    if (search.trim() && !prize.title.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedRound !== "all" && prize.round !== selectedRound) {
      return false;
    }
    if (selectedStatus !== "all" && prize.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* 1. Official Red Cross Event Header & Terms Banner */}
      <section className="relative rounded-2xl border border-red-500/25 bg-linear-to-b from-red-950/30 via-card to-card p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-400">
            <span>สำนักงานเหล่ากาชาดจังหวัดศรีสะเกษ</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
            การออกรางวัลสลากกาชาด ประจำปี ๒๕๗๐
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            จำนวน ๙๙,๙๙๙ ฉบับ ฉบับละ ๑๐๐ บาท โดยมีรางวัลสลากกาชาด รวมทั้งสิ้น ๑๒๗ รางวัล
          </p>

          {/* Event Official Notice Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-border flex items-start gap-2.5">
              <Calendar className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground block">วันออกรางวัล</span>
                <span className="text-muted-foreground">
                  วันจันทร์ที่ ๔ มกราคม ๒๕๗๐ เวลา ๒๐.๓๐ น. ณ เวทีกลางฯ
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-border flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground block">สถานที่รับรางวัล</span>
                <span className="text-muted-foreground">
                  สำนักงานเหล่ากาชาดจังหวัดศรีสะเกษ (ถึง ๙ ก.พ. ๒๕๗๐)
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-border flex items-start gap-2.5">
              <Phone className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground block">ช่องทางตรวจผล</span>
                <span className="text-muted-foreground">
                  www.sisaket.go.th / โทร. ๐๔๕-๖๑๑๕๙๑
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Ticket Checker */}
      <section>
        <TicketChecker />
      </section>

      {/* 3. View Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h3 className="text-lg font-bold text-foreground">
            ตารางและรายการของรางวัลที่ออก
          </h3>
          <p className="text-xs text-muted-foreground">
            ข้อมูลอัปเดตตรงจากระบบหลังบ้าน ({initialPrizes.length} รายการที่เปิดเผยแพร่)
          </p>
        </div>

        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setViewMode("board")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "board"
                ? "bg-[#0a2558] text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Table className="h-3.5 w-3.5" />
            <span>ตารางประกาศผลทางการ</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>การ์ดจัดแสดงของรางวัล</span>
          </button>
        </div>
      </div>

      {/* 4. Display according to selected view mode */}
      {viewMode === "board" ? (
        <section className="animate-in fade-in-0 duration-300">
          <OfficialLotteryBoard prizes={initialPrizes} />
        </section>
      ) : (
        <section className="space-y-6 animate-in fade-in-0 duration-300">
          <PrizeFilters
            rounds={rounds}
            selectedRound={selectedRound}
            onSelectRound={setSelectedRound}
            selectedStatus={selectedStatus}
            onSelectStatus={setSelectedStatus}
            search={search}
            onSearchChange={setSearch}
            totalResults={filteredPrizes.length}
          />
          <PrizeGrid prizes={filteredPrizes} />
        </section>
      )}
    </div>
  );
}
