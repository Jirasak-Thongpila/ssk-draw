import mongoose, { Schema, Document, Model } from "mongoose";

export type PrizeTier = "grand" | "first" | "second" | "consolation" | "special";
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
  round: string;
  quantity: number;
  remaining: number;
  isPublished: boolean;
  status: PrizeStatus;
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
      enum: ["grand", "first", "second", "consolation", "special"],
      default: "first",
    },
    round: { type: String, required: true, default: "รอบที่ 1" },
    quantity: { type: Number, default: 1, min: 1 },
    remaining: { type: Number, default: 1, min: 0 },
    isPublished: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ["available", "drawn", "claimed"],
      default: "available",
      index: true,
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

// Prevent mongoose model overwrite in hot reload
export const Prize: Model<IPrizeDocument> =
  mongoose.models.Prize || mongoose.model<IPrizeDocument>("Prize", PrizeSchema);
