"use client";

import { useState } from "react";
import { SerializablePrize } from "@/actions/prize-actions";
import { PrizeCard } from "@/components/public/PrizeCard";
import { PrizeDetailModal } from "@/components/public/PrizeDetailModal";
import { Gift } from "lucide-react";

interface PrizeGridProps {
  prizes: SerializablePrize[];
}

export function PrizeGrid({ prizes }: PrizeGridProps) {
  const [selectedPrize, setSelectedPrize] = useState<SerializablePrize | null>(null);

  if (prizes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-16 text-center bg-card/20">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-900 border border-border flex items-center justify-center text-slate-400 mb-4">
          <Gift className="h-7 w-7 stroke-1" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          ไม่พบของรางวัลที่ตรงกับเงื่อนไขการค้นหา
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          ลองเปลี่ยนรอบกิจกรรม หรือปรับตัวกรองสถานะ หรือเข้าสู่ระบบหลังบ้านเพื่อเพิ่มและเผยแพร่ของรางวัล
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {prizes.map((prize) => (
          <PrizeCard
            key={prize._id}
            prize={prize}
            onClick={() => setSelectedPrize(prize)}
          />
        ))}
      </div>

      <PrizeDetailModal
        prize={selectedPrize}
        open={!!selectedPrize}
        onOpenChange={(open) => {
          if (!open) setSelectedPrize(null);
        }}
      />
    </>
  );
}
