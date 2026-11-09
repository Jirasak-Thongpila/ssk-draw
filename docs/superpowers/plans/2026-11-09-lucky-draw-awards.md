# Lucky Draw Awards Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** สร้างเว็บจับฉลากรางวัล (Lucky Draw / Raffle Showcase & Admin Control) หน้าบ้านและหลังบ้าน กรองข้อมูลความลับ/แบบร่างจากหลังบ้านก่อนส่งไปหน้าบ้าน พร้อม NextAuth, MongoDB และ Shadcn UI

**Architecture:** Next.js 16 App Router โดยใช้ Server Components ดึงข้อมูลเฉพาะรางวัลที่ `isPublished: true` พร้อม Server Actions จัดการ CRUD และสลับสถานะรางวัลในฝั่ง Admin ที่ป้องกันด้วย NextAuth Session

**Tech Stack:** Next.js 16, React 19, Bun, MongoDB + Mongoose, NextAuth (Auth.js), Tailwind CSS v4, Lucide React, Shadcn UI primitives

## Global Constraints
- ห้ามส่งข้อมูลของรางวัลที่ `isPublished: false` ไปยัง Client-side หน้าบ้านเด็ดขาด (กรองที่ MongoDB Server Query)
- แตก branch ย่อยจาก `dev` ทำแต่ละ feature แล้ว merge กลับเข้า `dev`
- ปฏิบัติตาม Impeccable Craft Floor (คอนทราสต์ชัดเจน, ใช้ Lucide Icons เท่านั้น, ไม่ใช้ gradient text ตกแต่ง, ดีไซน์สอดคล้องกับงานอีเวนต์ระดับพรีเมียม)

---

### Task 1: Core Setup & Foundation (Branch: `feature/setup-core`)

**Branch:** `feature/setup-core` (branched from `dev`)

**Files:**
- Create: `lib/mongodb.ts`
- Create: `models/Prize.ts`
- Create: `lib/auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `lib/utils.ts`
- Create: `components/ui/button.tsx`
- Create: `components/ui/badge.tsx`
- Create: `components/ui/card.tsx`
- Create: `components/ui/input.tsx`
- Create: `components/ui/dialog.tsx`
- Modify: `package.json`
- Modify: `app/globals.css`

- [ ] **Step 1:** แตก branch `feature/setup-core` จาก `dev`
- [ ] **Step 2:** ติดตั้ง dependencies: `mongoose`, `next-auth@beta`, `lucide-react`, `clsx`, `tailwind-merge` ด้วย bun
- [ ] **Step 3:** สร้าง `lib/mongodb.ts` สำหรับ connection cache ป้องกัน connection leak ใน Next.js dev mode
- [ ] **Step 4:** สร้าง Mongoose Schema ใน `models/Prize.ts`
- [ ] **Step 5:** สร้างการกำหนดค่า Auth ใน `lib/auth.ts` และ API Route Handler `app/api/auth/[...nextauth]/route.ts`
- [ ] **Step 6:** สร้าง utility `cn` และ Shadcn UI primitives (Button, Badge, Card, Input, Dialog)
- [ ] **Step 7:** ทดสอบ compile และ commit เข้าสู่ `feature/setup-core` แล้ว merge รวมเข้า `dev`

---

### Task 2: Backend Admin & Filtering Control (Branch: `feature/backend-admin`)

**Branch:** `feature/backend-admin` (branched from `dev`)

**Files:**
- Create: `actions/prize-actions.ts`
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/page.tsx`
- Create: `components/admin/PrizeTable.tsx`
- Create: `components/admin/PrizeDialog.tsx`
- Create: `components/admin/WinnerDialog.tsx`
- Create: `components/admin/AdminHeader.tsx`

- [ ] **Step 1:** แตก branch `feature/backend-admin` จาก `dev`
- [ ] **Step 2:** สร้าง Server Actions ใน `actions/prize-actions.ts` (CRUD, togglePublish, drawWinner, seedSamplePrizes)
- [ ] **Step 3:** สร้างหน้า Login สำหรับ Admin (`app/admin/login/page.tsx`)
- [ ] **Step 4:** สร้าง Admin Dashboard (`app/admin/page.tsx`) พร้อมฟิลเตอร์กรองสถานะ, ตารางรางวัล (`PrizeTable.tsx`), และปุ่ม Toggle เผยแพร่ (`isPublished`)
- [ ] **Step 5:** สร้าง Dialog สำหรับเพิ่ม/แก้ไขรางวัล (`PrizeDialog.tsx`) และ Dialog สุ่ม/ระบุผู้โชคดี (`WinnerDialog.tsx`)
- [ ] **Step 6:** ทดสอบฟังก์ชัน CRUD และ Server Actions
- [ ] **Step 7:** Commit เข้าสู่ `feature/backend-admin` แล้ว merge รวมเข้า `dev`

---

### Task 3: Public Showcase & Server-Side Data Filtering (Branch: `feature/frontend-showcase`)

**Branch:** `feature/frontend-showcase` (branched from `dev`)

**Files:**
- Modify: `app/page.tsx`
- Create: `components/public/Navbar.tsx`
- Create: `components/public/PrizeFilters.tsx`
- Create: `components/public/PrizeCard.tsx`
- Create: `components/public/PrizeGrid.tsx`
- Create: `components/public/PrizeDetailModal.tsx`

- [ ] **Step 1:** แตก branch `feature/frontend-showcase` จาก `dev`
- [ ] **Step 2:** พัฒนา Server Component ใน `app/page.tsx` ให้ query MongoDB กรองเฉพาะ `isPublished: true` และรองรับ searchParams (round, status, search)
- [ ] **Step 3:** สร้าง Public Navbar (`Navbar.tsx`) แสดงหัวข้องานและปุ่มสลับไปหลังบ้าน
- [ ] **Step 4:** สร้างแถบตัวกรอง (`PrizeFilters.tsx`) สำหรับเลือกดูตามรอบกิจกรรม และสถานะรางวัล (ยังไม่แจก / แจกแล้ว)
- [ ] **Step 5:** สร้าง Prize Card & Grid (`PrizeCard.tsx`, `PrizeGrid.tsx`) แสดงผลระดับรางวัล, สถานะ, ผู้ชนะรางวัล พร้อมแอนิเมชัน
- [ ] **Step 6:** สร้าง Modal แสดงรายละเอียดของรางวัล (`PrizeDetailModal.tsx`)
- [ ] **Step 7:** ปรับแต่ง UX/UI ตาม Impeccable Craft Floor (สี, Typography, ความคมชัด, ไม่มี icon emoji)
- [ ] **Step 8:** Commit เข้าสู่ `feature/frontend-showcase` แล้ว merge รวมเข้า `dev`

---

### Task 4: Integration & Verification

- [ ] **Step 1:** ตรวจสอบ Git log และสถานะ branch บน `dev`
- [ ] **Step 2:** รัน `bun run build` หรือ Type check เพื่อยืนยันว่าไม่มีข้อผิดพลาด
- [ ] **Step 3:** ตรวจสอบความปลอดภัย: ทดสอบสร้างรางวัล Draft ในหลังบ้าน และยืนยันว่าไม่ปรากฏที่หน้าบ้าน
- [ ] **Step 4:** สรุปผลการพัฒนาและขั้นตอนการรันให้ผู้ใช้
