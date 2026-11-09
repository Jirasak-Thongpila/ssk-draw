"use client";

import { useState } from "react";
import { SerializablePrize } from "@/actions/prize-actions";
import { PrizeFilters } from "@/components/public/PrizeFilters";
import { PrizeGrid } from "@/components/public/PrizeGrid";
import { TicketChecker } from "@/components/public/TicketChecker";
import { Calendar, MapPin, Phone } from "lucide-react";

interface PublicShowcaseClientProps {
  initialPrizes: SerializablePrize[];
}

export function PublicShowcaseClient({ initialPrizes }: PublicShowcaseClientProps) {
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
      {/* Official Red Cross Event Hero Banner */}
      <section className="relative rounded-2xl border border-red-500/25 bg-gradient-to-b from-red-950/30 via-card to-card p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-400">
            <span>สำนักงานเหล่ากาชาดจังหวัดศรีสะเกษ</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            เงื่อนไขรางวัลสลากกาชาด ประจำปี ๒๕๗๐
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            จำนวน ๙๙,๙๙๙ ฉบับ ฉบับละ ๑๐๐ บาท โดยมีรางวัลสลากกาชาด ประจำปี ๒๕๗๐ รวมทั้งสิ้น ๑๒๗ รางวัล
          </p>

          {/* Event Official Notice Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-border flex items-start gap-2.5">
              <Calendar className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground block">วันออกรางวัล</span>
                <span className="text-muted-foreground">
                  วันจันทร์ที่ ๔ มกราคม ๒๕๗๐ เวลา ๒๐.๓๐ น. ณ บริเวณเวทีกลางฯ
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-border flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground block">สถานที่รับรางวัล</span>
                <span className="text-muted-foreground">
                  สำนักงานเหล่ากาชาดจังหวัดศรีสะเกษ (๑๑ ม.ค. - ๙ ก.พ. ๒๕๗๐)
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-border flex items-start gap-2.5">
              <Phone className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground block">ช่องทางตรวจผล</span>
                <span className="text-muted-foreground">
                  www.sisaket.go.th / ศาลากลางฯ โทร. ๐๔๕-๖๑๑๕๙๑
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Ticket Checker */}
      <section>
        <TicketChecker />
      </section>

      {/* Prize Showcase List */}
      <section className="space-y-6">
        <div className="border-b border-border/80 pb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            รายการของรางวัลสลากกาชาด (๑๒๗ รางวัล)
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            แสดงเฉพาะรางวัลที่เปิดเผยแพร่จากหลังบ้าน
          </span>
        </div>

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
    </div>
  );
}
