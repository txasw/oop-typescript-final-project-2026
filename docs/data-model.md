# Data Model Documentation — Library Management System

## Overview

The Library Management System consists of 2 Core Data Models:

1. **Book** — Book Information
2. **Member** — Member Information

---

## Book Model

| #   | Attribute            | Type             | Description                            | Category      |
| --- | -------------------- | ---------------- | -------------------------------------- | ------------- |
| 1   | `id`                 | `string`         | Book UUID (auto-generated)             | Identity      |
| 2   | `isbn`               | `string`         | ISBN Code                              | Identity      |
| 3   | `title`              | `string`         | Book Title                             | Core Domain   |
| 4   | `author`             | `string`         | Author                                 | Core Domain   |
| 5   | `publisher`          | `string`         | Publisher                              | Core Domain   |
| 6   | `publishedYear`      | `number`         | Published Year (1000-2100)             | Core Domain   |
| 7   | `category`           | `BookCategory`   | Book Category (enum)                   | Core Domain   |
| 8   | `description`        | `string`         | Description / Synopsis                 | Core Domain   |
| 9   | `status`             | `BookStatus`     | Book Status (enum)                     | Status        |
| 10  | `isAvailableForLoan` | `boolean`        | Is the book available for loan         | Configuration |
| 11  | `currentBorrowerId`  | `string \| null` | ID of the member currently borrowing   | Relation      |
| 12  | `borrowedAt`         | `string \| null` | Borrowed Date (ISO 8601)               | Timestamp     |
| 13  | `dueDate`            | `string \| null` | Due Date (ISO 8601)                    | Timestamp     |
| 14  | `reservedBy`         | `string[]`       | Queue of member IDs reserving the book | Relation      |
| 15  | `deletedAt`          | `string \| null` | Deleted Date (Soft Delete)             | Timestamp     |
| 16  | `createdAt`          | `string`         | Created Date (ISO 8601)                | Timestamp     |
| 17  | `updatedAt`          | `string`         | Last Updated Date (ISO 8601)           | Timestamp     |

### BookStatus Enum

| Value         | Description                |
| ------------- | -------------------------- |
| `AVAILABLE`   | Book is available for loan |
| `BORROWED`    | Book is currently borrowed |
| `RESERVED`    | Book is reserved           |
| `MAINTENANCE` | Book is under maintenance  |

### BookCategory Enum

| Value         | Description          |
| ------------- | -------------------- |
| `FICTION`     | Fiction / Literature |
| `NON_FICTION` | Non-Fiction          |
| `SCIENCE`     | Science              |
| `TECHNOLOGY`  | Technology           |
| `HISTORY`     | History              |
| `ART`         | Art                  |
| `EDUCATION`   | Education            |
| `OTHER`       | Other                |

---

## Member Model

| #   | Attribute         | Type             | Description                                      | Category      |
| --- | ----------------- | ---------------- | ------------------------------------------------ | ------------- |
| 1   | `id`              | `string`         | Member UUID (auto-generated)                     | Identity      |
| 2   | `memberCode`      | `string`         | Member Code (auto: LIB-XXXX)                     | Identity      |
| 3   | `firstName`       | `string`         | First Name                                       | Core Domain   |
| 4   | `lastName`        | `string`         | Last Name                                        | Core Domain   |
| 5   | `email`           | `string`         | Email                                            | Core Domain   |
| 6   | `phone`           | `string`         | Phone Number                                     | Core Domain   |
| 7   | `address`         | `string`         | Address                                          | Core Domain   |
| 8   | `status`          | `MemberStatus`   | Member Status (enum)                             | Status        |
| 9   | `maxBooksAllowed` | `number`         | Maximum number of books allowed to borrow (1-20) | Configuration |
| 10  | `borrowedBookIds` | `string[]`       | List of Book IDs currently borrowed              | Relation      |
| 11  | `deletedAt`       | `string \| null` | Deleted Date (Soft Delete)                       | Timestamp     |
| 12  | `registeredAt`    | `string`         | Registered Date (ISO 8601)                       | Timestamp     |
| 13  | `updatedAt`       | `string`         | Last Updated Date (ISO 8601)                     | Timestamp     |

### MemberStatus Enum

| Value       | Description         |
| ----------- | ------------------- |
| `ACTIVE`    | Member is active    |
| `INACTIVE`  | Member is inactive  |
| `SUSPENDED` | Member is suspended |

---

## Transaction Model

| #   | Attribute     | Type             | Description                    | Category    |
| --- | ------------- | ---------------- | ------------------------------ | ----------- |
| 1   | `id`          | `string`         | Transaction UUID               | Identity    |
| 2   | `bookId`      | `string`         | Borrowed Book UUID             | Relation    |
| 3   | `memberId`    | `string`         | Borrowing Member UUID          | Relation    |
| 4   | `borrowedAt`  | `string`         | Date/Time borrowed             | Timestamp   |
| 5   | `dueDate`     | `string \| null` | Due Date                       | Timestamp   |
| 6   | `returnedAt`  | `string \| null` | Actual Date/Time returned      | Timestamp   |
| 7   | `fine`        | `number`         | Fine incurred from late return | Core Domain |
| 8   | `overdueDays` | `number`         | Number of overdue days         | Core Domain |

---

## Relationships

```
Book.currentBorrowerId  →  Member.id    (Many-to-One)
Book.reservedBy         →  Member.id[]  (One-to-Many - Array of Strings)
Member.borrowedBookIds  →  Book.id[]    (One-to-Many)
Transaction.bookId      →  Book.id      (Many-to-One)
Transaction.memberId    →  Member.id    (Many-to-One)
```

- 1 member can borrow multiple books (up to `maxBooksAllowed`)
- 1 book can be borrowed by 1 member at the same time
- When 1 book is borrowed, it can be reserved in queue (`reservedBy`) by other members
- Every time a borrow or return occurs, the system will always create or update data in the `Transaction` table to keep history and fines.
