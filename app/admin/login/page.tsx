"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (ลองใช้ admin / admin123)");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername("admin");
    setPassword("admin123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Subtle ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            กลับสู่หน้าแสดงรางวัล (หน้าบ้าน)
          </Link>
        </div>

        <Card className="border-slate-200 shadow-xl bg-white">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto h-12 w-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mb-2 shadow-2xs">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl font-bold text-slate-900">เข้าสู่ระบบหลังบ้าน</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              ระบบจัดการและควบคุมการแสดงผลรางวัลสลากกาชาดศรีสะเกษ
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  ชื่อผู้ใช้งาน (Username)
                </label>
                <Input
                  required
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-slate-400" />
                  รหัสผ่าน (Password)
                </label>
                <Input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-2 gap-2 font-semibold bg-red-600 hover:bg-red-700 text-white shadow-xs"
              >
                <span>{loading ? "กำลังตรวจสอบสิทธิ์..." : "เข้าสู่ระบบหลังบ้าน"}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="pt-3 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-xs text-amber-700 hover:text-amber-800 underline underline-offset-4 cursor-pointer font-medium"
                >
                  กรอกบัญชีผู้ดูแลทดสอบอัตโนมัติ (admin / admin123)
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
