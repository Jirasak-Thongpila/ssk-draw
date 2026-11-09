"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, LogOut, ExternalLink, PlusCircle, Sparkles } from "lucide-react";
import { seedSamplePrizes } from "@/actions/prize-actions";
import { useState } from "react";

interface AdminHeaderProps {
  onOpenCreateDialog: () => void;
}

export function AdminHeader({ onOpenCreateDialog }: AdminHeaderProps) {
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await seedSamplePrizes();
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
    <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground flex items-center gap-2">
              หลังบ้านจัดการรางวัล
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Admin Control
              </span>
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              ควบคุมการเผยแพร่และกรองข้อมูลของรางวัลก่อนส่งไปหน้าบ้าน
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs text-slate-300">
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">ดูหน้าบ้าน (Public)</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSeed}
            disabled={seeding}
            className="gap-1.5 text-xs text-amber-400 border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{seeding ? "กำลังเพิ่ม..." : "เพิ่มตัวอย่าง (Demo Data)"}</span>
          </Button>

          <Button
            size="sm"
            onClick={onOpenCreateDialog}
            className="gap-1.5 text-xs"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>เพิ่มรางวัล</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="text-muted-foreground hover:text-destructive text-xs gap-1"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
