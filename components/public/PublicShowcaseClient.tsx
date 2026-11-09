"use client";

import Link from "next/link";
import Image from "next/image";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  RefreshCw,
  Shield,
  Ticket,
  Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SerializablePrize } from "@/actions/prize-actions";

interface PublicShowcaseClientProps {
  initialPrizes: SerializablePrize[];
}

const publishedPrizeTiers = [
  {
    tier: "grand",
    number: "1",
    title: "รถยนต์ Toyota Fortuner",
    detail: "2.4 LEADER G Plus",
    quantity: 2,
    unit: "คัน",
    featured: true,
  },
  {
    tier: "first",
    number: "2",
    title: "ทองคำแท่ง",
    detail: "น้ำหนัก 1 บาท",
    quantity: 3,
    unit: "แท่ง",
  },
  {
    tier: "second",
    number: "3",
    title: "โทรศัพท์ Apple",
    detail: "iPhone 18 Pro",
    quantity: 3,
    unit: "เครื่อง",
  },
  {
    tier: "third",
    number: "4",
    title: "รถจักรยานยนต์ Honda",
    detail: "รุ่น Wave",
    quantity: 5,
    unit: "คัน",
  },
  {
    tier: "fourth",
    number: "5",
    title: "ตู้เย็น 2 ประตู",
    detail: "ขนาด 7 คิว",
    quantity: 10,
    unit: "เครื่อง",
  },
  {
    tier: "suffix3",
    number: "6",
    title: "พัดลมตั้งพื้น",
    detail: "เลขท้าย 3 ตัว • ขนาด 16 นิ้ว",
    quantity: 100,
    unit: "รางวัล",
  },
  {
    tier: "adjacent",
    number: "7",
    title: "ทองคำแท่ง",
    detail: "รางวัลข้างเคียงรางวัลที่ 1 • น้ำหนัก 1 สลึง",
    quantity: 4,
    unit: "แท่ง",
  },
] as const;

function getWinningNumbers(prizes: SerializablePrize[], tier: string) {
  return prizes
    .filter((prize) => prize.tier === tier)
    .flatMap((prize) => prize.winningNumbers)
    .filter((number, index, numbers) => numbers.indexOf(number) === index);
}

function toArabicDigits(value: number | string) {
  const thaiDigits = "๐๑๒๓๔๕๖๗๘๙";
  return String(value)
    .replace(/[๐-๙]/g, (digit) => String(thaiDigits.indexOf(digit)));
}

export function PublicShowcaseClient({
  initialPrizes,
}: PublicShowcaseClientProps) {
  const router = useRouter();
  const displayedPrizes = publishedPrizeTiers.map((tier) => {
    const managedPrizes = initialPrizes.filter(
      (prize) => prize.tier === tier.tier,
    );
    const managedQuantity = managedPrizes.reduce(
      (total, prize) => total + prize.quantity,
      0,
    );
    const descriptions = managedPrizes
      .map((prize) => prize.description.trim())
      .filter((description, index, values) => description && values.indexOf(description) === index);

    return {
      ...tier,
      title: managedPrizes[0]?.title || tier.title,
      detail: descriptions.join(" • ") || tier.detail,
      quantity: managedPrizes.length ? managedQuantity : tier.quantity,
      unit: managedPrizes[0]?.unit || tier.unit,
      winningNumbers: getWinningNumbers(initialPrizes, tier.tier),
    };
  });
  const totalPrizes = displayedPrizes.reduce(
    (total, prize) => total + prize.quantity,
    0,
  );
  const announcedCount = publishedPrizeTiers.filter(
    (prize) => getWinningNumbers(initialPrizes, prize.tier).length > 0,
  ).length;

  useEffect(() => {
    const refreshInterval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }, 5000);

    return () => window.clearInterval(refreshInterval);
  }, [router]);

  return (
    <main className="results-page">
      <header className="results-header">
        <div className="results-brand">
          <div className="results-logos" aria-label="ตราสัญลักษณ์จังหวัดศรีสะเกษและเหล่ากาชาด">
            <Image
              className="results-provincial-logo"
              src="/branding/sisaket-emblem.png"
              alt="ตราสัญลักษณ์จังหวัดศรีสะเกษ"
              width={400}
              height={400}
              priority
            />
            <span className="results-logo-divider" aria-hidden="true" />
            <Image
              className="results-cross-logo"
              src="/branding/red-cross-chapter.png"
              alt="เหล่ากาชาดจังหวัดศรีสะเกษ"
              width={519}
              height={162}
              priority
            />
          </div>
          <div>
            <p className="results-eyebrow">สำนักงานเหล่ากาชาดจังหวัดศรีสะเกษ</p>
            <h1>ประกาศผลรางวัลสลากกาชาด</h1>
            <p className="results-event-name">ประจำปี 2570</p>
          </div>
        </div>
        <Link className="results-admin-link" href="/admin">
          <Shield aria-hidden="true" />
          <span>ระบบผู้ดูแล</span>
        </Link>
      </header>

      <section className="results-overview" aria-label="สรุปข้อมูลงาน">
        <div className="results-overview-copy">
          <span className="results-live-label">
            <span className="results-live-dot" />
            ผลการจับสลาก
          </span>
          <h2>ร่วมลุ้นรางวัลใหญ่ กับงานกาชาดศรีสะเกษ</h2>
          <p>
            ตรวจสอบประเภทรางวัลและเลขสลากที่ได้รับรางวัลได้จากประกาศด้านล่าง
          </p>
        </div>
        <div className="results-summary">
          <div>
            <Ticket aria-hidden="true" />
            <span>สลากทั้งหมด</span>
            <strong>99,999 <small>ฉบับ</small></strong>
          </div>
          <div>
            <Trophy aria-hidden="true" />
            <span>ของรางวัลรวม</span>
            <strong>{toArabicDigits(totalPrizes)} <small>รางวัล</small></strong>
          </div>
          <div>
            {announcedCount > 0 ? (
              <CheckCircle2 aria-hidden="true" />
            ) : (
              <Clock3 aria-hidden="true" />
            )}
            <span>สถานะประกาศ</span>
            <strong className="results-summary-status">
              {announcedCount > 0
                ? `ประกาศแล้ว ${toArabicDigits(announcedCount)} รายการ`
                : "รอประกาศผล"}
            </strong>
          </div>
        </div>
      </section>

      <section className="results-section" aria-labelledby="prize-list-title">
        <div className="results-section-heading">
          <div>
            <p className="results-section-kicker">PRIZE ANNOUNCEMENT</p>
            <h2 id="prize-list-title">รายการรางวัลและผลการจับสลาก</h2>
          </div>
          <div className="results-updates">
            <span className="results-auto-refresh">
              <RefreshCw aria-hidden="true" />
              อัปเดตจากหลังบ้านทุก 5 วินาที
            </span>
            <p>ทั้งหมด {toArabicDigits(totalPrizes)} รางวัล</p>
          </div>
        </div>

        <div className="results-prize-grid">
          {displayedPrizes.map((prize) => {
            const winningNumbers = prize.winningNumbers;
            const hasResults = winningNumbers.length > 0;

            return (
              <article
                className={`results-prize-card${"featured" in prize && prize.featured ? " results-prize-featured" : ""}`}
                key={prize.tier}
              >
                <div className="results-prize-topline">
                  <span className="results-prize-number">
                    รางวัลที่ {prize.number}
                  </span>
                  <span
                    className={`results-prize-status${hasResults ? " is-announced" : ""}`}
                  >
                    {hasResults ? "ประกาศผลแล้ว" : "รอประกาศ"}
                  </span>
                </div>
                <h3>{prize.title}</h3>
                <p className="results-prize-detail">{prize.detail}</p>
                <div className="results-prize-footer">
                  <span>
                    จำนวน <strong>{toArabicDigits(prize.quantity)}</strong>{" "}
                    {prize.unit}
                  </span>
                  {hasResults ? (
                    <div className="results-winning-numbers" aria-label="เลขสลากที่ถูกรางวัล">
                      {winningNumbers.map((number) => (
                        <span className="results-winning-number" key={number}>
                          {toArabicDigits(number)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="results-number-pending">
                      {prize.tier === "suffix3"
                        ? "เลขท้าย 3 ตัวจะแสดงที่นี่"
                        : "เลขสลากจะแสดงที่นี่"}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="results-footer">
        <div className="results-footer-note">
          <CalendarDays aria-hidden="true" />
          <p>
            กำหนดออกรางวัลวันจันทร์ที่ 4 มกราคม 2570 เวลา 20.30 น.
            เป็นต้นไป ณ บริเวณเวทีกลาง
          </p>
        </div>
        <div className="results-footer-note">
          <MapPin aria-hidden="true" />
          <p>
            รับรางวัลที่สำนักงานเหล่ากาชาดจังหวัดศรีสะเกษ วันที่ 11 มกราคม –
            9 กุมภาพันธ์ 2570
          </p>
        </div>
        <p className="results-disclaimer">
          * ผู้ถูกรางวัลโปรดนำสลากฉบับจริงมาแสดงเพื่อขอรับรางวัล
          ผลการจับสลากจะอัปเดตเมื่อมีการประกาศอย่างเป็นทางการ
        </p>
      </footer>
    </main>
  );
}
