import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "สลากกาชาด ประจำปี ๒๕๗๐ จังหวัดศรีสะเกษ | ตรวจผลและแสดงรางวัล",
  description: "ระบบจัดแสดงและตรวจผลรางวัลสลากกาชาด จังหวัดศรีสะเกษ ประจำปี ๒๕๗๐ รวม ๑๒๗ รางวัล",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
