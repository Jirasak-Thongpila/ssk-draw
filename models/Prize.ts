import mongoose, { Schema, Document, Model } from "mongoose";

export const PRIZE_TIERS = [
  "grand",       // รางวัลที่ ๑
  "adjacent",    // รางวัลข้างเคียงรางวัลที่ ๑
  "first",       // รางวัลที่ ๒
  "second",      // รางวัลที่ ๓
  "third",       // รางวัลที่ ๔
  "fourth",      // รางวัลที่ ๕
  "suffix3",     // รางวัลเลขท้าย ๓ ตัว
  "consolation", // รางวัลปลอบใจ
  "special",     // รางวัลพิเศษ
] as const;

export type PrizeTier = (typeof PRIZE_TIERS)[number];

export type PrizeStatus = "available" | "drawn" | "claimed";

export interface IWinner {
  name: string;
  ticketNumber?: string;
  announcedAt?: Date;
}

export interface IPrize {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  tier: PrizeTier;
  unit: string;
  round: string;
  quantity: number;
  remaining: number;
  isPublished: boolean;
  status: PrizeStatus;
  winningNumbers: string[];
  winner?: IWinner;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPrizeDocument extends Omit<IPrize, "_id">, Document {}

const PrizeSchema = new Schema<IPrizeDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    tier: {
      type: String,
      enum: PRIZE_TIERS,
      default: "grand",
    },
    unit: { type: String, default: "รางวัล" },
    round: { type: String, required: true, default: "ประจำปี ๒๕๗๐" },
    quantity: { type: Number, required: true, default: 1, min: 1 },
    remaining: { type: Number, required: true, default: 1, min: 0 },
    isPublished: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["available", "drawn", "claimed"],
      default: "available",
    },
    winningNumbers: { type: [String], default: [] },
    winner: {
      name: { type: String },
      ticketNumber: { type: String },
      announcedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high performance searches
PrizeSchema.index({ isPublished: 1, round: 1, tier: 1 });
PrizeSchema.index({ winningNumbers: 1 });

// Ensure model re-registers properly during Next.js Hot Reload
if (mongoose.models.Prize) {
  delete mongoose.models.Prize;
}

export const Prize: Model<IPrizeDocument> =
  mongoose.models.Prize || mongoose.model<IPrizeDocument>("Prize", PrizeSchema);
