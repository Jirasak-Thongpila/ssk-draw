"use client";

import { useState, useEffect } from "react";
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
import { createPrize, updatePrize, SerializablePrize } from "@/actions/prize-actions";
import { PrizeTier } from "@/models/Prize";

interface PrizeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prizeToEdit?: SerializablePrize | null;
  onSuccess?: () => void;
}

export function PrizeDialog({
  open,
  onOpenChange,
  prizeToEdit,
  onSuccess,
}: PrizeDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    tier: "first" as PrizeTier,
    round: "รอบที่ 1",
    quantity: 1,
    isPublished: true,
  });

  useEffect(() => {
    if (prizeToEdit) {
      setFormData({
        title: prizeToEdit.title,
        description: prizeToEdit.description || "",
        imageUrl: prizeToEdit.imageUrl || "",
        tier: prizeToEdit.tier,
        round: prizeToEdit.round,
        quantity: prizeToEdit.quantity,
        isPublished: prizeToEdit.isPublished,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        tier: "first",
        round: "รอบที่ 1",
        quantity: 1,
        isPublished: true,
      });
    }
  }, [prizeToEdit, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    try {
      if (prizeToEdit) {
        await updatePrize(prizeToEdit._id, formData);
      } else {
        await createPrize(formData);
      }
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
            <DialogTitle>
              {prizeToEdit ? "แก้ไขข้อมูลของรางวัล" : "เพิ่มของรางวัลใหม่"}
            </DialogTitle>
            <DialogDescription>
              กำหนดข้อมูลรางวัล ระดับ และตั้งค่าการเผยแพร่ไปยังหน้าบ้าน
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                ชื่อของรางวัล <span className="text-destructive">*</span>
              </label>
              <Input
                required
                placeholder="เช่น iPhone 16 Pro Max 256GB"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  ระดับรางวัล (Tier)
                </label>
                <select
                  value={formData.tier}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tier: e.target.value as PrizeTier,
                    })
                  }
                  className="w-full rounded-md border border-input bg-background/50 px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="grand">Grand Prize (รางวัลใหญ่)</option>
                  <option value="first">รางวัลที่ 1</option>
                  <option value="second">รางวัลที่ 2</option>
                  <option value="consolation">รางวัลปลอบใจ</option>
                  <option value="special">รางวัลพิเศษ</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  รอบการจับรางวัล (Round)
                </label>
                <Input
                  placeholder="เช่น รอบที่ 1 หรือ Grand Finale"
                  value={formData.round}
                  onChange={(e) =>
                    setFormData({ ...formData, round: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  จำนวนของรางวัล
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  สถานะการเผยแพร่ (Publish)
                </label>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isPublishedCheck"
                    checked={formData.isPublished}
                    onChange={(e) =>
                      setFormData({ ...formData, isPublished: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-border text-amber-500 focus:ring-amber-500 cursor-pointer"
                  />
                  <label
                    htmlFor="isPublishedCheck"
                    className="text-xs text-foreground cursor-pointer select-none"
                  >
                    เผยแพร่ให้หน้าบ้านเห็นทันที
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                URL รูปภาพ (Image URL)
              </label>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                รายละเอียดของรางวัล
              </label>
              <textarea
                rows={3}
                placeholder="ระบุสเปกหรือรายละเอียดรางวัลเพิ่มเติม..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
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
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? "กำลังบันทึก..." : prizeToEdit ? "บันทึกการแก้ไข" : "สร้างของรางวัล"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
