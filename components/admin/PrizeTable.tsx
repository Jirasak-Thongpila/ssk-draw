"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  SerializablePrize,
  togglePublishPrize,
  deletePrize,
} from "@/actions/prize-actions";
import {
  Trophy,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";

interface PrizeTableProps {
  prizes: SerializablePrize[];
  onEdit: (prize: SerializablePrize) => void;
  onDrawWinner: (prize: SerializablePrize) => void;
}

export function PrizeTable({ prizes, onEdit, onDrawWinner }: PrizeTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleTogglePublish = async (id: string) => {
    setLoadingId(id);
    try {
      await togglePublishPrize(id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`ต้องการลบของรางวัล "${title}" หรือไม่?`)) return;
    setLoadingId(id);
    try {
      await deletePrize(id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const tierBadges: Record<
    string,
    { label: string; badgeClass: string }
  > = {
    grand: {
      label: "รางวัลที่ ๑",
      badgeClass: "bg-amber-50 text-amber-800 border-amber-300 font-semibold",
    },
    adjacent: {
      label: "ข้างเคียงรางวัลที่ ๑",
      badgeClass: "bg-amber-50 text-amber-800 border-amber-300 font-semibold",
    },
    first: {
      label: "รางวัลที่ ๒",
      badgeClass: "bg-amber-50 text-amber-800 border-amber-300 font-semibold",
    },
    second: {
      label: "รางวัลที่ ๓",
      badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold",
    },
    third: {
      label: "รางวัลที่ ๔",
      badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold",
    },
    fourth: {
      label: "รางวัลที่ ๕",
      badgeClass: "bg-sky-50 text-sky-800 border-sky-300 font-medium",
    },
    suffix3: {
      label: "เลขท้าย ๓ ตัว",
      badgeClass: "bg-purple-50 text-purple-800 border-purple-300 font-medium",
    },
    consolation: {
      label: "รางวัลปลอบใจ",
      badgeClass: "bg-slate-100 text-slate-700 border-slate-300 font-medium",
    },
    special: {
      label: "รางวัลพิเศษ",
      badgeClass: "bg-rose-50 text-rose-800 border-rose-300 font-medium",
    },
  };

  if (prizes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center bg-white shadow-xs">
        <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-3">
          <Layers className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">
          ยังไม่มีข้อมูลของรางวัลตามเงื่อนไขที่เลือก
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          สามารถเพิ่มรางวัลใหม่ หรือคลิกปุ่ม &quot;โหลดรางวัลสลากกาชาดศรีสะเกษ&quot; ที่มุมขวาบนเพื่อใส่ชุดรางวัล ๑๒๗ รางวัลได้ทันที
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-600 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">ของรางวัล</th>
              <th className="py-3 px-4">ระดับรางวัล</th>
              <th className="py-3 px-4 text-center">จำนวน</th>
              <th className="py-3 px-4 text-center">สถานะหน้าบ้าน</th>
              <th className="py-3 px-4">หมายเลขที่ออก / ผู้รับรางวัล</th>
              <th className="py-3 px-4 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {prizes.map((prize) => {
              const tierInfo = tierBadges[prize.tier] || {
                label: prize.tier,
                badgeClass: "bg-slate-100 text-slate-700 border-slate-300 font-medium",
              };

              return (
                <tr
                  key={prize._id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {/* Title & Description */}
                  <td className="py-3 px-4">
                    <div className="min-w-0 max-w-xs sm:max-w-md">
                      <div className="font-semibold text-slate-900 truncate">
                        {prize.title}
                      </div>
                      {prize.description && (
                        <div className="text-xs text-slate-500 truncate mt-0.5">
                          {prize.description}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Tier & Round */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] ${tierInfo.badgeClass}`}
                      >
                        {tierInfo.label}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {prize.round}
                      </span>
                    </div>
                  </td>

                  {/* Quantity & Unit */}
                  <td className="py-3 px-4 text-center font-mono">
                    <span className="text-amber-700 font-bold">
                      {prize.quantity}
                    </span>
                    <span className="text-slate-500 text-xs ml-1">{prize.unit}</span>
                  </td>

                  {/* Publish Status Toggle */}
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      disabled={loadingId === prize._id}
                      onClick={() => handleTogglePublish(prize._id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer transition-all shadow-2xs ${
                        prize.isPublished
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                      }`}
                      title={
                        prize.isPublished
                          ? "กำลังเผยแพร่ที่หน้าบ้าน (คลิกเพื่อซ่อน)"
                          : "ซ่อนอยู่หลังบ้าน (คลิกเพื่อเผยแพร่)"
                      }
                    >
                      {prize.isPublished ? (
                        <>
                          <Eye className="h-3 w-3 text-emerald-600" />
                          <span>เผยแพร่แล้ว</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 text-slate-400" />
                          <span>แบบร่าง (Draft)</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Winning numbers or Winner info */}
                  <td className="py-3 px-4">
                    {prize.winningNumbers && prize.winningNumbers.length > 0 ? (
                      <div className="space-y-0.5">
                        <div className="text-xs font-mono font-bold text-amber-700">
                          {prize.winningNumbers.slice(0, 3).join(", ")}
                          {prize.winningNumbers.length > 3 && ` (+${prize.winningNumbers.length - 3})`}
                        </div>
                        {prize.winner?.name && (
                          <div className="text-[11px] text-slate-500">
                            ผู้รับ: <span className="font-medium text-slate-700">{prize.winner.name}</span>
                          </div>
                        )}
                      </div>
                    ) : prize.status === "drawn" && prize.winner?.name ? (
                      <div>
                        <div className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5 text-amber-600" />
                          <span className="font-semibold">{prize.winner.name}</span>
                        </div>
                        {prize.winner.ticketNumber && (
                          <div className="text-[11px] text-slate-500 font-mono">
                            เบอร์: {prize.winner.ticketNumber}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>รอออกรางวัล</span>
                      </span>
                    )}
                  </td>

                  {/* Action buttons */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDrawWinner(prize)}
                        className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        title="บันทึกผู้โชคดี / หมายเลขที่ออก"
                      >
                        <Trophy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(prize)}
                        className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                        title="แก้ไขรางวัล"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={loadingId === prize._id}
                        onClick={() => handleDelete(prize._id, prize.title)}
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="ลบรางวัล"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
