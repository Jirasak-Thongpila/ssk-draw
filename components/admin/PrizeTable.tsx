"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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
    { label: string; variant: "gold" | "emerald" | "secondary" | "slate" }
  > = {
    grand: { label: "Grand Prize", variant: "gold" },
    first: { label: "รางวัลที่ 1", variant: "gold" },
    second: { label: "รางวัลที่ 2", variant: "emerald" },
    consolation: { label: "รางวัลปลอบใจ", variant: "slate" },
    special: { label: "รางวัลพิเศษ", variant: "secondary" },
  };

  if (prizes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center bg-card/30">
        <div className="mx-auto h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
          <Layers className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">
          ยังไม่มีข้อมูลของรางวัลตามเงื่อนไขที่เลือก
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          สามารถเพิ่มรางวัลใหม่ หรือคลิกปุ่ม &quot;เพิ่มตัวอย่าง (Demo Data)&quot; ที่มุมขวาบนเพื่อทดสอบระบบได้ทันที
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-slate-900/50 text-xs text-muted-foreground uppercase font-medium">
            <tr>
              <th className="py-3 px-4">ของรางวัล</th>
              <th className="py-3 px-4">ระดับ / รอบ</th>
              <th className="py-3 px-4 text-center">คงเหลือ / ทั้งหมด</th>
              <th className="py-3 px-4 text-center">สถานะหน้าบ้าน</th>
              <th className="py-3 px-4">สถานะจับฉลาก / ผู้โชคดี</th>
              <th className="py-3 px-4 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {prizes.map((prize) => {
              const tierInfo = tierBadges[prize.tier] || {
                label: prize.tier,
                variant: "secondary",
              };

              return (
                <tr
                  key={prize._id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  {/* Title & Image */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {prize.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={prize.imageUrl}
                          alt={prize.title}
                          className="h-11 w-11 rounded-lg object-cover border border-border shrink-0 bg-slate-950"
                        />
                      ) : (
                        <div className="h-11 w-11 rounded-lg bg-slate-800 border border-border flex items-center justify-center text-slate-400 shrink-0">
                          <Trophy className="h-5 w-5" />
                        </div>
                      )}
                      <div className="min-w-0 max-w-xs">
                        <div className="font-medium text-foreground truncate">
                          {prize.title}
                        </div>
                        {prize.description && (
                          <div className="text-xs text-muted-foreground truncate">
                            {prize.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Tier & Round */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      <Badge variant={tierInfo.variant} className="text-[11px]">
                        {tierInfo.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">
                        {prize.round}
                      </span>
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="py-3 px-4 text-center font-mono">
                    <span
                      className={
                        prize.remaining === 0
                          ? "text-red-400 font-semibold"
                          : "text-emerald-400 font-semibold"
                      }
                    >
                      {prize.remaining}
                    </span>
                    <span className="text-muted-foreground"> / {prize.quantity}</span>
                  </td>

                  {/* Publish Status Toggle */}
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      disabled={loadingId === prize._id}
                      onClick={() => handleTogglePublish(prize._id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer transition-all ${
                        prize.isPublished
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                          : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                      }`}
                      title={
                        prize.isPublished
                          ? "กำลังเผยแพร่ที่หน้าบ้าน (คลิกเพื่อซ่อน)"
                          : "ซ่อนอยู่หลังบ้าน (คลิกเพื่อเผยแพร่)"
                      }
                    >
                      {prize.isPublished ? (
                        <>
                          <Eye className="h-3 w-3" />
                          <span>เผยแพร่แล้ว</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          <span>แบบร่าง (Draft)</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Draw Status & Winner */}
                  <td className="py-3 px-4">
                    {prize.status === "drawn" && prize.winner?.name ? (
                      <div>
                        <div className="inline-flex items-center gap-1 text-xs text-amber-400 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                          <span>{prize.winner.name}</span>
                        </div>
                        {prize.winner.ticketNumber && (
                          <div className="text-[11px] text-muted-foreground font-mono">
                            เบอร์: {prize.winner.ticketNumber}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>ยังไม่แจกรางวัล</span>
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
                        className="h-8 w-8 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                        title="บันทึกผู้โชคดี"
                      >
                        <Trophy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(prize)}
                        className="h-8 w-8 text-slate-300 hover:text-foreground hover:bg-slate-800"
                        title="แก้ไขรางวัล"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={loadingId === prize._id}
                        onClick={() => handleDelete(prize._id, prize.title)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
