# 📖 คู่มือการเชื่อมโยงข้อมูลสำหรับทีมพัฒนาหน้าบ้าน (Frontend Developer Guide)

เอกสารนี้อธิบายโครงสร้างข้อมูล, วิธีการดึงข้อมูล และการนำตัวเลขผลรางวัล (`winningNumbers`) จากระบบหลังบ้านไปเรนเดอร์บนหน้าบ้าน (Public Board)

---

## 1. การดึงข้อมูลรางวัล (Data Fetching)

ข้อมูลหน้าบ้านจะดึงผ่าน Server Action ที่ [`@/actions/prize-actions.ts`](./actions/prize-actions.ts):

```typescript
import { getPublicPrizes, SerializablePrize } from "@/actions/prize-actions";

// ดึงเฉพาะรางวัลที่แอดมินตั้งค่า isPublished === true เท่านั้น
const prizes: SerializablePrize[] = await getPublicPrizes();
```

---

## 2. โครงสร้างข้อมูลของรางวัล (`SerializablePrize`)

| ฟิลด์ | ชนิดข้อมูล | คำอธิบาย |
| :--- | :--- | :--- |
| `_id` | `string` | รหัสอ้างอิงรางวัลใน MongoDB |
| `title` | `string` | ชื่อของรางวัล เช่น *"รางวัลที่ ๑ รถยนต์โตโยต้าฟอร์จูนเนอร์"* |
| `tier` | `PrizeTier` | **ระดับของรางวัล** (ใช้เป็น Key หลักในการเลือกว่าจะนำไปแสดงที่กล่องไหน) |
| `quantity` | `number` | จำนวนรางวัลทั้งหมด |
| `unit` | `string` | หน่วยนับ เช่น *"คัน"*, *"แท่ง"*, *"เครื่อง"* |
| `round` | `string` | รอบกิจกรรม เช่น *"ประจำปี ๒๕๗๐"* |
| `status` | `"available" \| "drawn"` | สถานะ: `"available"` (ยังไม่ออกผล) / `"drawn"` (ออกผลแล้ว) |
| `winningNumbers` | `string[]` | **อาเรย์หมายเลขสลากที่ถูกรางวัล** เช่น `["25701", "88992"]` |
| `winner` | `object` *(optional)* | ข้อมูลผู้ได้รับรางวัล `{ name: string, ticketNumber?: string }` |

---

## 3. การจับคู่ระดับรางวัล (`tier`) เข้ากับกล่อง UI

หน้าบ้านสามารถค้นหาอ็อบเจกต์รางวัลตาม `tier` ได้ดังนี้:

```typescript
// 1. รางวัลที่ ๑ (Hero Card สีทองด้านบน)
const grandPrize = prizes.find((p) => p.tier === "grand");

// 2. รางวัลข้างเคียงรางวัลที่ ๑
const adjacentPrize = prizes.find((p) => p.tier === "adjacent");

// 3. รางวัลที่ ๒
const secondPrize = prizes.find((p) => p.tier === "first");

// 4. รางวัลที่ ๓
const thirdPrize = prizes.find((p) => p.tier === "second");

// 5. รางวัลที่ ๔
const fourthPrize = prizes.find((p) => p.tier === "third");

// 6. รางวัลที่ ๕
const fifthPrize = prizes.find((p) => p.tier === "fourth");

// 7. รางวัลเลขท้าย ๓ ตัว (๑๐๐ รางวัล)
const suffix3Prize = prizes.find((p) => p.tier === "suffix3");
```

> **หมายเหตุ:** `tier` อ้างอิงตาม Enum ในฐานข้อมูล:
> * `"grand"` = รางวัลที่ ๑
> * `"adjacent"` = ข้างเคียงรางวัลที่ ๑
> * `"first"` = รางวัลที่ ๒
> * `"second"` = รางวัลที่ ๓
> * `"third"` = รางวัลที่ ๔
> * `"fourth"` = รางวัลที่ ๕
> * `"suffix3"` = เลขท้าย ๓ ตัว

---

## 4. ตัวอย่างการเรนเดอร์ตัวเลขรางวัล (`winningNumbers`)

ตัวเลขที่แอดมินกรอกผ่านระบบหลังบ้านจะถูกเก็บเป็นอาเรย์ `string[]` ใน `winningNumbers`:

```tsx
{/* ตัวอย่างการเรนเดอร์ในกล่องรางวัลที่ ๑ */}
<div className="flex flex-wrap gap-4 justify-center">
  {grandPrize?.winningNumbers && grandPrize.winningNumbers.length > 0 ? (
    grandPrize.winningNumbers.map((numberStr, index) => (
      <span
        key={index}
        className="text-4xl font-black font-mono tracking-wider text-[#0a2558]"
      >
        {numberStr}
      </span>
    ))
  ) : (
    <span className="text-slate-400 text-lg font-medium">
      รอผลการออกรางวัล
    </span>
  )}
</div>
```

---

## 5. การตรวจผลสลากอัตโนมัติ (Search / Ticket Checker)

หากต้องการทำระบบให้ประชาชนพิมพ์ค้นหาหมายเลขสลาก สามารถเรียกใช้ฟังก์ชันที่มีอยู่แล้วได้ทันที:

```typescript
import { checkTicketResult } from "@/actions/prize-actions";

// ส่งเลขสลาก เช่น "25701" เข้าไปตรวจสอบ
const result = await checkTicketResult(searchTicketNumber);

if (result.isWinner) {
  console.log("ยินดีด้วย! คุณถูกรางวัล:", result.prizes);
  // result.prizes จะส่งรายการรางวัลที่ตรงกับหมายเลขนี้กลับมา
} else {
  console.log("เสียใจด้วย ไม่ถูกรางวัล");
}
```

---

## 6. ข้อควรจำ (Best Practices)
1. **เรื่องรูปภาพ (`imageUrl`):** ปัจจุบันแบบฟอร์มหลังบ้านไม่ได้บังคับกรอกรูปภาพ และบอร์ดทางการเน้นแสดงตัวเลข ดังนั้นควรออกแบบ UI รองรับทั้งกรณีมีรูปและไม่มีรูป (Fallback)
2. **Revalidation:** เมื่อแอดมินกด *"บันทึกตัวเลขรางวัล"* ระบบจะเรียก `revalidatePath("/")` อัตโนมัติ หน้าบ้านจะอัปเดตข้อมูลล่าสุดเมื่อผู้ใช้รีเฟรชหน้าเว็บ
