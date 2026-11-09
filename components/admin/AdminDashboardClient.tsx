"use client";

import { useState } from "react";
import { SerializablePrize } from "@/actions/prize-actions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PrizeTable } from "@/components/admin/PrizeTable";
import { PrizeDialog } from "@/components/admin/PrizeDialog";
import { WinnerDialog } from "@/components/admin/WinnerDialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Trophy,
  Eye,
  EyeOff,
  Gift,
  Search,
  Filter,
} from "lucide-react";

interface AdminDashboardClientProps {
  initialPrizes: SerializablePrize[];
}

export function AdminDashboardClient({ initialPrizes }: AdminDashboardClientProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingPrize, setEditingPrize] = useState<SerializablePrize | null>(null);
  const [winnerPrize, setWinnerPrize] = useState<SerializablePrize | null>(null);

  // Filters state
  const [search, setSearch] = useState("");
  const [selectedRound, setSelectedRound] = useState("all");
  const [selectedPublish, setSelectedPublish] = useState<"all" | "published" | "draft">("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Distinct rounds
  const rounds = Array.from(new Set(initialPrizes.map((p) => p.round))).filter(Boolean);

  // Client-side instant filtering for admin search
  const filteredPrizes = initialPrizes.filter((prize) => {
    if (search.trim() && !prize.title.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedRound !== "all" && prize.round !== selectedRound) {
      return false;
    }
    if (selectedPublish === "published" && !prize.isPublished) {
      return false;
    }
    if (selectedPublish === "draft" && prize.isPublished) {
      return false;
    }
    if (selectedStatus !== "all" && prize.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  // Stats calculation
  const totalCount = initialPrizes.length;
  const publishedCount = initialPrizes.filter((p) => p.isPublished).length;
  const draftCount = initialPrizes.filter((p) => !p.isPublished).length;
  const drawnCount = initialPrizes.filter((p) => p.status === "drawn").length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AdminHeader
        onOpenCreateDialog={() => {
          setEditingPrize(null);
          setCreateDialogOpen(true);
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Metric Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">ของรางวัลทั้งหมด</p>
                <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  {totalCount}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <Gift className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">เผยแพร่สู่หน้าบ้าน</p>
                <p className="text-2xl font-bold font-mono text-emerald-600 mt-1">
                  {publishedCount}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Eye className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">แบบร่าง (ซ่อนหลังบ้าน)</p>
                <p className="text-2xl font-bold font-mono text-slate-600 mt-1">
                  {draftCount}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                <EyeOff className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">จับฉลากแล้ว</p>
                <p className="text-2xl font-bold font-mono text-amber-600 mt-1">
                  {drawnCount}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Trophy className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              placeholder="ค้นหาชื่อของรางวัล..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-slate-50/60 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-1 font-medium">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span>ตัวกรอง:</span>
            </div>

            {/* Publish Filter */}
            <select
              value={selectedPublish}
              onChange={(e) =>
                setSelectedPublish(
                  e.target.value as "all" | "published" | "draft"
                )
              }
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 shadow-2xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">สถานะเผยแพร่ทั้งหมด</option>
              <option value="published">เฉพาะเผยแพร่แล้ว (Visible)</option>
              <option value="draft">เฉพาะแบบร่าง (Draft / Hidden)</option>
            </select>

            {/* Round Filter */}
            <select
              value={selectedRound}
              onChange={(e) => setSelectedRound(e.target.value)}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 shadow-2xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">ทุกรอบกิจกรรม</option>
              {rounds.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 shadow-2xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">สถานะรางวัลทั้งหมด</option>
              <option value="available">ยังไม่แจก</option>
              <option value="drawn">จับฉลากแล้ว</option>
            </select>
          </div>
        </div>

        {/* Prize Management Table */}
        <PrizeTable
          prizes={filteredPrizes}
          onEdit={(prize) => {
            setEditingPrize(prize);
            setCreateDialogOpen(true);
          }}
          onDrawWinner={(prize) => {
            setWinnerPrize(prize);
          }}
        />

        {/* Dialogs */}
        <PrizeDialog
          open={createDialogOpen}
          onOpenChange={(open) => {
            setCreateDialogOpen(open);
            if (!open) setEditingPrize(null);
          }}
          prizeToEdit={editingPrize}
        />

        <WinnerDialog
          open={!!winnerPrize}
          onOpenChange={(open) => {
            if (!open) setWinnerPrize(null);
          }}
          prize={winnerPrize}
        />
      </main>
    </div>
  );
}
