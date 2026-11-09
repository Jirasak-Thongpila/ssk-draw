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
      <DialogContent onClose={() => onOpenChange(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <Trophy className="h-5 w-5" />
              <DialogTitle>บันทึกผู้โชคดีได้รับรางวัล</DialogTitle>
            </div>
            <DialogDescription>
              {prize ? `รางวัล: ${prize.title} (${prize.round})` : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                ชื่อผู้โชคดี <span className="text-destructive">*</span>
              </label>
              <Input
                required
                placeholder="เช่น สมชาย มีโชค (แผนกไอที)"
                value={winnerName}
                onChange={(e) => setWinnerName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                หมายเลขฉลาก / เบอร์นำโชค
              </label>
              <Input
                placeholder="เช่น LK-089 หรือ เบอร์โทรศัพท์ 4 ตัวท้าย"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
            >
              {loading ? "กำลังบันทึก..." : "ยืนยันผลจับฉลาก"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
