import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getPrizesAdmin } from "@/actions/prize-actions";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

async function AdminContent() {
  await connection();
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const prizes = await getPrizesAdmin();

  return <AdminDashboardClient initialPrizes={prizes} />;
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-xs text-muted-foreground">
          กำลังโหลดข้อมูลแดชบอร์ด...
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
