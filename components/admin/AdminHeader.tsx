"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, LogOut, ExternalLink, PlusCircle, Sparkles } from "lucide-react";
import { seedRedCrossPrizes } from "@/actions/prize-actions";
import { useState } from "react";

interface AdminHeaderProps {
  onOpenCreateDialog: () => void;
}

export function AdminHeader({ onOpenCreateDialog }: AdminHeaderProps) {
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    if (!confirm("ต้องการโหลดรายการของรางวัลตามประกาศสลากกาชาดจังหวัดศรีสะเกษ ๑๒๗ รางวัล ใช่หรือไม่?")) return;
    setSeeding(true);
    try {
      const res = await seedRedCrossPrizes(true);
      if (!res.success && res.message) {
        alert(res.message);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-2xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
              หลังบ้านสลากกาชาดศรีสะเกษ
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                Admin Control
              </span>
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              ควบคุมการเผยแพร่และผลการออกรางวัล ๑๒๗ รางวัล
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs text-slate-700 border-slate-200 bg-white hover:bg-slate-50 shadow-2xs"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden sm:inline">ดูหน้าบ้าน (Public)</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSeed}
            disabled={seeding}
            className="gap-1.5 text-xs text-red-600 border-red-200 bg-red-50/80 hover:bg-red-100/80 shadow-2xs"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {seeding ? "กำลังโหลด..." : "โหลดรางวัลสลากกาชาดศรีสะเกษ (๑๒๗ รางวัล)"}
            </span>
          </Button>

          <Button
            size="sm"
            onClick={onOpenCreateDialog}
            className="gap-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-xs"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>เพิ่มรางวัล</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs gap-1"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
