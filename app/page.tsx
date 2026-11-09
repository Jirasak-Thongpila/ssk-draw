import { Suspense } from "react";
import { connection } from "next/server";
import { getPublicPrizes } from "@/actions/prize-actions";
import { Navbar } from "@/components/public/Navbar";
import { PublicShowcaseClient } from "@/components/public/PublicShowcaseClient";

async function PublicPrizesSection() {
  await connection();
  // STRICT DATA FILTERING: Only isPublished === true are queried and fetched here
  const publicPrizes = await getPublicPrizes();
  return <PublicShowcaseClient initialPrizes={publicPrizes} />;
}

function PrizeLoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-44 rounded-2xl bg-card/60 border border-border" />
      <div className="h-10 w-full max-w-md rounded-lg bg-card/40" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="h-72 rounded-xl bg-card/50 border border-border" />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Suspense fallback={<PrizeLoadingSkeleton />}>
          <PublicPrizesSection />
        </Suspense>
      </main>

      <footer className="border-t border-border/80 bg-card/40 py-8 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>
            ระบบแสดงและจัดการรางวัลจับฉลาก (Lucky Draw Showcase & Management)
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            Next.js 16 • MongoDB • NextAuth • Shadcn UI • Tailwind CSS v4
          </p>
        </div>
      </footer>
    </div>
  );
}
