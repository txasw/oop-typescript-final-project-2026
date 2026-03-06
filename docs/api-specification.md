# API Specification — Library Management System

## Base URL

```
http://localhost:3000
```

## Swagger Documentation

```
http://localhost:3000/api
```

## Standard Response Format

ทุก API ใช้ Response format เดียวกัน:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}
```

---

## Books API (`/books`)

### GET /books

ดึงรายการหนังสือทั้งหมด (รองรับ ค้นหา, กรอง และ แบ่งหน้า)

- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `search` (string) — ค้นหาจาก title, author, หรือ isbn
  - `category` (string) — กรองตามหมวดหมู่
  - `status` (string) — กรองตามสถานะ
- **Response:** `200 OK`

```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "isbn": "978-616-123-456-7",
      "title": "TypeScript Design Patterns",
      "author": "John Doe",
      "publisher": "Tech Publishing",
      "publishedYear": 2024,
      "category": "TECHNOLOGY",
      "description": "A comprehensive guide",
      "status": "AVAILABLE",
      "isAvailableForLoan": true,
      "currentBorrowerId": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### GET /books/:id

ดึงหนังสือตาม ID

- **Parameters:** `id` (UUID)
- **Response:** `200 OK` | `404 Not Found`

---

### GET /books/stats

ดึงสถิติของข้อมูลหนังสือทั้งหมด (รวมจำนวนหนังสือทั้งหมด, ว่าง, ถูกยืม และแบ่งตามหมวดหมู่)

- **Response:** `200 OK`

---

### POST /books/:id/borrow

ยืมหนังสือ โดยระบุรหัสสมาชิกผู้ยืม

- **Parameters:** `id` (UUID ของหนังสือ)
- **Response:** `200 OK` | `400 Bad Request` | `404 Not Found`
- **Body:**

```json
{
  "memberId": "member-uuid"
}
```

---

### POST /books/:id/return

คืนหนังสือที่ถูกยืม และระบบจะคำนวณค่าปรับอัตโนมัติ (และเปลี่ยนสถานะเป็น `RESERVED` ถัดไปหากมีคิว)

- **Parameters:** `id` (UUID ของหนังสือ)
- **Response:** `200 OK` | `400 Bad Request` | `404 Not Found`
- **Response Data Example:**

```json
{
  "success": true,
  "message": "Book returned successfully",
  "data": {
    "book": { ... },
    "fine": 150,
    "overdueDays": 3
  }
}
```

---

### POST /books/:id/reserve

จองหนังสือ (ต้องเป็นหนังสือที่มีสถานะ `BORROWED` หรือ `RESERVED` อยู่ และยังไม่ถึงคิวตัวเอง)

- **Parameters:** `id` (UUID ของหนังสือ)
- **Response:** `200 OK` | `400 Bad Request` | `404 Not Found`
- **Body:**

```json
{
  "memberId": "member-uuid"
}
```

---

### POST /books

สร้างหนังสือใหม่

- **Response:** `201 Created` | `400 Bad Request`
- **Body:**

```json
{
  "isbn": "978-616-123-456-7",
  "title": "TypeScript Design Patterns",
  "author": "John Doe",
  "publisher": "Tech Publishing",
  "publishedYear": 2024,
  "category": "TECHNOLOGY",
  "description": "A comprehensive guide",
  "status": "AVAILABLE",
  "isAvailableForLoan": true
}
```

| Field                | Type         | Required | Validation         |
| -------------------- | ------------ | -------- | ------------------ |
| `isbn`               | string       | ✅       | ไม่เป็นค่าว่าง     |
| `title`              | string       | ✅       | ไม่เป็นค่าว่าง     |
| `author`             | string       | ✅       | ไม่เป็นค่าว่าง     |
| `publisher`          | string       | ✅       | ไม่เป็นค่าว่าง     |
| `publishedYear`      | number       | ✅       | 1000-2100          |
| `category`           | BookCategory | ✅       | ค่าใน enum         |
| `description`        | string       | ✅       | ไม่เป็นค่าว่าง     |
| `status`             | BookStatus   | ❌       | default: AVAILABLE |
| `isAvailableForLoan` | boolean      | ❌       | default: true      |

---

### PUT /books/:id

อัปเดตข้อมูลหนังสือทั้งหมด (Full Update)

- **Parameters:** `id` (UUID)
- **Response:** `200 OK` | `400 Bad Request` | `404 Not Found`
- **Body:** เหมือน POST แต่ทุก field บังคับ (รวม `status` และ `isAvailableForLoan`)

---

### PATCH /books/:id

อัปเดตข้อมูลหนังสือบางส่วน (Partial Update)

- **Parameters:** `id` (UUID)
- **Response:** `200 OK` | `400 Bad Request` | `404 Not Found`
- **Body:** ส่งเฉพาะ field ที่ต้องการอัปเดต

---

### DELETE /books/:id

ลบหนังสือตาม ID (ใช้วิธีนำไป Soft Delete โดยปรับค่า `deletedAt` แทนการลบจากตารางจริง)

- **Parameters:** `id` (UUID)
- **Response:** `200 OK` | `404 Not Found`

---

## Members API (`/members`)

### GET /members

ดึงรายการสมาชิกทั้งหมด (รองรับ ค้นหา, กรอง และ แบ่งหน้า)

- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `search` (string) — ค้นหาจาก firstName, lastName, หรือ memberCode
  - `status` (string) — กรองตามสถานะ
- **Response:** `200 OK`

---

### GET /members/:id

ดึงสมาชิกตาม ID

- **Parameters:** `id` (UUID)
- **Response:** `200 OK` | `404 Not Found`

---

### GET /members/stats

ดึงสถิติข้อมูลสมาชิก (รวมจำนวนสมาชิกทั้งหมด, ใช้งานอยู่, ปิดใช้งาน, ระงับ)

- **Response:** `200 OK`

---

### POST /members

สมัครสมาชิกใหม่

- **Response:** `201 Created` | `400 Bad Request`
- **Body:**

```json
{
  "firstName": "สมชาย",
  "lastName": "ใจดี",
  "email": "somchai@example.com",
  "phone": "081-234-5678",
  "address": "123 ถ.สุขุมวิท กรุงเทพฯ 10110",
  "status": "ACTIVE",
  "maxBooksAllowed": 5
}
```

| Field             | Type         | Required | Validation            |
| ----------------- | ------------ | -------- | --------------------- |
| `firstName`       | string       | ✅       | ไม่เป็นค่าว่าง        |
| `lastName`        | string       | ✅       | ไม่เป็นค่าว่าง        |
| `email`           | string       | ✅       | ต้องเป็น format email |
| `phone`           | string       | ✅       | ไม่เป็นค่าว่าง        |
| `address`         | string       | ✅       | ไม่เป็นค่าว่าง        |
| `status`          | MemberStatus | ❌       | default: ACTIVE       |
| `maxBooksAllowed` | number       | ❌       | 1-20, default: 5      |

---

### PUT /members/:id

อัปเดตข้อมูลสมาชิกทั้งหมด (Full Update)

- **Parameters:** `id` (UUID)
- **Response:** `200 OK` | `400 Bad Request` | `404 Not Found`

---

### PATCH /members/:id

อัปเดตข้อมูลสมาชิกบางส่วน (Partial Update)

- **Parameters:** `id` (UUID)
- **Response:** `200 OK` | `400 Bad Request` | `404 Not Found`

---

### DELETE /members/:id

ลบสมาชิกตาม ID (Soft Delete)

- **Parameters:** `id` (UUID)
- **Response:** `200 OK` | `404 Not Found`

---

## Transactions API (`/transactions`)

### GET /transactions

ดึงรายการประวัติการยืม-คืนหนังสือทั้งหมด (รองรับ กรอง และ แบ่งหน้า)

- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `bookId` (string) — กรองตามรหัสหนังสือ
  - `memberId` (string) — กรองตามรหัสสมาชิก
- **Response:** `200 OK`

---

## Error Response Format

```json
{
  "success": false,
  "message": "Book with ID \"invalid-id\" not found",
  "data": null
}
```

### HTTP Status Codes

| Code  | Description                                       |
| ----- | ------------------------------------------------- |
| `200` | OK — สำเร็จ (GET, PUT, PATCH, DELETE)             |
| `201` | Created — สร้างข้อมูลสำเร็จ (POST)                |
| `400` | Bad Request — ข้อมูลไม่ถูกต้อง (Validation error) |
| `404` | Not Found — ไม่พบข้อมูล                           |
| `500` | Internal Server Error — ข้อผิดพลาดภายในระบบ       |

---

## Health Check API (`/health`)

### GET /health

ตรวจสอบสถานะการทำงานของระบบ

- **Response:** `200 OK`

```json
{
  "status": "ok",
  "uptime": 120.5,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "message": "Library Management System API is running smoothly."
}
```
