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

All APIs use the same Response format:

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

Retrieve all books (supports search, filter, and pagination)

- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `search` (string) — Search by title, author, or isbn
  - `category` (string) — Filter by category
  - `status` (string) — Filter by status
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

Retrieve a book by ID

- **Parameters:** `id` (UUID)
- **Response:** `200 OK` | `404 Not Found`

---

### GET /books/stats

Retrieve book statistics (including total books, available, borrowed, and grouped by category)

- **Response:** `200 OK`

---

### POST /books/:id/borrow

Borrow a book by specifying the member ID

- **Parameters:** `id` (Book UUID)
- **Response:** `200 OK` | `400 Bad Request` | `404 Not Found`
- **Body:**

```json
{
  "memberId": "member-uuid"
}
```

---

### POST /books/:id/return

Return a borrowed book. The system will auto-calculate any fines (and change status to `RESERVED` for the next member in queue, if applicable)

- **Parameters:** `id` (Book UUID)
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

Reserve a book (The book must have a `BORROWED` or `RESERVED` status, and the member must not already be in the queue)

- **Parameters:** `id` (Book UUID)
- **Response:** `200 OK` | `400 Bad Request` | `404 Not Found`
- **Body:**

```json
{
  "memberId": "member-uuid"
}
```

---

### POST /books

Create a new book

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
| `isbn`               | string       | ✅       | Cannot be empty    |
| `title`              | string       | ✅       | Cannot be empty    |
| `author`             | string       | ✅       | Cannot be empty    |
| `publisher`          | string       | ✅       | Cannot be empty    |
| `publishedYear`      | number       | ✅       | 1000-2100          |
| `category`           | BookCategory | ✅       | Valid enum value   |
| `description`        | string       | ✅       | Cannot be empty    |
| `status`             | BookStatus   | ❌       | default: AVAILABLE |
| `isAvailableForLoan` | boolean      | ❌       | default: true      |

---

### PUT /books/:id

Update all book information (Full Update)

- **Parameters:** `id` (UUID)
- **Response:** `200 OK` | `400 Bad Request` | `404 Not Found`
- **Body:** Same as POST but all fields are required (including `status` and `isAvailableForLoan`)

---

### PATCH /books/:id

Update partial book information (Partial Update)

- **Parameters:** `id` (UUID)
- **Response:** `200 OK` | `400 Bad Request` | `404 Not Found`
- **Body:** Send only the fields to be updated

---

### DELETE /books/:id

Delete a book by ID (Uses Soft Delete by updating `deletedAt` instead of physically removing it from the table)

- **Parameters:** `id` (UUID)
- **Response:** `200 OK` | `404 Not Found`

---

## Members API (`/members`)

### GET /members

Retrieve all members (supports search, filter, and pagination)

- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `search` (string) — Search by firstName, lastName, or memberCode
  - `status` (string) — Filter by status
- **Response:** `200 OK`

---

### GET /members/:id

Retrieve a member by ID

- **Parameters:** `id` (UUID)
- **Response:** `200 OK` | `404 Not Found`

---

### GET /members/stats

Retrieve member statistics (including total members, active, inactive, suspended)

- **Response:** `200 OK`

---

### POST /members

Register a new member

- **Response:** `201 Created` | `400 Bad Request`
- **Body:**

```json
{
  "firstName": "Somchai",
  "lastName": "Jaidee",
  "email": "somchai@example.com",
  "phone": "081-234-5678",
  "address": "123 Sukhumvit Rd, Bangkok 10110",
  "status": "ACTIVE",
  "maxBooksAllowed": 5
}
```

| Field             | Type         | Required | Validation                 |
| ----------------- | ------------ | -------- | -------------------------- |
| `firstName`       | string       | ✅       | Cannot be empty            |
| `lastName`        | string       | ✅       | Cannot be empty            |
| `email`           | string       | ✅       | Must be valid email format |
| `phone`           | string       | ✅       | Cannot be empty            |
| `address`         | string       | ✅       | Cannot be empty            |
| `status`          | MemberStatus | ❌       | default: ACTIVE            |
| `maxBooksAllowed` | number       | ❌       | 1-20, default: 5           |

---

### PUT /members/:id

Update all member information (Full Update)

- **Parameters:** `id` (UUID)
- **Response:** `200 OK` | `400 Bad Request` | `404 Not Found`

---

### PATCH /members/:id

Update partial member information (Partial Update)

- **Parameters:** `id` (UUID)
- **Response:** `200 OK` | `400 Bad Request` | `404 Not Found`

---

### DELETE /members/:id

Delete a member by ID (Soft Delete)

- **Parameters:** `id` (UUID)
- **Response:** `200 OK` | `404 Not Found`

---

## Transactions API (`/transactions`)

### GET /transactions

Retrieve all borrowing and returning history (supports filter and pagination)

- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `bookId` (string) — Filter by book ID
  - `memberId` (string) — Filter by member ID
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

| Code  | Description                                         |
| ----- | --------------------------------------------------- |
| `200` | OK — Success (GET, PUT, PATCH, DELETE)              |
| `201` | Created — Successfully created (POST)               |
| `400` | Bad Request — Invalid data (Validation error)       |
| `404` | Not Found — Resource not found                      |
| `500` | Internal Server Error — System encountered an error |

---

## Health Check API (`/health`)

### GET /health

Check system health status

- **Response:** `200 OK`

```json
{
  "status": "ok",
  "uptime": 120.5,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "message": "Library Management System API is running smoothly."
}
```
