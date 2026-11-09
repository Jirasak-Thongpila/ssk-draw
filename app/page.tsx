import { Suspense } from "react";
import { connection } from "next/server";
import { getPublicPrizes } from "@/actions/prize-actions";
import { PublicShowcaseClient } from "@/components/public/PublicShowcaseClient";

async function PublicPrizesSection() {
  await connection();
  // STRICT DATA FILTERING: Only isPublished === true prizes reach the client
  const publicPrizes = await getPublicPrizes();
  return <PublicShowcaseClient initialPrizes={publicPrizes} />;
}

function PrizeLoadingSkeleton() {
  return (
    <div className="results-page animate-pulse" aria-label="กำลังโหลดผลรางวัล">
      <div className="h-16 rounded-xl bg-card/60" />
      <div className="h-48 rounded-2xl bg-card/60" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <div key={n} className="h-44 rounded-2xl bg-card/50" />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<PrizeLoadingSkeleton />}>
      <PublicPrizesSection />
    </Suspense>
  );
}
