"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePrize, SerializablePrize } from "@/actions/prize-actions";
import { Hash, Sparkles } from "lucide-react";

interface RecordWinningNumbersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prizes: SerializablePrize[];
  onSuccess?: () => void;
}

export function RecordWinningNumbersDialog({
  open,
  onOpenChange,
  prizes,
  onSuccess,
}: RecordWinningNumbersDialogProps) {
  const [selectedPrizeId, setSelectedPrizeId] = useState<string>(
    prizes[0]?._id || ""
  );
  const [winningNumbersStr, setWinningNumbersStr] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Sync initial winning numbers when selected prize changes
  const handleSelectPrize = (id: string) => {
    setSelectedPrizeId(id);
    const p = prizes.find((item) => item._id === id);
    if (p) {
      setWinningNumbersStr(p.winningNumbers?.join(", ") || "");
    }
  };

  const currentPrize =
    prizes.find((p) => p._id === (selectedPrizeId || prizes[0]?._id)) || prizes[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPrize) return;

    setLoading(true);
    const winningNumbers = winningNumbersStr
      ? winningNumbersStr
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    try {
      await updatePrize(currentPrize._id, {
        winningNumbers,
        status: winningNumbers.length > 0 ? "drawn" : currentPrize.status,
      });
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClose={() => onOpenChange(false)}
        className="max-w-lg bg-white border-slate-200 shadow-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <Hash className="h-5 w-5" />
              <DialogTitle className="text-slate-900 font-bold">
                กรอกตัวเลขรางวัล
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-500">
              บันทึกหมายเลขสลากที่ออกรางวัลสำหรับใช้ตรวจผลอัตโนมัติ
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                เลือกของรางวัล <span className="text-red-500">*</span>
              </label>
              <select
                value={currentPrize?._id || ""}
                onChange={(e) => handleSelectPrize(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-2xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              >
                {prizes.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title} ({p.round}) - [{p.winningNumbers?.length || 0} หมายเลข]
                  </option>
                ))}
              </select>
            </div>

            {currentPrize && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">
                  {currentPrize.title}
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <span>จำนวน: {currentPrize.quantity} {currentPrize.unit}</span>
                  <span>•</span>
                  <span>รอบ: {currentPrize.round}</span>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                หมายเลขสลากที่ออกรางวัล (คั่นด้วยเครื่องหมายจุลภาค ,) <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="เช่น 25701, 88992 (กรณีเลขท้าย 3 ตัว: 570, 891)"
                value={winningNumbersStr}
                onChange={(e) => setWinningNumbersStr(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 font-mono shadow-2xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                สามารถระบุหลายหมายเลขได้ โดยคั่นด้วยจุลภาค (,) ระบบหน้าบ้านจะนำไปใช้ในการตรวจผลสลากทันที
              </span>
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-xs gap-1.5"
            >
              <Sparkles className="h-4 w-4" />
              <span>{loading ? "กำลังบันทึก..." : "บันทึกตัวเลขรางวัล"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
