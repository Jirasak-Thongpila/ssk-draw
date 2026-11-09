import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระบบจัดการสลากกาชาดศรีสะเกษ | Admin Control",
  description: "ระบบจัดการข้อมูลของรางวัลและการออกรางวัลสลากกาชาดศรีสะเกษ",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-theme min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-amber-100 selection:text-amber-900">
      {children}
    </div>
  );
}
