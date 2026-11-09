# Design Specification: Lucky Draw Awards Platform (เว็บแสดงและจัดการรางวัลจับฉลาก)

**Date:** 2026-11-09  
**Status:** Approved by User  
**Author:** Pair Programming with Tle (เติ้ล)  

---

## 1. Executive Summary & Objective

ระบบเว็บแอปพลิเคชันสำหรับแสดงและบริหารจัดการของรางวัลในกิจกรรมจับฉลาก (Lucky Draw / Raffle Event)
แบ่งการทำงานออกเป็น 2 ส่วนหลัก:
1. **หน้าบ้าน (Public Showcase):** สำหรับผู้ร่วมงาน/ผู้ชม ดูของรางวัลที่จัดแสดง กรองตามรอบกิจกรรม และดูผลผู้โชคดีที่ได้รับรางวัล
2. **หลังบ้าน (Admin Backoffice):** สำหรับผู้ดูแลระบบ เข้าสู่ระบบด้วย NextAuth เพื่อจัดการของรางวัล (CRUD), สลับสถานะ Publish/Draft, อัปเดตผู้ได้รับรางวัล และควบคุมการกรองข้อมูลก่อนส่งไปหน้าบ้าน

### Key Architectural Constraint: Zero Secret Leakage
ข้อมูลของรางวัลที่ไม่ผ่านการเผยแพร่ (`isPublished: false`) หรือข้อมูลภายใน จะต้องถูกกรองที่ฝั่ง Server (MongoDB Query ใน Server Components / Server Actions) เสมอ โดยไม่ส่ง Object ทั้งหมดไปกรองที่ Client-side

---

## 2. Git Branch Strategy

* `main` — Production branch
* `dev` — Integration & Development base branch (สร้างแล้ว)
  * `feature/setup-core` — ติดตั้ง dependencies (mongoose, next-auth, lucide-react, shadcn components), config DB & NextAuth, และวางรากฐาน UI theme
  * `feature/backend-admin` — หน้าล็อกอิน Admin, Mongoose models, Dashboard จัดการรางวัล, Server Actions สำหรับ CRUD, สลับ Publish/Draft, อัปเดตผลผู้ชนะ
  * `feature/frontend-showcase` — หน้าบ้าน Public จัดแสดงการ์ดรางวัล, ตัวกรองรอบกิจกรรม/สถานะ (ที่ส่งจาก Server), หน้ารายละเอียดรางวัล, Impeccable UI/UX Polish

---

## 3. Technology Stack

* **Framework:** Next.js 16.4.5 (App Router, Server Components, Server Actions)
* **Package Manager:** Bun 1.4.0
* **Database & ODM:** MongoDB + Mongoose 8.x
* **Authentication:** NextAuth (Credentials Provider สำหรับ Admin พร้อม Session JWT)
* **Styling & UI:** Tailwind CSS v4, Lucide React, Shadcn UI primitives (Button, Card, Badge, Input, Dialog, Select, Table)
* **Design Standards:** Impeccable Craft Floor (High contrast >= 4.5:1, purposeful motion, zero emoji-as-icons, no decorative gradient text)

---

## 4. Data Models & Filtering Design

### MongoDB Schema (`Prize`)
```typescript
interface IPrize {
  _id: string;
  title: string;              // ชื่อของรางวัล
  description?: string;       // รายละเอียดของรางวัล
  imageUrl?: string;          // รูปภาพของรางวัล
  tier: 'grand' | 'first' | 'second' | 'consolation' | 'special'; // ระดับรางวัล
  round: string;              // รอบการจับรางวัล เช่น "รอบเปิดงาน", "รอบที่ 1", "Grand Finale"
  quantity: number;           // จำนวนรางวัลทั้งหมด
  remaining: number;          // จำนวนรางวัลที่ยังไม่ได้แจก
  isPublished: boolean;       // หลังบ้านควบคุม: แสดงที่หน้าบ้านหรือไม่ (Default: false)
  status: 'available' | 'drawn' | 'claimed'; // สถานะรางวัล
  winner?: {
    name: string;             // ชื่อผู้โชคดี
    ticketNumber?: string;    // หมายเลขฉลาก/รหัสผู้โชคดี
    announcedAt?: Date;       // เวลาที่ประกาศผล
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Server-side Filtering Protocol
* **Public Queries:**
  ```typescript
  const filter: FilterQuery<IPrize> = { isPublished: true };
  if (round && round !== 'all') filter.round = round;
  if (status && status !== 'all') filter.status = status;
  if (search) filter.title = { $regex: search, $options: 'i' };
  
  const publicPrizes = await Prize.find(filter)
    .select('-__v')
    .sort({ tier: 1, createdAt: -1 })
    .lean();
  ```
* **Admin Queries:**
  * สามารถดูรางวัลทั้งหมดได้ (ทั้ง `isPublished: true` และ `isPublished: false`)
  * ฟิลเตอร์สถานะ Publish, Tier, Round ได้อิสระ พร้อมปุ่ม Toggle Visibility แบบทันที

---

## 5. UI/UX System (Impeccable Principles)

* **Canvas & Atmosphere:**
  * Theme: Sophisticated Obsidian/Slate (`#090d16`) ผสาน Metallic Amber (`#f59e0b` / `#fbbf24`) สำหรับรางวัลใหญ่ และ Emerald/Sapphire สำหรับสถานะ
  * Typography: Display headings หนักแน่น ชัดเจน, Body 65-75ch อ่านสบายตา, ตัวเลขฉลากใช้ Monospace/Tabular Numbers เพื่อความเที่ยงตรง
* **Components:**
  * Header/Navbar: แสดงชื่องานจับฉลาก, สวิตช์สลับหน้าบ้าน/ทางเข้าหลังบ้าน, สถานะกิจกรรม
  * Filter Bar (หน้าบ้าน): สลับรอบกิจกรรม (Tabs/Pills), สลับสถานะ (ทั้งหมด / ยังไม่แจก / มีผู้โชคดีแล้ว)
  * Prize Grid: การ์ดรางวัลที่แสดงระดับรางวัล (Badge), จำนวนคงเหลือ, และการแสดงผลผู้ชนะแบบฉลองชัยชนะ
  * Admin Table & Modal: ตารางจัดการรางวัล ปรับเปลี่ยนสถานะและบันทึกผู้ชนะได้ในคลิกเดียว

---

## 6. Verification & Acceptance Criteria
1. สามารถรัน Next.js dev server ได้อย่างราบรื่นโดยไม่มี TypeScript หรือ Build error
2. หน้าหลังบ้าน `/admin` มีระบบป้องกัน ไม่ให้ผู้ที่ไม่ได้ล็อกอินเข้าถึงได้
3. เมื่อเพิ่มรางวัลในหลังบ้านและตั้งเป็น `isPublished: false` หน้าบ้านจะไม่แสดงรางวัลนั้น
4. เมื่อสลับเป็น `isPublished: true` หน้าบ้านจะแสดงรางวัลทันที พร้อมกรองตามรอบและสถานะได้ถูกต้อง
5. Responsive layout ใช้งานได้สมบูรณ์ทั้งมือถือและจอคอมพิวเตอร์
