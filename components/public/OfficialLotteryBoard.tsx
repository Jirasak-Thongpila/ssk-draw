"use client";

import Link from "next/link";
import { SerializablePrize } from "@/actions/prize-actions";
import { Download, Info, Shield, ChevronRight } from "lucide-react";

interface OfficialLotteryBoardProps {
  prizes: SerializablePrize[];
}

export function OfficialLotteryBoard({ prizes }: OfficialLotteryBoardProps) {
  // Map prizes from backend database
  const grandPrize = prizes.find((p) => p.tier === "grand") || prizes[0];
  const adjacentPrize = prizes.find((p) => p.tier === "adjacent") || prizes[1];
  const secondPrize = prizes.find((p) => p.tier === "first") || prizes[2];
  const thirdPrize = prizes.find((p) => p.tier === "second") || prizes[3];
  const fourthPrize = prizes.find((p) => p.tier === "third") || prizes[4];
  const fifthPrize = prizes.find((p) => p.tier === "fourth") || prizes[5];
  const suffix3Prize = prizes.find((p) => p.tier === "suffix3") || prizes[6];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-6xl mx-auto rounded-3xl bg-linear-to-b from-[#e8f2ff] via-[#f3f7fd] to-[#e4eefb] p-4 sm:p-7 md:p-9 shadow-2xl border border-blue-200/90 relative overflow-hidden text-slate-900 font-sans">
      {/* Discrete Admin Link at top right */}
      <div className="absolute top-4 right-4 z-20">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-white/70 hover:bg-white text-slate-600 hover:text-[#0a2558] border border-blue-200/80 transition-all shadow-2xs backdrop-blur-xs"
        >
          <Shield className="h-3 w-3 text-amber-500" />
          <span>จัดการหลังบ้าน (Admin)</span>
        </Link>
      </div>

      {/* Background Radiance & Golden Ribbon Confetti Accents */}
      <div className="absolute top-3 left-8 w-3.5 h-9 bg-amber-400/50 rounded-full rotate-45 blur-[0.3px] pointer-events-none" />
      <div className="absolute top-14 left-1/4 w-2.5 h-6 bg-amber-300/60 rounded-full -rotate-15 pointer-events-none" />
      <div className="absolute top-8 right-16 w-4 h-9 bg-amber-400/50 rounded-full -rotate-45 blur-[0.3px] pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-3 h-7 bg-amber-300/60 rounded-full rotate-30 pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-sky-300/15 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header with Golden Laurels & Official Title */}
      <div className="relative z-10 text-center space-y-2 mb-6 pt-2">
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          {/* Left Golden Laurel Wreath */}
          <svg
            className="w-8 h-12 sm:w-11 sm:h-16 text-amber-500 shrink-0 drop-shadow-2xs"
            viewBox="0 0 40 60"
            fill="currentColor"
          >
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

          {/* Right Golden Laurel Wreath */}
          <svg
            className="w-8 h-12 sm:w-11 sm:h-16 text-amber-500 scale-x-[-1] shrink-0 drop-shadow-2xs"
            viewBox="0 0 40 60"
            fill="currentColor"
          >
            <path d="M22,12 C18,10 12,12 10,16 C12,18 18,17 22,12 Z" />
            <path d="M25,22 C20,20 14,23 12,28 C15,29 21,27 25,22 Z" />
            <path d="M28,33 C23,32 17,35 15,40 C19,41 24,38 28,33 Z" />
            <path d="M32,44 C27,43 21,47 20,52 C23,53 28,49 32,44 Z" />
          </svg>
        </div>

        {/* Navy Pill Sub-badge */}
        <div className="inline-block">
          <div className="bg-[#0a2558] text-white px-7 sm:px-9 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-md tracking-wider">
            จากการจับฉลาก Lucky Draw
          </div>
        </div>
      </div>

      {/* 2. Top Hero Card: รางวัลที่ 1 */}
      {grandPrize && (
        <div className="relative rounded-2xl border-2 border-[#f5be50] bg-linear-to-r from-[#fff9eb] via-[#ffffff] to-[#fffdf5] p-4 sm:p-5 shadow-lg mb-5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
            {/* Left Ribbon & Prize Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 w-full lg:w-auto text-center sm:text-left">
              <div className="bg-linear-to-r from-[#e5a01d] via-[#f59e0b] to-[#f7c84c] text-white font-extrabold text-sm sm:text-base px-6 py-2 rounded-xl shadow-md whitespace-nowrap">
                รางวัลที่ 1
              </div>

              <div>
                <span className="text-[11px] text-amber-800 font-bold block uppercase tracking-wider">
                  {grandPrize.unit ? `รางวัลละ ๑ ${grandPrize.unit}` : "เงินรางวัล"}
                </span>
                <h3 className="text-base sm:text-lg font-black text-[#0a2558] leading-tight">
                  {grandPrize.title.replace("รางวัลที่ ๑ ", "")}
                </h3>
                <span className="text-xs font-semibold text-amber-600">
                  จำนวน {grandPrize.quantity} {grandPrize.unit || "รางวัล"}
                </span>
              </div>
            </div>

            {/* Center: เลขรางวัล (Huge Monospace Number) */}
            <div className="text-center bg-white border border-amber-200 rounded-xl px-6 py-2.5 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
                เลขรางวัล
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
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black font-mono tracking-wider text-[#0a2558]">
                    913106
                  </span>
                )}
              </div>
            </div>

            {/* Right: Boxed Numbers (Prefix / Suffix / 2-digit) */}
            <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto justify-center">
              <div className="text-center bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-2xs min-w-[70px]">
                <span className="text-[10px] font-bold text-slate-500 block mb-0.5 whitespace-nowrap">
                  เลขหน้า 3 ตัว
                </span>
                <span className="text-base sm:text-lg font-black font-mono text-[#0a2558]">
                  722 839
                </span>
              </div>

              <div className="text-center bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-2xs min-w-[70px]">
                <span className="text-[10px] font-bold text-slate-500 block mb-0.5 whitespace-nowrap">
                  เลขท้าย 3 ตัว
                </span>
                <span className="text-base sm:text-lg font-black font-mono text-[#0a2558]">
                  {suffix3Prize?.winningNumbers?.[0] ? `${suffix3Prize.winningNumbers[0]} 922` : "343 922"}
                </span>
              </div>

              <div className="text-center bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-2xs min-w-[60px]">
                <span className="text-[10px] font-bold text-slate-500 block mb-0.5 whitespace-nowrap">
                  เลขท้าย 2 ตัว
                </span>
                <span className="text-base sm:text-lg font-black font-mono text-[#0a2558]">
                  70
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Middle Two-Column Grid: รางวัลข้างเคียงรางวัลที่ 1 & รางวัลที่ 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Left Card: รางวัลข้างเคียงรางวัลที่ 1 */}
        {adjacentPrize && (
          <div className="rounded-xl border border-blue-200 bg-white p-3.5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-100 gap-1.5">
              <span className="bg-[#0a2558] text-white text-xs font-bold px-3 py-1 rounded-md inline-block w-fit">
                รางวัลข้างเคียงรางวัลที่ 1
              </span>
              <span className="text-xs text-slate-600 font-semibold">
                {adjacentPrize.title.replace("รางวัลข้างเคียงรางวัลที่ ๑ ", "")} ({adjacentPrize.quantity} {adjacentPrize.unit})
              </span>
            </div>

            <div className="pt-2.5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {adjacentPrize.winningNumbers && adjacentPrize.winningNumbers.length > 0 ? (
                  adjacentPrize.winningNumbers.map((num, i) => (
                    <div
                      key={i}
                      className="bg-white border border-slate-200 rounded-lg py-2 text-center font-mono font-black text-base text-[#0a2558] shadow-2xs"
                    >
                      {num}
                    </div>
                  ))
                ) : (
                  ["913105", "913107"].map((num, i) => (
                    <div
                      key={i}
                      className="bg-white border border-slate-200 rounded-lg py-2 text-center font-mono font-black text-base text-[#0a2558] shadow-2xs"
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
          <div className="rounded-xl border border-blue-200 bg-white p-3.5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-100 gap-1.5">
              <span className="bg-[#0a2558] text-white text-xs font-bold px-3 py-1 rounded-md inline-block w-fit">
                รางวัลที่ 2
              </span>
              <span className="text-xs text-slate-600 font-semibold">
                {secondPrize.title.replace("รางวัลที่ ๒ ", "")} ({secondPrize.quantity} {secondPrize.unit})
              </span>
            </div>

            <div className="pt-2.5">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                {secondPrize.winningNumbers && secondPrize.winningNumbers.length > 0 ? (
                  secondPrize.winningNumbers.map((num, i) => (
                    <div
                      key={i}
                      className="bg-white border border-slate-200 rounded-lg py-2 text-center font-mono font-black text-sm sm:text-base text-[#0a2558] shadow-2xs"
                    >
                      {num}
                    </div>
                  ))
                ) : (
                  ["000698", "241203", "326201", "597127", "720822"].map((num, i) => (
                    <div
                      key={i}
                      className="bg-white border border-slate-200 rounded-lg py-2 text-center font-mono font-black text-sm sm:text-base text-[#0a2558] shadow-2xs"
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
        <div className="rounded-xl border border-blue-200 bg-white overflow-hidden shadow-xs mb-3.5">
          <div className="bg-[#0a2558] text-white px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="font-bold text-xs sm:text-sm">
              รางวัลที่ 3
            </span>
            <span className="text-xs text-blue-100 font-medium">
              {thirdPrize.title.replace("รางวัลที่ ๓ ", "")} • {thirdPrize.quantity} {thirdPrize.unit}
            </span>
          </div>

          <div className="p-2.5 bg-slate-50/40">
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-1.5">
              {(thirdPrize.winningNumbers && thirdPrize.winningNumbers.length >= 10
                ? thirdPrize.winningNumbers
                : [
                    ...(thirdPrize.winningNumbers || []),
                    "130058", "445816", "568483", "673045", "685393", "699517", "736123", "817045", "828112", "927626"
                  ].slice(0, 10)
              ).map((num, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-md py-1.5 text-center font-mono font-bold text-xs sm:text-sm text-[#0a2558] shadow-2xs hover:bg-blue-50 transition-colors"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Full-width Section: รางวัลที่ 4 */}
      {fourthPrize && (
        <div className="rounded-xl border border-blue-200 bg-white overflow-hidden shadow-xs mb-3.5">
          <div className="bg-[#0a2558] text-white px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="font-bold text-xs sm:text-sm">
              รางวัลที่ 4
            </span>
            <span className="text-xs text-blue-100 font-medium">
              {fourthPrize.title.replace("รางวัลที่ ๔ ", "")} • {fourthPrize.quantity} {fourthPrize.unit}
            </span>
          </div>

          <div className="p-2.5 bg-slate-50/40 space-y-1.5">
            {/* Grid Row 1 (10 numbers) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-1.5">
              {[
                "004398", "087247", "279275", "417233", "487498",
                "593341", "725552", "790442", "846959", "881626"
              ].map((num, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-md py-1.5 text-center font-mono font-bold text-xs sm:text-sm text-[#0a2558] shadow-2xs"
                >
                  {num}
                </div>
              ))}
            </div>
            {/* Grid Row 2 (10 numbers) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-1.5">
              {[
                "018155", "091849", "349403", "440875", "500093",
                "593871", "751210", "810991", "852951", "923884"
              ].map((num, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-md py-1.5 text-center font-mono font-bold text-xs sm:text-sm text-[#0a2558] shadow-2xs"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Full-width Section: รางวัลที่ 5 */}
      {fifthPrize && (
        <div className="rounded-xl border border-blue-200 bg-white overflow-hidden shadow-xs mb-5">
          <div className="bg-[#0a2558] text-white px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="font-bold text-xs sm:text-sm">
              รางวัลที่ 5
            </span>
            <span className="text-xs text-blue-100 font-medium">
              {fifthPrize.title.replace("รางวัลที่ ๕ ", "")} • {fifthPrize.quantity} {fifthPrize.unit}
            </span>
          </div>

          <div className="p-2.5 bg-slate-50/40 space-y-1.5">
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-1.5">
              {[
                "027676", "142621", "246107", "339087", "471605",
                "519388", "612465", "680955", "772285", "888100"
              ].map((num, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-md py-1.5 text-center font-mono font-bold text-xs sm:text-sm text-[#0a2558] shadow-2xs"
                >
                  {num}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-1.5">
              {[
                "054984", "158085", "248195", "348736", "477200",
                "521448", "628767", "689076", "773874", "903906"
              ].map((num, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-md py-1.5 text-center font-mono font-bold text-xs sm:text-sm text-[#0a2558] shadow-2xs"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. Footer Bar: Official Note & Download Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-blue-200/70 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Info className="h-4 w-4 text-blue-600 shrink-0" />
          <span>
            หมายเหตุ : รายชื่อผู้โชคดีและของรางวัลเป็นข้อมูลทางการ กรุณาตรวจสอบข้อมูลอย่างเป็นทางการจากผู้จัดงาน
          </span>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="bg-[#0a2558] hover:bg-[#12367a] text-white font-semibold px-5 py-2 rounded-full flex items-center gap-2 shadow-md transition-all cursor-pointer whitespace-nowrap text-xs"
        >
          <Download className="h-3.5 w-3.5" />
          <span>ดาวน์โหลดผลรางวัล</span>
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
