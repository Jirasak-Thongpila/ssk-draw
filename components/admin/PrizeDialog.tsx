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
import { createPrize, updatePrize, SerializablePrize } from "@/actions/prize-actions";
import { PrizeTier } from "@/models/Prize";

interface PrizeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prizeToEdit?: SerializablePrize | null;
  onSuccess?: () => void;
}

function PrizeForm({
  prizeToEdit,
  onClose,
  onSuccess,
}: {
  prizeToEdit?: SerializablePrize | null;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: prizeToEdit?.title || "",
    description: prizeToEdit?.description || "",
    imageUrl: prizeToEdit?.imageUrl || "",
    tier: (prizeToEdit?.tier || "grand") as PrizeTier,
    unit: prizeToEdit?.unit || "รางวัล",
    round: prizeToEdit?.round || "ประจำปี ๒๕๗๐",
    quantity: prizeToEdit?.quantity || 1,
    winningNumbersStr: prizeToEdit?.winningNumbers?.join(", ") || "",
    isPublished: prizeToEdit ? prizeToEdit.isPublished : true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    const winningNumbers = formData.winningNumbersStr
      ? formData.winningNumbersStr
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    try {
      if (prizeToEdit) {
        await updatePrize(prizeToEdit._id, {
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl,
          tier: formData.tier,
          unit: formData.unit,
          round: formData.round,
          quantity: formData.quantity,
          winningNumbers,
          isPublished: formData.isPublished,
        });
      } else {
        await createPrize({
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl,
          tier: formData.tier,
          unit: formData.unit,
          round: formData.round,
          quantity: formData.quantity,
          winningNumbers,
          isPublished: formData.isPublished,
        });
      }
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[85vh] overflow-y-auto pr-1">
      <DialogHeader>
        <DialogTitle>
          {prizeToEdit ? "แก้ไขข้อมูลของรางวัล" : "เพิ่มของรางวัลใหม่"}
        </DialogTitle>
        <DialogDescription>
          กำหนดข้อมูลรางวัล ระดับ จำนวน และหมายเลขสลากที่ถูกรางวัล
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1">
            ชื่อของรางวัล <span className="text-destructive">*</span>
          </label>
          <Input
            required
            placeholder="เช่น รางวัลที่ ๑ รถยนต์โตโยต้าฟอร์จูนเนอร์ ๒.๔ LEADER G Plus"
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
              <option value="grand">รางวัลที่ ๑</option>
              <option value="adjacent">ข้างเคียงรางวัลที่ ๑</option>
              <option value="first">รางวัลที่ ๒</option>
              <option value="second">รางวัลที่ ๓</option>
              <option value="third">รางวัลที่ ๔</option>
              <option value="fourth">รางวัลที่ ๕</option>
              <option value="suffix3">เลขท้าย ๓ ตัว (๑๐๐ รางวัล)</option>
              <option value="consolation">รางวัลปลอบใจ</option>
              <option value="special">รางวัลพิเศษ</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              หน่วยนับ (เช่น คัน, แท่ง, เครื่อง)
            </label>
            <Input
              placeholder="เช่น คัน หรือ แท่ง"
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
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
              รอบกิจกรรม
            </label>
            <Input
              placeholder="ประจำปี ๒๕๗๐"
              value={formData.round}
              onChange={(e) =>
                setFormData({ ...formData, round: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1">
            หมายเลขสลากที่ออกรางวัล (คั่นด้วยจุลภาค ,)
          </label>
          <Input
            placeholder="เช่น 25701, 88992 (หรือ 570 สำหรับเลขท้าย)"
            value={formData.winningNumbersStr}
            onChange={(e) =>
              setFormData({ ...formData, winningNumbersStr: e.target.value })
            }
          />
          <span className="text-[11px] text-muted-foreground mt-0.5 block">
            หมายเลขนี้จะใช้สำหรับระบบตรวจผลสลากอัตโนมัติที่หน้าบ้าน
          </span>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1">
            URL รูปภาพ
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
            rows={2}
            placeholder="ระบุสเปกหรือเงื่อนไขเพิ่มเติม..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
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
            เผยแพร่สู่หน้าบ้านทันที (ถ้าไม่ติ๊กจะเป็นแบบร่าง ซ่อนอยู่หลังบ้าน)
          </label>
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
        >
          ยกเลิก
        </Button>
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? "กำลังบันทึก..." : prizeToEdit ? "บันทึกการแก้ไข" : "สร้างของรางวัล"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function PrizeDialog({
  open,
  onOpenChange,
  prizeToEdit,
  onSuccess,
}: PrizeDialogProps) {
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-lg">
        <PrizeForm
          key={prizeToEdit?._id || "new"}
          prizeToEdit={prizeToEdit}
          onClose={() => onOpenChange(false)}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
