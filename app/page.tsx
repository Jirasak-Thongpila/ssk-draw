import { Suspense } from "react";
import { connection } from "next/server";
import { getPublicPrizes } from "@/actions/prize-actions";
import { OfficialLotteryBoard } from "@/components/public/OfficialLotteryBoard";

async function PublicLotteryBoardSection() {
  await connection();
  // STRICT DATA FILTERING: Only isPublished === true prizes reach the client
  const publicPrizes = await getPublicPrizes();
  return <OfficialLotteryBoard prizes={publicPrizes} />;
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#dceafc] py-6 sm:py-10 px-3 sm:px-6 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="w-full max-w-6xl mx-auto h-[600px] rounded-3xl bg-white/70 border border-blue-200 animate-pulse flex items-center justify-center text-xs text-slate-400">
            กำลังโหลดตารางผลรางวัล...
          </div>
        }
      >
        <PublicLotteryBoardSection />
      </Suspense>
    </main>
  );
}
