"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { Prize, PrizeTier, PrizeStatus } from "@/models/Prize";

export interface PrizeAdminFilter {
  round?: string;
  status?: string;
  publishStatus?: "all" | "published" | "draft";
  search?: string;
}

export interface SerializablePrize {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  tier: PrizeTier;
  unit: string;
  round: string;
  quantity: number;
  remaining: number;
  isPublished: boolean;
  status: PrizeStatus;
  winningNumbers: string[];
  winner?: {
    name: string;
    ticketNumber?: string;
    announcedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface RawPrizeDoc {
  _id: { toString(): string };
  title: string;
  description?: string;
  imageUrl?: string;
  tier: PrizeTier;
  unit?: string;
  round: string;
  quantity: number;
  remaining: number;
  isPublished: boolean;
  status: PrizeStatus;
  winningNumbers?: string[];
  winner?: {
    name?: string;
    ticketNumber?: string;
    announcedAt?: Date | string;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}

function serializePrize(p: RawPrizeDoc): SerializablePrize {
  return {
    _id: p._id.toString(),
    title: p.title,
    description: p.description || "",
    imageUrl: p.imageUrl || "",
    tier: p.tier,
    unit: p.unit || "รางวัล",
    round: p.round,
    quantity: p.quantity,
    remaining: p.remaining,
    isPublished: Boolean(p.isPublished),
    status: p.status,
    winningNumbers: Array.isArray(p.winningNumbers) ? p.winningNumbers : [],
    winner: p.winner?.name
      ? {
          name: p.winner.name,
          ticketNumber: p.winner.ticketNumber || "",
          announcedAt: p.winner.announcedAt
            ? new Date(p.winner.announcedAt).toISOString()
            : undefined,
        }
      : undefined,
    createdAt: new Date(p.createdAt).toISOString(),
    updatedAt: new Date(p.updatedAt).toISOString(),
  };
}

function safeRevalidate(path: string) {
  try {
    safeRevalidate(path);
  } catch {
    // Ignore when called outside of Next.js request context (e.g. CLI seed scripts)
  }
}

/**
 * BACKEND ADMIN QUERY:
 * Returns all prizes including draft (isPublished: false)
 */
export async function getPrizesAdmin(filters?: PrizeAdminFilter): Promise<SerializablePrize[]> {
  try {
    await connectToDatabase();
    const query: Record<string, unknown> = {};

    if (filters?.round && filters.round !== "all") {
      query.round = filters.round;
    }

    if (filters?.status && filters.status !== "all") {
      query.status = filters.status;
    }

    if (filters?.publishStatus === "published") {
      query.isPublished = true;
    } else if (filters?.publishStatus === "draft") {
      query.isPublished = false;
    }

    if (filters?.search && filters.search.trim()) {
      query.title = { $regex: filters.search.trim(), $options: "i" };
    }

    const prizes = await Prize.find(query).sort({ createdAt: 1 }).lean<RawPrizeDoc[]>();
    return prizes.map(serializePrize);
  } catch (error) {
    console.error("Error fetching admin prizes:", error);
    return [];
  }
}

/**
 * PUBLIC FRONTEND QUERY (STRICT FILTERING):
 * Zero Secret Leakage: Guarantees that ONLY `isPublished: true` prizes reach the frontend.
 */
export async function getPublicPrizes(filters?: {
  round?: string;
  status?: string;
  search?: string;
}): Promise<SerializablePrize[]> {
  try {
    await connectToDatabase();
    // Strict requirement: isPublished MUST be true
    const query: Record<string, unknown> = { isPublished: true };

    if (filters?.round && filters.round !== "all") {
      query.round = filters.round;
    }

    if (filters?.status && filters.status !== "all") {
      query.status = filters.status;
    }

    if (filters?.search && filters.search.trim()) {
      query.title = { $regex: filters.search.trim(), $options: "i" };
    }

    const prizes = await Prize.find(query)
      .select("-__v")
      .sort({ createdAt: 1 })
      .lean<RawPrizeDoc[]>();

    return prizes.map(serializePrize);
  } catch (error) {
    console.error("Error fetching public prizes:", error);
    return [];
  }
}

/**
 * TICKET CHECKER ACTION:
 * Checks if a given 5-digit (or suffix) ticket number wins any prize.
 */
export async function checkTicketResult(ticketNumber: string) {
  const cleanNumber = ticketNumber.trim();
  if (!/^\d{5}$/.test(cleanNumber)) {
    return { success: false, message: "กรุณากรอกหมายเลขสลาก 5 หลัก" };
  }

  try {
    await connectToDatabase();
    // Only search published prizes
    const prizes = await Prize.find({ isPublished: true }).lean<RawPrizeDoc[]>();

    const wins: { prizeTitle: string; tier: PrizeTier; unit: string; matchedNumber: string }[] = [];

    const last3 = cleanNumber.slice(-3);

    for (const p of prizes) {
      const numbers = p.winningNumbers || [];
      // Exact match for 5 digits
      if (numbers.includes(cleanNumber)) {
        wins.push({
          prizeTitle: p.title,
          tier: p.tier,
          unit: p.unit || "รางวัล",
          matchedNumber: cleanNumber,
        });
      }
      // Check 3-digit suffix for suffix3 prizes
      if (p.tier === "suffix3" && cleanNumber.length >= 3 && numbers.includes(last3)) {
        wins.push({
          prizeTitle: p.title,
          tier: p.tier,
          unit: p.unit || "รางวัล",
          matchedNumber: `เลขท้าย ๓ ตัว: ${last3}`,
        });
      }
    }

    if (wins.length > 0) {
      return {
        success: true,
        won: true,
        ticketNumber: cleanNumber,
        wins,
      };
    } else {
      return {
        success: true,
        won: false,
        ticketNumber: cleanNumber,
      };
    }
  } catch (error) {
    console.error("Error checking ticket result:", error);
    return {
      success: false,
      message: "ไม่สามารถตรวจผลสลากได้ กรุณาลองใหม่อีกครั้ง",
    };
  }
}

export async function createPrize(data: {
  title: string;
  description?: string;
  imageUrl?: string;
  tier: PrizeTier;
  unit?: string;
  round: string;
  quantity: number;
  winningNumbers?: string[];
  isPublished?: boolean;
}) {
  try {
    await connectToDatabase();
    const newPrize = await Prize.create({
      title: data.title,
      description: data.description || "",
      imageUrl: data.imageUrl || "",
      tier: data.tier,
      unit: data.unit || "รางวัล",
      round: data.round || "ประจำปี ๒๕๗๐",
      quantity: data.quantity || 1,
      remaining: data.quantity || 1,
      winningNumbers: data.winningNumbers || [],
      isPublished: data.isPublished ?? true,
      status: "available",
    });

    safeRevalidate("/");
    safeRevalidate("/admin");
    return { success: true, prizeId: newPrize._id.toString() };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Create prize failed:", error);
    return { success: false, error: message };
  }
}

export async function updatePrize(
  id: string,
  data: {
    title?: string;
    description?: string;
    imageUrl?: string;
    tier?: PrizeTier;
    unit?: string;
    round?: string;
    quantity?: number;
    remaining?: number;
    winningNumbers?: string[];
    isPublished?: boolean;
    status?: PrizeStatus;
  }
) {
  try {
    await connectToDatabase();
    const updated = await Prize.findByIdAndUpdate(id, { $set: data }, { new: true });
    if (!updated) return { success: false, error: "Prize not found" };

    safeRevalidate("/");
    safeRevalidate("/admin");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Update prize failed:", error);
    return { success: false, error: message };
  }
}

export async function togglePublishPrize(id: string) {
  try {
    await connectToDatabase();
    const prize = await Prize.findById(id);
    if (!prize) return { success: false, error: "Prize not found" };

    prize.isPublished = !prize.isPublished;
    await prize.save();

    safeRevalidate("/");
    safeRevalidate("/admin");
    return { success: true, isPublished: prize.isPublished };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Toggle publish failed:", error);
    return { success: false, error: message };
  }
}

export async function drawWinner(
  id: string,
  winnerData: {
    name: string;
    ticketNumber?: string;
  }
) {
  try {
    await connectToDatabase();
    const prize = await Prize.findById(id);
    if (!prize) return { success: false, error: "Prize not found" };

    prize.winner = {
      name: winnerData.name,
      ticketNumber: winnerData.ticketNumber || "",
      announcedAt: new Date(),
    };
    prize.status = "drawn";
    if (prize.remaining > 0) {
      prize.remaining -= 1;
    }
    if (winnerData.ticketNumber && !prize.winningNumbers.includes(winnerData.ticketNumber)) {
      prize.winningNumbers.push(winnerData.ticketNumber);
    }

    await prize.save();

    safeRevalidate("/");
    safeRevalidate("/admin");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Draw winner failed:", error);
    return { success: false, error: message };
  }
}

export async function deletePrize(id: string) {
  try {
    await connectToDatabase();
    await Prize.findByIdAndDelete(id);

    safeRevalidate("/");
    safeRevalidate("/admin");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Delete prize failed:", error);
    return { success: false, error: message };
  }
}

/**
 * SISAKET RED CROSS PRIZES (สลากกาชาด ประจำปี ๒๕๗๐ จังหวัดศรีสะเกษ):
 * โหลดข้อมูลของรางวัลทั้ง 7 ลำดับ รวม 127 รางวัลตรงตามประกาศสลากกาชาด
 */
export async function seedRedCrossPrizes(forceReplace = false) {
  try {
    await connectToDatabase();

    if (!forceReplace) {
      const count = await Prize.countDocuments();
      if (count > 0) {
        return { success: false, message: "มีข้อมูลของรางวัลอยู่ในฐานข้อมูลแล้ว" };
      }
    } else {
      await Prize.deleteMany({});
    }

    const officialPrizes = [
      {
        title: "รางวัลที่ ๑ รถยนต์โตโยต้าฟอร์จูนเนอร์ ๒.๔ LEADER G Plus",
        description: "รางวัลใหญ่ รางวัลละ ๑ คัน รวม ๒ รางวัล รถยนต์อเนกประสงค์ระดับพรีเมียม เครื่องยนต์ 2.4 ลิตร ดีไซน์สปอร์ตหรูหรา",
        imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80",
        tier: "grand" as PrizeTier,
        unit: "คัน",
        round: "ประจำปี ๒๕๗๐",
        quantity: 2,
        remaining: 2,
        isPublished: true,
        status: "available" as PrizeStatus,
        winningNumbers: ["25701", "88992"],
      },
      {
        title: "รางวัลข้างเคียงรางวัลที่ ๑ ทองคำแท่งน้ำหนัก ๑ สลึง",
        description: "รางวัลข้างเคียงรางวัลที่ ๑ รางวัลละ ๑ แท่ง รวม ๔ รางวัล (สำหรับหมายเลขสลากข้างเคียงรางวัลที่ ๑ ทั้งสองรางวัล)",
        imageUrl: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=900&q=80",
        tier: "adjacent" as PrizeTier,
        unit: "แท่ง",
        round: "ประจำปี ๒๕๗๐",
        quantity: 4,
        remaining: 4,
        isPublished: true,
        status: "available" as PrizeStatus,
        winningNumbers: ["25700", "25702", "88991", "88993"],
      },
      {
        title: "รางวัลที่ ๒ ทองคำแท่งน้ำหนัก ๑ บาท",
        description: "ทองคำแท่งบริสุทธิ์ 96.5% น้ำหนัก ๑ บาท รางวัลละ ๑ แท่ง รวม ๓ รางวัล",
        imageUrl: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=900&q=80",
        tier: "first" as PrizeTier,
        unit: "แท่ง",
        round: "ประจำปี ๒๕๗๐",
        quantity: 3,
        remaining: 2,
        isPublished: true,
        status: "drawn" as PrizeStatus,
        winningNumbers: ["13579", "24680", "55443"],
        winner: {
          name: "สมพร บุญมี (อ.ขุขันธ์)",
          ticketNumber: "13579",
          announcedAt: new Date(),
        },
      },
      {
        title: "รางวัลที่ ๓ โทรศัพท์เคลื่อนที่ ยี่ห้อ Apple รุ่น iPhone 16 Pro",
        description: "สมาร์ตโฟนเรือธง Apple ชิป A18 Pro กล้องระดับสตูดิโอ 48MP รางวัลละ ๑ เครื่อง รวม ๓ รางวัล",
        imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80",
        tier: "second" as PrizeTier,
        unit: "เครื่อง",
        round: "ประจำปี ๒๕๗๐",
        quantity: 3,
        remaining: 3,
        isPublished: true,
        status: "available" as PrizeStatus,
        winningNumbers: ["33445", "66778", "99001"],
      },
      {
        title: "รางวัลที่ ๔ รถจักรยานยนต์ ยี่ห้อ Honda Wave",
        description: "รถจักรยานยนต์ยอดนิยม ประหยัดน้ำมัน ทนทาน รางวัลละ ๑ คัน รวม ๕ รางวัล",
        imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80",
        tier: "third" as PrizeTier,
        unit: "คัน",
        round: "ประจำปี ๒๕๗๐",
        quantity: 5,
        remaining: 5,
        isPublished: true,
        status: "available" as PrizeStatus,
        winningNumbers: ["11223", "44556", "77889", "00112", "33557"],
      },
      {
        title: "รางวัลที่ ๕ ตู้เย็น ๒ ประตู ขนาด ๗ คิว",
        description: "ตู้เย็นประหยัดไฟเบอร์ ๕ ระบบกระจายความเย็นรอบทิศทาง รางวัลละ ๑ เครื่อง รวม ๑๐ รางวัล",
        imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=900&q=80",
        tier: "fourth" as PrizeTier,
        unit: "เครื่อง",
        round: "ประจำปี ๒๕๗๐",
        quantity: 10,
        remaining: 10,
        isPublished: true,
        status: "available" as PrizeStatus,
        winningNumbers: ["10203", "40506", "70809"],
      },
      {
        title: "รางวัลที่ ๖ รางวัลเลขท้าย ๓ ตัว พัดลมตั้งพื้น ขนาด ๑๖ นิ้ว",
        description: "พัดลมตั้งพื้นปรับระดับได้ ขนาด ๑๖ นิ้ว รางวัลละ ๑ เครื่อง รวม ๑๐๐ รางวัล (สำหรับสลากที่ตรงกับเลขท้าย ๓ ตัวที่ออก)",
        imageUrl: "https://images.unsplash.com/photo-1618941716939-5e78ec839b89?auto=format&fit=crop&w=900&q=80",
        tier: "suffix3" as PrizeTier,
        unit: "เครื่อง",
        round: "ประจำปี ๒๕๗๐",
        quantity: 100,
        remaining: 100,
        isPublished: true,
        status: "available" as PrizeStatus,
        winningNumbers: ["570"],
      },
      {
        title: "รางวัลพิเศษสำรอง (แบบร่าง - รอประกาศเพิ่ม)",
        description: "รางวัลพิเศษเพิ่มเติมจากผู้สนับสนุน อยู่ระหว่างการพิจารณาเงื่อนไข (ซ่อนอยู่หลังบ้านเพื่อพิสูจน์การกรอง)",
        imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=900&q=80",
        tier: "special" as PrizeTier,
        unit: "รางวัล",
        round: "ประจำปี ๒๕๗๐",
        quantity: 5,
        remaining: 5,
        isPublished: false, // DRAFT: พิสูจน์ระบบ Filter หลังบ้าน!
        status: "available" as PrizeStatus,
        winningNumbers: [],
      },
    ];

    await Prize.insertMany(officialPrizes);
    safeRevalidate("/");
    safeRevalidate("/admin");
    return { success: true, count: officialPrizes.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Seed Red Cross prizes failed:", error);
    return { success: false, error: message };
  }
}

// Backward compatibility alias
export async function seedSamplePrizes() {
  return seedRedCrossPrizes(true);
}
