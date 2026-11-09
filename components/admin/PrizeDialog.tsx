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
        <DialogTitle className="text-slate-900 font-bold">
          {prizeToEdit ? "แก้ไขข้อมูลของรางวัล" : "เพิ่มของรางวัลใหม่"}
        </DialogTitle>
        <DialogDescription className="text-slate-500">
          กำหนดข้อมูลรางวัล ระดับ จำนวน และหมายเลขสลากที่ถูกรางวัล
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            ชื่อของรางวัล <span className="text-red-500">*</span>
          </label>
          <Input
            required
            placeholder="เช่น รางวัลที่ ๑ รถยนต์โตโยต้าฟอร์จูนเนอร์ ๒.๔ LEADER G Plus"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
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
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-2xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
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
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              หน่วยนับ (เช่น คัน, แท่ง, เครื่อง)
            </label>
            <Input
              placeholder="เช่น คัน หรือ แท่ง"
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
              className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
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
              className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              รอบกิจกรรม
            </label>
            <Input
              placeholder="ประจำปี ๒๕๗๐"
              value={formData.round}
              onChange={(e) =>
                setFormData({ ...formData, round: e.target.value })
              }
              className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            หมายเลขสลากที่ออกรางวัล (คั่นด้วยจุลภาค ,)
          </label>
          <Input
            placeholder="เช่น 25701, 88992 (หรือ 570 สำหรับเลขท้าย)"
            value={formData.winningNumbersStr}
            onChange={(e) =>
              setFormData({ ...formData, winningNumbersStr: e.target.value })
            }
            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 font-mono"
          />
          <span className="text-[11px] text-slate-500 mt-1 block">
            หมายเลขนี้จะใช้สำหรับระบบตรวจผลสลากอัตโนมัติที่หน้าบ้าน
          </span>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            URL รูปภาพ
          </label>
          <Input
            placeholder="https://images.unsplash.com/..."
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            รายละเอียดของรางวัล
          </label>
          <textarea
            rows={2}
            placeholder="ระบุสเปกหรือเงื่อนไขเพิ่มเติม..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
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
            className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
          />
          <label
            htmlFor="isPublishedCheck"
            className="text-xs text-slate-700 cursor-pointer select-none font-medium"
          >
            เผยแพร่สู่หน้าบ้านทันที (ถ้าไม่ติ๊กจะเป็นแบบร่าง ซ่อนอยู่หลังบ้าน)
          </label>
        </div>
      </div>

      <DialogFooter className="pt-2 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
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
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-lg bg-white border-slate-200 shadow-xl">
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
