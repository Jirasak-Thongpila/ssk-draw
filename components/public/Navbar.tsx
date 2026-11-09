import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Award } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Event Title */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-foreground">
                สลากกาชาด ประจำปี ๒๕๗๐
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
                จังหวัดศรีสะเกษ
              </span>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              จำนวน ๙๙,๙๙๙ ฉบับ ฉบับละ ๑๐๐ บาท • รวม ๑๒๗ รางวัล
            </p>
          </div>
        </div>

        {/* Backoffice Navigation */}
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs border-amber-500/30 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 hover:text-amber-300"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>ระบบหลังบ้าน (Admin)</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
