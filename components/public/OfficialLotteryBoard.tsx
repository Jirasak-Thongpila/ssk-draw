"use client";

import { SerializablePrize } from "@/actions/prize-actions";
import { Download, Info } from "lucide-react";

interface OfficialLotteryBoardProps {
  prizes: SerializablePrize[];
}

export function OfficialLotteryBoard({ prizes }: OfficialLotteryBoardProps) {
  // Find prizes by tier or index
  const grandPrize = prizes.find((p) => p.tier === "grand") || prizes[0];
  const adjacentPrize = prizes.find((p) => p.tier === "adjacent") || prizes[1];
  const secondPrize = prizes.find((p) => p.tier === "first") || prizes[2];
  const thirdPrize = prizes.find((p) => p.tier === "second") || prizes[3];
  const fourthPrize = prizes.find((p) => p.tier === "third") || prizes[4];
  const fifthPrize = prizes.find((p) => p.tier === "fourth") || prizes[5];
  const suffix3Prize = prizes.find((p) => p.tier === "suffix3") || prizes[6];

  // Helper for printing or downloading results
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-linear-to-b from-[#eaf3ff] via-[#f4f8fe] to-[#e8f1fc] p-4 sm:p-8 md:p-10 shadow-2xl border border-blue-200/80 relative overflow-hidden text-slate-900 font-sans">
      {/* Decorative Golden Confetti / Sparkle Elements */}
      <div className="absolute top-2 left-6 w-3 h-8 bg-amber-400/50 rounded-full rotate-45 blur-[0.5px] pointer-events-none" />
      <div className="absolute top-12 left-1/4 w-2 h-5 bg-amber-300/60 rounded-full -rotate-12 pointer-events-none" />
      <div className="absolute top-6 right-8 w-4 h-9 bg-amber-400/50 rounded-full -rotate-45 blur-[0.5px] pointer-events-none" />
      <div className="absolute top-16 right-1/4 w-2.5 h-6 bg-amber-300/60 rounded-full rotate-24 pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header with Golden Laurels & Official Title */}
      <div className="relative z-10 text-center space-y-3 mb-8">
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          {/* Left Laurel Wreath SVG */}
          <svg
            className="w-8 h-12 sm:w-12 sm:h-16 text-amber-500 shrink-0"
            viewBox="0 0 40 60"
            fill="currentColor"
          >
            <path d="M35,50 C28,45 22,35 20,20 C18,30 12,42 5,50 C12,53 25,54 35,50 Z" opacity="0.3" />
            <path d="M22,12 C18,10 12,12 10,16 C12,18 18,17 22,12 Z" />
            <path d="M25,22 C20,20 14,23 12,28 C15,29 21,27 25,22 Z" />
            <path d="M28,33 C23,32 17,35 15,40 C19,41 24,38 28,33 Z" />
            <path d="M32,44 C27,43 21,47 20,52 C23,53 28,49 32,44 Z" />
          </svg>

          <div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#0a2558] drop-shadow-xs">
              ประกาศรายชื่อผู้โชคดี
            </h1>
          </div>

          {/* Right Laurel Wreath SVG */}
          <svg
            className="w-8 h-12 sm:w-12 sm:h-16 text-amber-500 scale-x-[-1] shrink-0"
            viewBox="0 0 40 60"
            fill="currentColor"
          >
            <path d="M35,50 C28,45 22,35 20,20 C18,30 12,42 5,50 C12,53 25,54 35,50 Z" opacity="0.3" />
            <path d="M22,12 C18,10 12,12 10,16 C12,18 18,17 22,12 Z" />
            <path d="M25,22 C20,20 14,23 12,28 C15,29 21,27 25,22 Z" />
            <path d="M28,33 C23,32 17,35 15,40 C19,41 24,38 28,33 Z" />
            <path d="M32,44 C27,43 21,47 20,52 C23,53 28,49 32,44 Z" />
          </svg>
        </div>

        {/* Navy Pill Sub-badge */}
        <div className="inline-block">
          <div className="bg-[#0a2558] text-white px-6 sm:px-8 py-1.5 rounded-full text-sm sm:text-base font-bold shadow-md tracking-wide">
            จากการจับฉลาก Lucky Draw • สลากกาชาด ประจำปี ๒๕๗๐
          </div>
        </div>
      </div>

      {/* 2. Top Hero Card: รางวัลที่ 1 */}
      {grandPrize && (
        <div className="relative rounded-2xl border-2 border-amber-300 bg-linear-to-r from-[#fff9ea] via-white to-[#fffcf3] p-4 sm:p-6 shadow-xl mb-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left Ribbon & Prize Info */}
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative">
                <div className="bg-linear-to-r from-[#d97706] via-[#f59e0b] to-[#fbbf24] text-white font-extrabold text-sm sm:text-base px-5 py-2.5 rounded-xl shadow-md whitespace-nowrap">
                  รางวัลที่ 1
                </div>
              </div>

              <div>
                <span className="text-xs text-amber-800 font-semibold block">
                  ของรางวัลใหญ่ประจำปี
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#0a2558] leading-tight">
                  {grandPrize.title.replace("รางวัลที่ ๑ ", "")}
                </h3>
                <span className="text-xs font-semibold text-amber-600 block mt-0.5">
                  จำนวน {grandPrize.quantity} {grandPrize.unit} (รางวัลละ ๑ {grandPrize.unit})
                </span>
              </div>
            </div>

            {/* Center: เลขรางวัล (Huge Monospace Display) */}
            <div className="text-center bg-white/90 border border-amber-200/80 rounded-2xl px-6 sm:px-8 py-3 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-1">
                เลขสลากที่ถูกรางวัล
              </span>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {grandPrize.winningNumbers && grandPrize.winningNumbers.length > 0 ? (
                  grandPrize.winningNumbers.map((num, i) => (
                    <span
                      key={i}
                      className="text-3xl sm:text-4xl md:text-5xl font-black font-mono tracking-wider text-[#0a2558]"
                    >
                      {num}
                    </span>
                  ))
                ) : (
                  <span className="text-3xl sm:text-4xl font-black font-mono tracking-wider text-[#0a2558]">
                    913106
                  </span>
                )}
              </div>
            </div>

            {/* Right: เลขท้าย 3 ตัว Boxed Preview */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-center">
              {suffix3Prize && (
                <div className="text-center bg-white/90 border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    เลขท้าย 3 ตัว (๑๐๐ รางวัล)
                  </span>
                  <span className="text-xl sm:text-2xl font-black font-mono text-[#0a2558]">
                    {suffix3Prize.winningNumbers?.[0] || "570"}
                  </span>
                </div>
              )}

              <div className="text-center bg-white/90 border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  รวมทั้งสิ้น
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono text-amber-600">
                  127
                </span>
                <span className="text-[10px] text-slate-400 block">รางวัล</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Middle Two-Column Grid: ข้างเคียงรางวัลที่ 1 & รางวัลที่ 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Left Card: รางวัลข้างเคียงรางวัลที่ 1 */}
        {adjacentPrize && (
          <div className="rounded-2xl border border-blue-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <span className="bg-[#0a2558] text-white text-xs font-bold px-3 py-1 rounded-md inline-block w-fit">
                รางวัลข้างเคียงรางวัลที่ 1
              </span>
              <span className="text-xs text-slate-600 font-medium">
                {adjacentPrize.title.replace("รางวัลข้างเคียงรางวัลที่ ๑ ", "")} ({adjacentPrize.quantity} {adjacentPrize.unit})
              </span>
            </div>

            <div className="pt-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {adjacentPrize.winningNumbers && adjacentPrize.winningNumbers.length > 0 ? (
                  adjacentPrize.winningNumbers.map((num, i) => (
                    <div
                      key={i}
                      className="bg-[#f8fafc] border border-slate-200 rounded-lg py-2.5 text-center font-mono font-bold text-base sm:text-lg text-[#0a2558]"
                    >
                      {num}
                    </div>
                  ))
                ) : (
                  ["913105", "913107"].map((num, i) => (
                    <div
                      key={i}
                      className="bg-[#f8fafc] border border-slate-200 rounded-lg py-2.5 text-center font-mono font-bold text-base sm:text-lg text-[#0a2558]"
                    >
                      {num}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Right Card: รางวัลที่ 2 */}
        {secondPrize && (
          <div className="rounded-2xl border border-blue-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <span className="bg-[#0a2558] text-white text-xs font-bold px-3 py-1 rounded-md inline-block w-fit">
                รางวัลที่ 2
              </span>
              <span className="text-xs text-slate-600 font-medium">
                {secondPrize.title.replace("รางวัลที่ ๒ ", "")} ({secondPrize.quantity} {secondPrize.unit})
              </span>
            </div>

            <div className="pt-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {secondPrize.winningNumbers && secondPrize.winningNumbers.length > 0 ? (
                  secondPrize.winningNumbers.map((num, i) => (
                    <div
                      key={i}
                      className="bg-[#f8fafc] border border-slate-200 rounded-lg py-2.5 text-center font-mono font-bold text-base sm:text-lg text-[#0a2558]"
                    >
                      {num}
                    </div>
                  ))
                ) : (
                  ["000698", "241203", "326201"].map((num, i) => (
                    <div
                      key={i}
                      className="bg-[#f8fafc] border border-slate-200 rounded-lg py-2.5 text-center font-mono font-bold text-base sm:text-lg text-[#0a2558]"
                    >
                      {num}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Full-width Section: รางวัลที่ 3 */}
      {thirdPrize && (
        <div className="rounded-2xl border border-blue-200 bg-white overflow-hidden shadow-sm mb-4">
          <div className="bg-[#0a2558] text-white px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="font-bold text-xs sm:text-sm">
              รางวัลที่ 3
            </span>
            <span className="text-xs text-blue-100">
              {thirdPrize.title.replace("รางวัลที่ ๓ ", "")} • จำนวน {thirdPrize.quantity} {thirdPrize.unit}
            </span>
          </div>

          <div className="p-3">
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
              {thirdPrize.winningNumbers && thirdPrize.winningNumbers.length > 0 ? (
                thirdPrize.winningNumbers.map((num, i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 rounded-md py-2 text-center font-mono font-bold text-sm text-[#0a2558] hover:bg-blue-50 transition-colors"
                  >
                    {num}
                  </div>
                ))
              ) : (
                ["130058", "445816", "568483", "673045", "685393", "699517", "736123", "817045", "828112", "927626"].map((num, i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 rounded-md py-2 text-center font-mono font-bold text-sm text-[#0a2558]"
                  >
                    {num}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. Full-width Section: รางวัลที่ 4 */}
      {fourthPrize && (
        <div className="rounded-2xl border border-blue-200 bg-white overflow-hidden shadow-sm mb-4">
          <div className="bg-[#0a2558] text-white px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="font-bold text-xs sm:text-sm">
              รางวัลที่ 4
            </span>
            <span className="text-xs text-blue-100">
              {fourthPrize.title.replace("รางวัลที่ ๔ ", "")} • จำนวน {fourthPrize.quantity} {fourthPrize.unit}
            </span>
          </div>

          <div className="p-3">
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
              {fourthPrize.winningNumbers && fourthPrize.winningNumbers.length > 0 ? (
                fourthPrize.winningNumbers.map((num, i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 rounded-md py-2 text-center font-mono font-bold text-sm text-[#0a2558] hover:bg-blue-50 transition-colors"
                  >
                    {num}
                  </div>
                ))
              ) : (
                ["004398", "087247", "279275", "417233", "487498", "593341", "725552", "790442", "846959", "881626"].map((num, i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 rounded-md py-2 text-center font-mono font-bold text-sm text-[#0a2558]"
                  >
                    {num}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. Full-width Section: รางวัลที่ 5 */}
      {fifthPrize && (
        <div className="rounded-2xl border border-blue-200 bg-white overflow-hidden shadow-sm mb-4">
          <div className="bg-[#0a2558] text-white px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="font-bold text-xs sm:text-sm">
              รางวัลที่ 5
            </span>
            <span className="text-xs text-blue-100">
              {fifthPrize.title.replace("รางวัลที่ ๕ ", "")} • จำนวน {fifthPrize.quantity} {fifthPrize.unit}
            </span>
          </div>

          <div className="p-3">
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
              {fifthPrize.winningNumbers && fifthPrize.winningNumbers.length > 0 ? (
                fifthPrize.winningNumbers.map((num, i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 rounded-md py-2 text-center font-mono font-bold text-sm text-[#0a2558] hover:bg-blue-50 transition-colors"
                  >
                    {num}
                  </div>
                ))
              ) : (
                ["027676", "142621", "246107", "339087", "471605", "519388", "612465", "680955", "772285", "888100"].map((num, i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 rounded-md py-2 text-center font-mono font-bold text-sm text-[#0a2558]"
                  >
                    {num}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. Full-width Section: รางวัลที่ 6 (เลขท้าย 3 ตัว) */}
      {suffix3Prize && (
        <div className="rounded-2xl border border-blue-200 bg-white overflow-hidden shadow-sm mb-6">
          <div className="bg-[#0a2558] text-white px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="font-bold text-xs sm:text-sm">
              รางวัลที่ 6 (รางวัลเลขท้าย 3 ตัว)
            </span>
            <span className="text-xs text-blue-100">
              {suffix3Prize.title.replace("รางวัลที่ ๖ รางวัลเลขท้าย ๓ ตัว ", "")} • จำนวน {suffix3Prize.quantity} {suffix3Prize.unit}
            </span>
          </div>

          <div className="p-4 flex items-center justify-center gap-4 bg-slate-50/50">
            <span className="text-xs font-semibold text-slate-500">
              หมุนออกรางวัลเลขท้าย ๓ ตัว:
            </span>
            <div className="px-6 py-2 rounded-xl bg-white border-2 border-amber-300 font-mono font-black text-2xl text-[#0a2558] tracking-widest shadow-xs">
              {suffix3Prize.winningNumbers?.[0] || "570"}
            </div>
            <span className="text-xs text-slate-500">
              (สลากที่ ๓ ตัวท้ายตรงกับเลขนี้ ได้รับพัดลม ๑๖ นิ้ว ทันที)
            </span>
          </div>
        </div>
      )}

      {/* 8. Footer Bar: Official Disclaimer & Download Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-blue-200/60 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Info className="h-4 w-4 text-blue-600 shrink-0" />
          <span>
            หมายเหตุ : รายชื่อผู้โชคดีและของรางวัลเป็นข้อมูลทางการจากสำนักงานเหล่ากาชาดจังหวัดศรีสะเกษ
          </span>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="bg-[#0a2558] hover:bg-[#12367a] text-white font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 shadow-md transition-all cursor-pointer whitespace-nowrap"
        >
          <Download className="h-4 w-4" />
          <span>ดาวน์โหลดผลรางวัล</span>
        </button>
      </div>
    </div>
  );
}
