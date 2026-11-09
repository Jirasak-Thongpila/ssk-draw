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
import { drawWinner, SerializablePrize } from "@/actions/prize-actions";
import { Trophy } from "lucide-react";

interface WinnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prize: SerializablePrize | null;
  onSuccess?: () => void;
}

export function WinnerDialog({
  open,
  onOpenChange,
  prize,
  onSuccess,
}: WinnerDialogProps) {
  const [loading, setLoading] = useState(false);
  const [winnerName, setWinnerName] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prize || !winnerName.trim()) return;

    setLoading(true);
    try {
      await drawWinner(prize._id, {
        name: winnerName.trim(),
        ticketNumber: ticketNumber.trim() || undefined,
      });
      setWinnerName("");
      setTicketNumber("");
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
      <DialogContent onClose={() => onOpenChange(false)} className="bg-white border-slate-200 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <Trophy className="h-5 w-5" />
              <DialogTitle className="text-slate-900 font-bold">บันทึกผู้โชคดีได้รับรางวัล</DialogTitle>
            </div>
            <DialogDescription className="text-slate-500">
              {prize ? `รางวัล: ${prize.title} (${prize.round})` : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                ชื่อผู้โชคดี <span className="text-red-500">*</span>
              </label>
              <Input
                required
                placeholder="เช่น สมชาย มีโชค (แผนกไอที)"
                value={winnerName}
                onChange={(e) => setWinnerName(e.target.value)}
                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                หมายเลขฉลาก / เบอร์นำโชค
              </label>
              <Input
                placeholder="เช่น LK-089 หรือ เบอร์โทรศัพท์ 4 ตัวท้าย"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 font-mono"
              />
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
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-xs"
            >
              {loading ? "กำลังบันทึก..." : "ยืนยันผลจับฉลาก"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
