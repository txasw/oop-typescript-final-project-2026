# Library Management System API

> A production-grade REST API for library management, built with NestJS and TypeScript. Supports full CRUD operations, a borrowing lifecycle with due dates and fines, book reservation queues, transaction history, soft-delete data safety, and real-time statistics — all powered by an in-memory data store.

**Model Set:** 9 — Library Management System

---

## Team Members

| Role | Name                      | GitHub           | Student ID |
| ---- | ------------------------- | ---------------- | ---------- |
| Lead | นายธนะสิทธิ์ อัศวสกุลวงศ์ | `txasw`          | 68010488   |
| Dev  | นางสาวชาลิสา เทพยาน       | `68010244-cloud` | 68010244   |
| QA   | นางสาวทอแสงรัศมี ทัสสะ    | `izcazy`         | 68010409   |
| Ops  | นายชัยมงคล ถืออยู่        | `68010238`       | 68010238   |

---

## Technology Stack

| Layer      | Technology                         |
| ---------- | ---------------------------------- |
| Framework  | NestJS 10                          |
| Language   | TypeScript (strict mode)           |
| API Style  | RESTful                            |
| Storage    | In-memory (JSON arrays)            |
| Docs       | Swagger / OpenAPI                  |
| Validation | class-validator, class-transformer |
| Testing    | Jest                               |
| Linting    | ESLint (no `any` rule)             |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run start:dev

# 3. Run tests
npm run test

# 4. Build for production
npm run build
```

Swagger UI is available at **http://localhost:3000/api** after starting the server.

---

## Architecture Overview

The application follows a standard NestJS modular architecture. Each domain entity (Books, Members, Transactions) is isolated into its own module with a dedicated controller, service, DTO layer, and interface definition. Cross-module communication (e.g., the borrowing lifecycle) is handled through `forwardRef` dependency injection.

```
src/
├── main.ts                                  # Bootstrap + Swagger + global pipes
├── app.module.ts                            # Root module
│
├── common/
│   ├── interfaces/
│   │   ├── api-response.interface.ts        # ApiResponse<T> wrapper
│   │   └── paginated-response.interface.ts  # PaginatedResponse<T>
│   ├── dto/
│   │   └── pagination.dto.ts                # Shared pagination params
│   ├── enums/
│   │   ├── book-status.enum.ts              # AVAILABLE | BORROWED | RESERVED | MAINTENANCE
│   │   ├── book-category.enum.ts            # TECHNOLOGY | SCIENCE | LITERATURE | ...
│   │   └── member-status.enum.ts            # ACTIVE | INACTIVE | SUSPENDED
│   ├── filters/
│   │   └── http-exception.filter.ts         # Global exception → ApiResponse format
│   ├── interceptors/
│   │   └── logging.interceptor.ts           # HTTP request logging (method, url, ms)
│   └── utils/
│       └── generate-id.util.ts              # UUID generator
│
└── modules/
    ├── books/
    │   ├── books.module.ts
    │   ├── books.controller.ts              # 10 endpoints
    │   ├── books.service.ts                 # Business logic + borrowing lifecycle
    │   ├── books.service.spec.ts            # Unit tests
    │   ├── interfaces/book.interface.ts     # 17 attributes
    │   ├── data/book-seeds.ts               # 5 pre-loaded records
    │   └── dto/                             # create, update, patch, filter, borrow
    │
    ├── members/
    │   ├── members.module.ts
    │   ├── members.controller.ts            # 8 endpoints
    │   ├── members.service.ts               # Auto member-code generation (LIB-XXXX)
    │   ├── members.service.spec.ts          # Unit tests
    │   ├── interfaces/member.interface.ts   # 13 attributes
    │   ├── data/member-seeds.ts             # 3 pre-loaded records
    │   └── dto/                             # create, update, patch, filter
    │
    ├── transactions/
    │   ├── transactions.module.ts
    │   ├── transactions.controller.ts       # GET /transactions with filters
    │   ├── transactions.service.ts          # In-memory transaction log
    │   └── interfaces/transaction.interface.ts
    │
    └── health/
        ├── health.module.ts
        └── health.controller.ts             # GET /health
```

---

## Features

### 1. Full CRUD for Books and Members

Standard `GET`, `POST`, `PUT`, `PATCH`, `DELETE` operations with DTO-based validation, consistent `ApiResponse<T>` response format, and Swagger documentation for every endpoint.

### 2. Search, Filter, and Pagination

All list endpoints support query-based searching (`?search=keyword`), filtering by status/category, and pagination (`?page=1&limit=10`) through a shared `PaginationDto`.

### 3. Borrowing Lifecycle

| Action  | Endpoint                  | Description                                                                                     |
| ------- | ------------------------- | ----------------------------------------------------------------------------------------------- |
| Borrow  | `POST /books/:id/borrow`  | Validates member status, quota, and book availability. Sets a 7-day due date.                   |
| Return  | `POST /books/:id/return`  | Calculates overdue fines (10 THB/day). Auto-assigns to next member in reservation queue if any. |
| Reserve | `POST /books/:id/reserve` | Adds a member to the waitlist for a book that is currently borrowed.                            |

**Validations performed:**

- Member must be `ACTIVE`
- Member must not exceed `maxBooksAllowed`
- Book must be `AVAILABLE` (borrow) or `BORROWED`/`RESERVED` (reserve)
- Duplicate reservations and self-reservations are rejected

### 4. Due Date Tracking and Overdue Fines

When a book is borrowed, the system automatically stamps `borrowedAt` and calculates `dueDate` (7 days from borrow). On return, if the current date exceeds the due date, the system calculates `overdueDays` and a fine at 10 THB per day — both values are returned in the API response.

### 5. Transaction History

Every borrow and return action is recorded as a `Transaction` entry, including snapshots of the book title, member name, timestamps, and any applicable fines. The history is queryable at `GET /transactions` with optional `bookId` or `memberId` filters.

### 6. Reservation Queue (Waitlist)

When a book is borrowed, other members can reserve it. A `reservedBy` queue stores member IDs in FIFO order. When the book is returned, the system automatically assigns it to the next member in the queue and transitions its status to `RESERVED`, rather than back to `AVAILABLE`.

### 7. Soft Delete

Deleting a book or member sets a `deletedAt` timestamp instead of removing the record from memory. All `GET` queries automatically filter out soft-deleted records, preserving data integrity and enabling future recovery.

### 8. Health Check and Request Logging

- `GET /health` returns current server status, uptime (seconds), and timestamp.
- A global `LoggingInterceptor` logs every HTTP request with method, URL, status code, and processing time in milliseconds.

### 9. Statistics Endpoints

- `GET /books/stats` — Total books, available vs borrowed counts, grouped by category.
- `GET /members/stats` — Total members, active/inactive/suspended distribution.

### 10. Seed Data

The system pre-loads 5 sample books and 3 sample members on startup, so the API is ready for demonstration out of the box.

---

## API Endpoint Summary

### Books — `/books`

| Method | Endpoint             | Description                                 |
| ------ | -------------------- | ------------------------------------------- |
| GET    | `/books`             | List all books (search, filter, pagination) |
| GET    | `/books/stats`       | Book statistics                             |
| GET    | `/books/:id`         | Get book by ID                              |
| POST   | `/books`             | Create a new book                           |
| PUT    | `/books/:id`         | Full update                                 |
| PATCH  | `/books/:id`         | Partial update                              |
| DELETE | `/books/:id`         | Soft delete                                 |
| POST   | `/books/:id/borrow`  | Borrow a book                               |
| POST   | `/books/:id/return`  | Return a book (with fine calculation)       |
| POST   | `/books/:id/reserve` | Reserve a borrowed book                     |

### Members — `/members`

| Method | Endpoint         | Description                                   |
| ------ | ---------------- | --------------------------------------------- |
| GET    | `/members`       | List all members (search, filter, pagination) |
| GET    | `/members/stats` | Member statistics                             |
| GET    | `/members/:id`   | Get member by ID                              |
| POST   | `/members`       | Register a new member                         |
| PUT    | `/members/:id`   | Full update                                   |
| PATCH  | `/members/:id`   | Partial update                                |
| DELETE | `/members/:id`   | Soft delete                                   |

### Transactions — `/transactions`

| Method | Endpoint        | Description                                     |
| ------ | --------------- | ----------------------------------------------- |
| GET    | `/transactions` | Transaction history (filter by bookId/memberId) |

### System — `/health`

| Method | Endpoint  | Description  |
| ------ | --------- | ------------ |
| GET    | `/health` | Health check |

---

## Data Models

### Book (17 Attributes)

`id`, `isbn`, `title`, `author`, `publisher`, `publishedYear`, `category`, `description`, `status`, `isAvailableForLoan`, `currentBorrowerId`, `reservedBy`, `borrowedAt`, `dueDate`, `deletedAt`, `createdAt`, `updatedAt`

### Member (13 Attributes)

`id`, `memberCode`, `firstName`, `lastName`, `email`, `phone`, `address`, `status`, `maxBooksAllowed`, `borrowedBookIds`, `deletedAt`, `registeredAt`, `updatedAt`

### Transaction (12 Attributes)

`id`, `bookId`, `bookTitle`, `memberId`, `memberName`, `action`, `borrowedAt`, `dueDate`, `returnedAt`, `fine`, `overdueDays`, `createdAt`

Full documentation: [docs/data-model.md](docs/data-model.md) | [docs/api-specification.md](docs/api-specification.md)

---

## Testing

```bash
npm run test          # Run all unit tests
npm run test:cov      # Run with coverage report
npm run test:watch    # Watch mode
```

Unit tests cover `BooksService` and `MembersService` with isolated dependency injection mocks. All 16 test cases pass across 3 test suites.

---

## Documentation

| Document             | Path                                                         |
| -------------------- | ------------------------------------------------------------ |
| API Specification    | [docs/api-specification.md](docs/api-specification.md)       |
| Data Model           | [docs/data-model.md](docs/data-model.md)                     |
| UML Diagram          | [docs/uml-diagram.png](docs/uml-diagram.png)                 |
| Submission Checklist | [docs/submission-checklist.md](docs/submission-checklist.md) |

---

## AI Usage Policy

AI tools were used to assist in the development of this project. All team members are able to independently explain the code, architecture, and design decisions presented here.

---

_This repository is intended for educational purposes as part of the OOP with TypeScript course._
