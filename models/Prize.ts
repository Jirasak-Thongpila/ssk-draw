import mongoose, { Schema, Document, Model } from "mongoose";

export type PrizeTier =
  | "grand"      // รางวัลที่ ๑
  | "first"      // รางวัลที่ ๒
  | "second"     // รางวัลที่ ๓
  | "third"      // รางวัลที่ ๔
  | "fourth"     // รางวัลที่ ๕
  | "suffix3"    // รางวัลเลขท้าย ๓ ตัว
  | "adjacent"   // รางวัลข้างเคียงรางวัลที่ ๑
  | "consolation"
  | "special";

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
      default: "grand",
    },
    unit: { type: String, default: "รางวัล" },
    round: { type: String, required: true, default: "ประจำปี ๒๕๗๐" },
    quantity: { type: Number, default: 1, min: 1 },
    remaining: { type: Number, default: 1, min: 0 },
    isPublished: { type: Boolean, default: true, index: true },
    status: {
      type: String,
      enum: ["available", "drawn", "claimed"],
      default: "available",
      index: true,
    },
    winningNumbers: {
      type: [String],
      default: [],
    },
    winner: {
      name: { type: String, default: "" },
      ticketNumber: { type: String, default: "" },
      announcedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

export const Prize: Model<IPrizeDocument> =
  mongoose.models.Prize || mongoose.model<IPrizeDocument>("Prize", PrizeSchema);
