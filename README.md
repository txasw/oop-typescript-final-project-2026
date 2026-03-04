# Library Management System API

## 📌 Project Overview

ระบบจัดการห้องสมุด (Library Management System) พัฒนาด้วย **NestJS + TypeScript**
รองรับ CRUD Operation สำหรับข้อมูลหนังสือ (Book) และสมาชิก (Member)

**Model Set:** 9 — Library Management System

---

## 👥 Team Members

| Role | ชื่อ                      | GitHub           | Student ID |
| ---- | ------------------------- | ---------------- | ---------- |
| Lead | นายธนะสิทธิ์ อัศวสกุลวงศ์ | `txasw`          | 68010488   |
| Dev  | นางสาวชาลิสา เทพยาน       | `68010244-cloud` | 68010244   |
| QA   | นางสาวทอแสงรัศมี ทัสสะ    | `izcazy`         | 68010409   |
| Ops  | นายชัยมงคล ถืออยู่        | `68010238`       | 68010238   |

---

## 🛠 Technology Stack

- **Framework:** NestJS
- **Language:** TypeScript (strict mode)
- **API Style:** REST API
- **Database:** In-memory (JSON-based)
- **API Documentation:** Swagger (OpenAPI)
- **Validation:** class-validator / class-transformer
- **Linting:** ESLint (no `any` rule enforced)

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run start:dev
```

### 3. API Documentation (Swagger)

เมื่อรันโปรเจคแล้ว สามารถเข้าดู Swagger ได้ที่:

```
http://localhost:3000/api
```

---

## 📁 Project Structure

```text
.
├── src/
│   ├── main.ts                          # Entry point + Swagger setup
│   ├── app.module.ts                    # Root module
│   │
│   ├── common/
│   │   ├── interfaces/
│   │   │   └── api-response.interface.ts    # ApiResponse<T>
│   │   ├── enums/
│   │   │   ├── book-status.enum.ts
│   │   │   ├── book-category.enum.ts
│   │   │   └── member-status.enum.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts     # Global error handler
│   │   └── utils/
│   │       └── generate-id.util.ts
│   │
│   └── modules/
│       ├── books/
│       │   ├── books.module.ts
│       │   ├── books.controller.ts
│       │   ├── books.service.ts
│       │   ├── interfaces/
│       │   │   └── book.interface.ts
│       │   └── dto/
│       │       ├── create-book.dto.ts
│       │       ├── update-book.dto.ts
│       │       └── patch-book.dto.ts
│       │
│       └── members/
│           ├── members.module.ts
│           ├── members.controller.ts
│           ├── members.service.ts
│           ├── interfaces/
│           │   └── member.interface.ts
│           └── dto/
│               ├── create-member.dto.ts
│               ├── update-member.dto.ts
│               └── patch-member.dto.ts
│
├── docs/
│   ├── api-specification.md     # API Specification
│   ├── data-model.md            # Data Model Documentation
│   └── uml-diagram.png          # UML Diagram
│
├── subjects/                    # Project requirements
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧩 Data Models

### Book (13 Attributes)

หนังสือในระบบห้องสมุด — รองรับสถานะ, หมวดหมู่, และการยืม

### Member (12 Attributes)

สมาชิกห้องสมุด — รองรับรหัสสมาชิกอัตโนมัติ (LIB-XXXX) และการจำกัดจำนวนหนังสือที่ยืม

**รายละเอียด:** → [`docs/data-model.md`](docs/data-model.md)

---

## 📝 API Endpoints

### Books (`/books`)

| Method | Endpoint     | Description             |
| ------ | ------------ | ----------------------- |
| GET    | `/books`     | ดึงรายการหนังสือทั้งหมด |
| GET    | `/books/:id` | ดึงหนังสือตาม ID        |
| POST   | `/books`     | เพิ่มหนังสือใหม่        |
| PUT    | `/books/:id` | อัปเดตข้อมูลทั้งหมด     |
| PATCH  | `/books/:id` | อัปเดตบางส่วน           |
| DELETE | `/books/:id` | ลบหนังสือ               |

### Members (`/members`)

| Method | Endpoint       | Description            |
| ------ | -------------- | ---------------------- |
| GET    | `/members`     | ดึงรายการสมาชิกทั้งหมด |
| GET    | `/members/:id` | ดึงสมาชิกตาม ID        |
| POST   | `/members`     | สมัครสมาชิกใหม่        |
| PUT    | `/members/:id` | อัปเดตข้อมูลทั้งหมด    |
| PATCH  | `/members/:id` | อัปเดตบางส่วน          |
| DELETE | `/members/:id` | ลบสมาชิก               |

**รายละเอียด:** → [`docs/api-specification.md`](docs/api-specification.md)

---

## 📄 Documentation

- 🔌 **API Specification** → [`docs/api-specification.md`](docs/api-specification.md)
- 🧱 **Data Model** → [`docs/data-model.md`](docs/data-model.md)
- 📊 **UML Diagram** → [`docs/uml-diagram.png`](docs/uml-diagram.png)

---

## 🤖 AI Usage Policy

- อนุญาตให้ใช้ AI ช่วยในการพัฒนาโปรเจค
- นักศึกษาต้องสามารถอธิบายโค้ดและแนวคิดของระบบได้ด้วยตนเอง

---

📌 _This repository is intended for educational purposes only._
