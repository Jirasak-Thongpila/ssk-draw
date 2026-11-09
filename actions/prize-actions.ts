"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { Prize, IPrize, PrizeTier, PrizeStatus } from "@/models/Prize";

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
  round: string;
  quantity: number;
  remaining: number;
  isPublished: boolean;
  status: PrizeStatus;
  winner?: {
    name: string;
    ticketNumber?: string;
    announcedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

function serializePrize(p: any): SerializablePrize {
  return {
    _id: p._id.toString(),
    title: p.title,
    description: p.description || "",
    imageUrl: p.imageUrl || "",
    tier: p.tier,
    round: p.round,
    quantity: p.quantity,
    remaining: p.remaining,
    isPublished: !!p.isPublished,
    status: p.status,
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

/**
 * BACKEND ADMIN QUERY:
 * Can query all prizes including draft (isPublished: false)
 */
export async function getPrizesAdmin(filters?: PrizeAdminFilter): Promise<SerializablePrize[]> {
  try {
    await connectToDatabase();
    const query: Record<string, any> = {};

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

    const prizes = await Prize.find(query).sort({ createdAt: -1 }).lean();
    return prizes.map(serializePrize);
  } catch (error) {
    console.error("Error fetching admin prizes:", error);
    return [];
  }
}

/**
 * PUBLIC FRONTEND QUERY (STRICT FILTERING):
 * Zero Secret Leakage: Guarantees that only `isPublished: true` prizes reach the frontend.
 */
export async function getPublicPrizes(filters?: {
  round?: string;
  status?: string;
  search?: string;
}): Promise<SerializablePrize[]> {
  try {
    await connectToDatabase();
    // Strict requirement: isPublished MUST be true
    const query: Record<string, any> = { isPublished: true };

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
      .sort({
        // Tier ordering: grand first, then first, second, etc.
        tier: 1,
        createdAt: -1,
      })
      .lean();

    return prizes.map(serializePrize);
  } catch (error) {
    console.error("Error fetching public prizes:", error);
    return [];
  }
}

export async function createPrize(data: {
  title: string;
  description?: string;
  imageUrl?: string;
  tier: PrizeTier;
  round: string;
  quantity: number;
  isPublished?: boolean;
}) {
  try {
    await connectToDatabase();
    const newPrize = await Prize.create({
      title: data.title,
      description: data.description || "",
      imageUrl: data.imageUrl || "",
      tier: data.tier,
      round: data.round || "รอบที่ 1",
      quantity: data.quantity || 1,
      remaining: data.quantity || 1,
      isPublished: data.isPublished ?? false,
      status: "available",
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, prizeId: newPrize._id.toString() };
  } catch (error: any) {
    console.error("Create prize failed:", error);
    return { success: false, error: error.message };
  }
}

export async function updatePrize(
  id: string,
  data: {
    title?: string;
    description?: string;
    imageUrl?: string;
    tier?: PrizeTier;
    round?: string;
    quantity?: number;
    remaining?: number;
    isPublished?: boolean;
    status?: PrizeStatus;
  }
) {
  try {
    await connectToDatabase();
    const updated = await Prize.findByIdAndUpdate(id, { $set: data }, { new: true });
    if (!updated) return { success: false, error: "Prize not found" };

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Update prize failed:", error);
    return { success: false, error: error.message };
  }
}

export async function togglePublishPrize(id: string) {
  try {
    await connectToDatabase();
    const prize = await Prize.findById(id);
    if (!prize) return { success: false, error: "Prize not found" };

    prize.isPublished = !prize.isPublished;
    await prize.save();

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, isPublished: prize.isPublished };
  } catch (error: any) {
    console.error("Toggle publish failed:", error);
    return { success: false, error: error.message };
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

    await prize.save();

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Draw winner failed:", error);
    return { success: false, error: error.message };
  }
}

export async function deletePrize(id: string) {
  try {
    await connectToDatabase();
    await Prize.findByIdAndDelete(id);

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Delete prize failed:", error);
    return { success: false, error: error.message };
  }
}

export async function seedSamplePrizes() {
  try {
    await connectToDatabase();
    
    // Check if prizes exist already
    const count = await Prize.countDocuments();
    if (count > 0) {
      return { success: false, message: "Database already has prizes" };
    }

    const samplePrizes = [
      {
        title: "iPhone 16 Pro Max 256GB (Desert Titanium)",
        description: "รางวัลใหญ่ประจำค่ำคืน ชิป A18 Pro กล้องระดับสตูดิโอ 48MP พร้อมหน้าจอ Super Retina XDR",
        imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
        tier: "grand" as PrizeTier,
        round: "Grand Finale",
        quantity: 1,
        remaining: 1,
        isPublished: true,
        status: "available" as PrizeStatus,
      },
      {
        title: "iPad Air M2 11 นิ้ว Wi-Fi 128GB",
        description: "รางวัลที่ 1 รอบเปิดงาน ชิป Apple M2 ประสิทธิภาพทรงพลัง รองรับ Apple Pencil Pro",
        imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
        tier: "first" as PrizeTier,
        round: "รอบที่ 1",
        quantity: 2,
        remaining: 1,
        isPublished: true,
        status: "drawn" as PrizeStatus,
        winner: {
          name: "สมชาย มีโชค (ฝ่ายวิศวกรรม)",
          ticketNumber: "LK-042",
          announcedAt: new Date(),
        },
      },
      {
        title: "PlayStation 5 Slim Digital Edition",
        description: "เครื่องเล่นเกมคอนโซลยุคใหม่ กราฟิก 4K คมชัดระดับเน็กซ์เจน พร้อมจอย DualSense ไร้สาย",
        imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
        tier: "first" as PrizeTier,
        round: "รอบที่ 2",
        quantity: 1,
        remaining: 1,
        isPublished: true,
        status: "available" as PrizeStatus,
      },
      {
        title: "หูฟัง Sony WH-1000XM5 Noise Cancelling",
        description: "สุดยอดหูฟังไร้สายตัดเสียงรบกวนอันดับหนึ่ง เสียงคมชัด Hi-Res Audio แบตเตอรี่อึดยาวนาน 30 ชม.",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        tier: "second" as PrizeTier,
        round: "รอบที่ 1",
        quantity: 3,
        remaining: 3,
        isPublished: true,
        status: "available" as PrizeStatus,
      },
      {
        title: "Nintendo Switch OLED Model - White",
        description: "หน้าจอ OLED ขนาด 7 นิ้ว สีสันสดใส ลำโพงระบบเสียงคมชัด พกพาสะดวกทุกที่",
        imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80",
        tier: "second" as PrizeTier,
        round: "รอบที่ 2",
        quantity: 2,
        remaining: 2,
        isPublished: false, // DRAFT: พิสูจน์ระบบ Filter หลังบ้าน!
        status: "available" as PrizeStatus,
      },
      {
        title: "บัตรกำนัล Central Gift Card มูลค่า 2,000 บาท",
        description: "รางวัลปลอบใจสำหรับผู้โชคดี ช้อปปิ้งได้ทุกสาขาทั่วประเทศ",
        imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
        tier: "consolation" as PrizeTier,
        round: "รอบที่ 1",
        quantity: 10,
        remaining: 8,
        isPublished: true,
        status: "available" as PrizeStatus,
      },
    ];

    await Prize.insertMany(samplePrizes);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, count: samplePrizes.length };
  } catch (error: any) {
    console.error("Seed prizes failed:", error);
    return { success: false, error: error.message };
  }
}
