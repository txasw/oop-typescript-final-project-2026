# Data Model Documentation — Library Management System

## Overview

ระบบจัดการห้องสมุด (Library Management System) ประกอบด้วย Core Data Model 2 ตัว:

1. **Book** — ข้อมูลหนังสือ
2. **Member** — ข้อมูลสมาชิก

---

## Book Model

| #   | Attribute            | Type             | Description                      | Category      |
| --- | -------------------- | ---------------- | -------------------------------- | ------------- |
| 1   | `id`                 | `string`         | UUID ของหนังสือ (auto-generated) | Identity      |
| 2   | `isbn`               | `string`         | รหัส ISBN                        | Identity      |
| 3   | `title`              | `string`         | ชื่อหนังสือ                      | Core Domain   |
| 4   | `author`             | `string`         | ผู้แต่ง                          | Core Domain   |
| 5   | `publisher`          | `string`         | สำนักพิมพ์                       | Core Domain   |
| 6   | `publishedYear`      | `number`         | ปีที่พิมพ์ (1000-2100)           | Core Domain   |
| 7   | `category`           | `BookCategory`   | หมวดหมู่หนังสือ (enum)           | Core Domain   |
| 8   | `description`        | `string`         | รายละเอียด / เรื่องย่อ           | Core Domain   |
| 9   | `status`             | `BookStatus`     | สถานะของหนังสือ (enum)           | Status        |
| 10  | `isAvailableForLoan` | `boolean`        | อนุญาตให้ยืมได้หรือไม่           | Configuration |
| 11  | `currentBorrowerId`  | `string \| null` | ID ของสมาชิกที่ยืมอยู่           | Relation      |
| 12  | `borrowedAt`         | `string \| null` | วันที่เริ่มยืม (ISO 8601)        | Timestamp     |
| 13  | `dueDate`            | `string \| null` | วันกำหนดคืน (ISO 8601)           | Timestamp     |
| 14  | `reservedBy`         | `string[]`       | คิว ID สมาชิกที่จองหนังสืออยู่   | Relation      |
| 15  | `deletedAt`          | `string \| null` | วันที่ถูกลบ (Soft Delete)        | Timestamp     |
| 16  | `createdAt`          | `string`         | วันที่เพิ่มเข้าระบบ (ISO 8601)   | Timestamp     |
| 17  | `updatedAt`          | `string`         | วันที่อัปเดตล่าสุด (ISO 8601)    | Timestamp     |

### BookStatus Enum

| Value         | Description                 |
| ------------- | --------------------------- |
| `AVAILABLE`   | หนังสือพร้อมให้ยืม          |
| `BORROWED`    | หนังสือถูกยืมอยู่           |
| `RESERVED`    | หนังสือถูกจองไว้            |
| `MAINTENANCE` | หนังสืออยู่ระหว่างซ่อมบำรุง |

### BookCategory Enum

| Value         | Description      |
| ------------- | ---------------- |
| `FICTION`     | นิยาย / วรรณกรรม |
| `NON_FICTION` | สารคดี           |
| `SCIENCE`     | วิทยาศาสตร์      |
| `TECHNOLOGY`  | เทคโนโลยี        |
| `HISTORY`     | ประวัติศาสตร์    |
| `ART`         | ศิลปะ            |
| `EDUCATION`   | การศึกษา         |
| `OTHER`       | อื่นๆ            |

---

## Member Model

| #   | Attribute         | Type             | Description                        | Category      |
| --- | ----------------- | ---------------- | ---------------------------------- | ------------- |
| 1   | `id`              | `string`         | UUID ของสมาชิก (auto-generated)    | Identity      |
| 2   | `memberCode`      | `string`         | รหัสสมาชิก (auto: LIB-XXXX)        | Identity      |
| 3   | `firstName`       | `string`         | ชื่อ                               | Core Domain   |
| 4   | `lastName`        | `string`         | นามสกุล                            | Core Domain   |
| 5   | `email`           | `string`         | อีเมล                              | Core Domain   |
| 6   | `phone`           | `string`         | เบอร์โทรศัพท์                      | Core Domain   |
| 7   | `address`         | `string`         | ที่อยู่                            | Core Domain   |
| 8   | `status`          | `MemberStatus`   | สถานะสมาชิก (enum)                 | Status        |
| 9   | `maxBooksAllowed` | `number`         | จำนวนหนังสือสูงสุดที่ยืมได้ (1-20) | Configuration |
| 10  | `borrowedBookIds` | `string[]`       | รายการ Book IDs ที่ยืมอยู่         | Relation      |
| 11  | `deletedAt`       | `string \| null` | วันที่ถูกลบ (Soft Delete)          | Timestamp     |
| 12  | `registeredAt`    | `string`         | วันที่สมัครสมาชิก (ISO 8601)       | Timestamp     |
| 13  | `updatedAt`       | `string`         | วันที่อัปเดตล่าสุด (ISO 8601)      | Timestamp     |

### MemberStatus Enum

| Value       | Description          |
| ----------- | -------------------- |
| `ACTIVE`    | สมาชิกใช้งานปกติ     |
| `INACTIVE`  | สมาชิกหยุดใช้งาน     |
| `SUSPENDED` | สมาชิกถูกระงับสิทธิ์ |

---

## Transaction Model

| #   | Attribute     | Type             | Description                   | Category    |
| --- | ------------- | ---------------- | ----------------------------- | ----------- |
| 1   | `id`          | `string`         | UUID ของบันทึกการทำรายการ     | Identity    |
| 2   | `bookId`      | `string`         | UUID ของหนังสือที่ยืม         | Relation    |
| 3   | `memberId`    | `string`         | UUID ของสมาชิกทียืม           | Relation    |
| 4   | `borrowedAt`  | `string`         | วัน/เวลาที่ยืมหนังสือ         | Timestamp   |
| 5   | `dueDate`     | `string \| null` | วันกำหนดคืน                   | Timestamp   |
| 6   | `returnedAt`  | `string \| null` | วัน/เวลาที่คืนหนังสือจริง     | Timestamp   |
| 7   | `fine`        | `number`         | ค่าปรับที่เกิดจากการคืนล่าช้า | Core Domain |
| 8   | `overdueDays` | `number`         | จำนวนวันที่เกินกำหนด          | Core Domain |

---

## Relationships

```
Book.currentBorrowerId  →  Member.id    (Many-to-One)
Book.reservedBy         →  Member.id[]  (One-to-Many - Array of Strings)
Member.borrowedBookIds  →  Book.id[]    (One-to-Many)
Transaction.bookId      →  Book.id      (Many-to-One)
Transaction.memberId    →  Member.id    (Many-to-One)
```

- สมาชิก 1 คนสามารถยืมหนังสือได้หลายเล่ม (ไม่เกิน `maxBooksAllowed`)
- หนังสือ 1 เล่มสามารถถูกยืมโดยสมาชิกได้ 1 คนในเวลาเดียวกัน
- หนังสือ 1 เล่มเมื่อถูกยืม สามารถถูกต่อคิวจอง (`reservedBy`) จากสมาชิกคนอื่น ๆ ได้
- ทุกครั้งที่มีการยืมและคืนระบบจะสร้างหรืออัปเดต Data ในตาราง `Transaction` เสมอ เพื่อเก็บประวัติและค่าปรับ
