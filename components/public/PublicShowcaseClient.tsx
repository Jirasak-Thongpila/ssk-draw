"use client";

import { useState } from "react";
import { SerializablePrize } from "@/actions/prize-actions";
import { PrizeFilters } from "@/components/public/PrizeFilters";
import { PrizeGrid } from "@/components/public/PrizeGrid";
import { Flame } from "lucide-react";

interface PublicShowcaseClientProps {
  initialPrizes: SerializablePrize[];
}

export function PublicShowcaseClient({ initialPrizes }: PublicShowcaseClientProps) {
  const [selectedRound, setSelectedRound] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [search, setSearch] = useState("");

  // Extract distinct rounds
  const rounds = Array.from(new Set(initialPrizes.map((p) => p.round))).filter(Boolean);

  // Filter client-side based on the safe, published prizes passed from server
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
      {/* Hero Showcase Banner */}
      <section className="relative rounded-2xl border border-amber-500/20 bg-linear-to-b from-amber-500/10 via-card/50 to-card p-6 sm:p-10 overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute -top-24 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Flame className="h-3.5 w-3.5" />
            <span>งานกิจกรรมจับฉลากประจำปี 2026</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            มหกรรมลุ้นของรางวัลสุดยิ่งใหญ่
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
            ร่วมลุ้นของรางวัลสุดพรีเมียมจากหลากหลายรอบกิจกรรม
            ตรวจสอบรายชื่อของรางวัลที่พร้อมแจก และประกาศผลผู้โชคดีแบบเรียลไทม์
          </p>
        </div>
      </section>

      {/* Filter and Showcase Section */}
      <section className="space-y-6">
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
