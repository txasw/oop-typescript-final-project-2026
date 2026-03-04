# Submission Checklist 📝

## 1. Project Requirements (10 คะแนน)

- [x] ส่ง GitHub Repository URL ผ่านฟอร์ม (Public Access)
- [x] มี commit รวมอย่างน้อย 10 commits
- [x] ใช้ Git อย่างสม่ำเสมอ (`--no-ff` strategy)

## 2. README.md & Documentation (15 คะแนน)

- [x] `README.md` กำหนดข้อมูล:
  - ชื่อโปรเจค และรายละเอียดชัดเจน
  - โครงสร้างโปรเจค และวิธีรัน
  - Model Set 9 (Library Management System)
  - รายชื่อสมาชิกทีม (Student ID, Name, GitHub Username)
- [x] `docs/data-model.md` มีข้อมูล Interfaces ของ Books และ Members ครบถ้วน
- [x] `docs/api-specification.md` อธิบาย Routes ครบถ้วน
- [x] มีรูป UML Diagram

## 3. Core Features (60 คะแนน)

- [x] 3.1 Book Model & Interface (Properties ครบตามที่กำหนดอย่างน้อย 10 properties)
- [x] 3.2 Post/Get Book Endpoints
- [x] 3.3 Member Model & Interface
- [x] 3.4 Post/Get Member Endpoints
- [x] 3.5 Use `ApiResponse<T>` แบบ unified
- [x] 3.6 Enum mapping สำหรับ Statuses/Categories

## 4. Advanced/Bonus Features (15 คะแนน)

- [x] 4.1 Search, Filter, Pagination สำหรับ GET endpoints
- [x] 4.2 Borrowing System Logic (Validation maxBooks, book availability, and statuses)
- [x] 4.3 Statistics endpoints (`/books/stats`, `/members/stats`)
- [x] 4.4 In-memory seed data initialization
- [x] 4.5 Global logging interceptor (HTTP requests)
- [x] 4.6 Health check status (`/health`)
- [x] 4.7 Swagger OpenAPI implementation
- [x] 4.8 Unit Tests (BooksService, MembersService)

---

**Status:** ALL CHECKED AND READY FOR SUBMISSION. ✅
