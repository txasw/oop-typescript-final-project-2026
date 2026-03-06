import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { Book } from "./interfaces/book.interface";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { PatchBookDto } from "./dto/patch-book.dto";
import { FilterBookDto } from "./dto/filter-book.dto";
import { BookStatus } from "../../common/enums/book-status.enum";
import { BookCategory } from "../../common/enums/book-category.enum";
import { MemberStatus } from "../../common/enums/member-status.enum";
import { generateId } from "../../common/utils/generate-id.util";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { PaginatedResponse } from "../../common/interfaces/paginated-response.interface";
import { MembersService } from "../members/members.service";
import { TransactionsService } from "../transactions/transactions.service";
import { bookSeeds } from "./data/book-seeds";

/**
 * BooksService — จัดการข้อมูลหนังสือแบบ in-memory
 */
@Injectable()
export class BooksService {
  constructor(
    @Inject(forwardRef(() => MembersService))
    private readonly membersService: MembersService,
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionsService: TransactionsService,
  ) {}

  private books: Book[] = [...bookSeeds];

  /**
   * ดึงรายการหนังสือทั้งหมด พร้อม search, filter, pagination (กรองข้อมูลที่ถูก soft delete ออก)
   */
  findAll(
    paginationDto: PaginationDto,
    filterDto: FilterBookDto,
  ): PaginatedResponse<Book> {
    let filtered = this.books.filter((b) => b.deletedAt === null);

    // Filter by category
    if (filterDto.category) {
      filtered = filtered.filter((b) => b.category === filterDto.category);
    }

    // Filter by status
    if (filterDto.status) {
      filtered = filtered.filter((b) => b.status === filterDto.status);
    }

    // Search across string fields
    if (paginationDto.search) {
      const keyword = paginationDto.search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(keyword) ||
          b.author.toLowerCase().includes(keyword) ||
          b.isbn.toLowerCase().includes(keyword) ||
          b.publisher.toLowerCase().includes(keyword) ||
          b.description.toLowerCase().includes(keyword),
      );
    }

    // Pagination
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit);
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return {
      items,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
      },
    };
  }

  /**
   * ดึงหนังสือตาม ID
   * @throws NotFoundException ถ้าไม่พบหนังสือ
   */
  findOne(id: string): Book {
    const book = this.books.find((b) => b.id === id && b.deletedAt === null);
    if (!book) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }
    return book;
  }

  /**
   * สร้างหนังสือใหม่
   */
  create(createBookDto: CreateBookDto): Book {
    const now = new Date().toISOString();
    const newBook: Book = {
      id: generateId(),
      isbn: createBookDto.isbn,
      title: createBookDto.title,
      author: createBookDto.author,
      publisher: createBookDto.publisher,
      publishedYear: createBookDto.publishedYear,
      category: createBookDto.category,
      description: createBookDto.description,
      status: createBookDto.status ?? BookStatus.AVAILABLE,
      isAvailableForLoan: createBookDto.isAvailableForLoan ?? true,
      currentBorrowerId: null,
      reservedBy: [],
      borrowedAt: null,
      dueDate: null,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    this.books.push(newBook);
    return newBook;
  }

  /**
   * อัปเดตข้อมูลหนังสือทั้งหมด (PUT)
   * @throws NotFoundException ถ้าไม่พบหนังสือ
   */
  update(id: string, updateBookDto: UpdateBookDto): Book {
    const bookIndex = this.books.findIndex((b) => b.id === id);
    if (bookIndex === -1) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }

    const existingBook = this.books[bookIndex];
    const updatedBook: Book = {
      id: existingBook.id,
      isbn: updateBookDto.isbn,
      title: updateBookDto.title,
      author: updateBookDto.author,
      publisher: updateBookDto.publisher,
      publishedYear: updateBookDto.publishedYear,
      category: updateBookDto.category,
      description: updateBookDto.description,
      status: updateBookDto.status,
      isAvailableForLoan: updateBookDto.isAvailableForLoan,
      currentBorrowerId: existingBook.currentBorrowerId,
      reservedBy: existingBook.reservedBy,
      borrowedAt: existingBook.borrowedAt,
      dueDate: existingBook.dueDate,
      deletedAt: existingBook.deletedAt,
      createdAt: existingBook.createdAt,
      updatedAt: new Date().toISOString(),
    };

    this.books[bookIndex] = updatedBook;
    return updatedBook;
  }

  /**
   * อัปเดตข้อมูลหนังสือบางส่วน (PATCH)
   * @throws NotFoundException ถ้าไม่พบหนังสือ
   */
  patch(id: string, patchBookDto: PatchBookDto): Book {
    const bookIndex = this.books.findIndex((b) => b.id === id);
    if (bookIndex === -1) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }

    const existingBook = this.books[bookIndex];
    const patchedBook: Book = {
      ...existingBook,
      ...(patchBookDto.isbn !== undefined && { isbn: patchBookDto.isbn }),
      ...(patchBookDto.title !== undefined && { title: patchBookDto.title }),
      ...(patchBookDto.author !== undefined && { author: patchBookDto.author }),
      ...(patchBookDto.publisher !== undefined && {
        publisher: patchBookDto.publisher,
      }),
      ...(patchBookDto.publishedYear !== undefined && {
        publishedYear: patchBookDto.publishedYear,
      }),
      ...(patchBookDto.category !== undefined && {
        category: patchBookDto.category,
      }),
      ...(patchBookDto.description !== undefined && {
        description: patchBookDto.description,
      }),
      ...(patchBookDto.status !== undefined && { status: patchBookDto.status }),
      ...(patchBookDto.isAvailableForLoan !== undefined && {
        isAvailableForLoan: patchBookDto.isAvailableForLoan,
      }),
      updatedAt: new Date().toISOString(),
    };

    this.books[bookIndex] = patchedBook;
    return patchedBook;
  }

  /**
   * ลบหนังสือตาม ID
   * @throws NotFoundException ถ้าไม่พบหนังสือ
   */
  remove(id: string): Book {
    const book = this.findOne(id);
    const bookIndex = this.books.findIndex((b) => b.id === id);
    this.books[bookIndex] = {
      ...book,
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return this.books[bookIndex];
  }

  /**
   * ยืมหนังสือ
   * @throws NotFoundException ถ้าไม่พบหนังสือหรือสมาชิก
   * @throws BadRequestException ถ้าหนังสือไม่พร้อมให้ยืมหรือสมาชิกยืมเต็มโคต้า
   */
  borrow(bookId: string, memberId: string): Book {
    const book = this.findOne(bookId);
    const member = this.membersService.findOne(memberId);

    // Validate book availability
    if (book.status === BookStatus.BORROWED) {
      throw new BadRequestException(`Book "${book.title}" is already borrowed`);
    }
    if (!book.isAvailableForLoan) {
      throw new BadRequestException(
        `Book "${book.title}" is not available for loan`,
      );
    }
    if (book.status === BookStatus.MAINTENANCE) {
      throw new BadRequestException(
        `Book "${book.title}" is under maintenance`,
      );
    }

    // Validate member
    if (member.status !== MemberStatus.ACTIVE) {
      throw new BadRequestException(
        `Member "${member.firstName} ${member.lastName}" is not active (status: ${member.status})`,
      );
    }
    if (member.borrowedBookIds.length >= member.maxBooksAllowed) {
      throw new BadRequestException(
        `Member has reached the maximum borrowing limit (${member.maxBooksAllowed} books)`,
      );
    }

    // Update book status
    const now = new Date();
    const dueDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const bookIndex = this.books.findIndex((b) => b.id === bookId);
    this.books[bookIndex] = {
      ...book,
      status: BookStatus.BORROWED,
      currentBorrowerId: memberId,
      borrowedAt: now.toISOString(),
      dueDate: dueDate.toISOString(),
      updatedAt: now.toISOString(),
    };

    // Update member's borrowed list
    this.membersService.addBorrowedBook(memberId, bookId);

    // Record transaction
    this.transactionsService.record({
      bookId,
      bookTitle: book.title,
      memberId,
      memberName: `${member.firstName} ${member.lastName}`,
      action: "BORROW",
      borrowedAt: now.toISOString(),
      dueDate: dueDate.toISOString(),
      returnedAt: null,
      fine: 0,
      overdueDays: 0,
    });

    return this.books[bookIndex];
  }

  /**
   * คืนหนังสือ — คำนวณค่าปรับถ้าเลยกำหนด (10 บาท/วัน)
   * @throws NotFoundException ถ้าไม่พบหนังสือ
   * @throws BadRequestException ถ้าหนังสือไม่ได้ถูกยืม
   */
  returnBook(bookId: string): {
    book: Book;
    fine: number;
    overdueDays: number;
  } {
    const book = this.findOne(bookId);

    if (book.status !== BookStatus.BORROWED || !book.currentBorrowerId) {
      throw new BadRequestException(
        `Book "${book.title}" is not currently borrowed`,
      );
    }

    const borrowerId = book.currentBorrowerId;

    // Calculate overdue fine
    let fine = 0;
    let overdueDays = 0;
    if (book.dueDate) {
      const now = new Date();
      const due = new Date(book.dueDate);
      if (now > due) {
        overdueDays = Math.ceil(
          (now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24),
        );
        fine = overdueDays * 10; // 10 THB per day
      }
    }

    // Update book status — auto-assign to first in reservation queue if any
    const bookIndex = this.books.findIndex((b) => b.id === bookId);
    if (book.reservedBy.length > 0) {
      const nextMemberId = book.reservedBy[0];
      const now = new Date();
      const newDueDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      this.books[bookIndex] = {
        ...book,
        status: BookStatus.RESERVED,
        currentBorrowerId: nextMemberId,
        reservedBy: book.reservedBy.slice(1),
        borrowedAt: now.toISOString(),
        dueDate: newDueDate.toISOString(),
        updatedAt: now.toISOString(),
      };
      this.membersService.addBorrowedBook(nextMemberId, bookId);
    } else {
      this.books[bookIndex] = {
        ...book,
        status: BookStatus.AVAILABLE,
        currentBorrowerId: null,
        borrowedAt: null,
        dueDate: null,
        updatedAt: new Date().toISOString(),
      };
    }

    // Remove from member's borrowed list
    this.membersService.removeBorrowedBook(borrowerId, bookId);

    // Record transaction
    this.transactionsService.record({
      bookId,
      bookTitle: book.title,
      memberId: borrowerId,
      memberName: "", // snapshot not available on return
      action: "RETURN",
      borrowedAt: book.borrowedAt ?? "",
      dueDate: book.dueDate ?? "",
      returnedAt: new Date().toISOString(),
      fine,
      overdueDays,
    });

    return { book: this.books[bookIndex], fine, overdueDays };
  }

  /**
   * จองหนังสือที่ถูกยืมอยู่ — เพิ่มสมาชิกเข้าคิวรอ
   * @throws NotFoundException ถ้าไม่พบหนังสือหรือสมาชิก
   * @throws BadRequestException ถ้าหนังสือไม่ได้ถูกยืม หรือสมาชิกจองอยู่แล้ว
   */
  reserve(bookId: string, memberId: string): Book {
    const book = this.findOne(bookId);
    const member = this.membersService.findOne(memberId);

    if (
      book.status !== BookStatus.BORROWED &&
      book.status !== BookStatus.RESERVED
    ) {
      throw new BadRequestException(
        `Book "${book.title}" is currently available — no need to reserve, borrow it directly.`,
      );
    }

    if (book.currentBorrowerId === memberId) {
      throw new BadRequestException(
        `Member "${member.firstName} ${member.lastName}" is already borrowing this book.`,
      );
    }

    if (book.reservedBy.includes(memberId)) {
      throw new BadRequestException(
        `Member "${member.firstName} ${member.lastName}" has already reserved this book.`,
      );
    }

    if (member.status !== MemberStatus.ACTIVE) {
      throw new BadRequestException(
        `Member "${member.firstName} ${member.lastName}" is not active (status: ${member.status}).`,
      );
    }

    const bookIndex = this.books.findIndex((b) => b.id === bookId);
    this.books[bookIndex] = {
      ...book,
      reservedBy: [...book.reservedBy, memberId],
      updatedAt: new Date().toISOString(),
    };
    return this.books[bookIndex];
  }

  /**
   * ดึงสถิติหนังสือ
   */
  getStats() {
    const totalBooks = this.books.length;
    const available = this.books.filter(
      (b) => b.status === BookStatus.AVAILABLE,
    ).length;
    const borrowed = this.books.filter(
      (b) => b.status === BookStatus.BORROWED,
    ).length;

    // Group by category
    const byCategory: Record<string, number> = {};
    Object.values(BookCategory).forEach((cat) => {
      byCategory[cat as string] = this.books.filter(
        (b) => b.category === cat,
      ).length;
    });

    return {
      totalBooks,
      available,
      borrowed,
      byCategory,
    };
  }

  /**
   * Reset data to default seed
   */
  reset(): void {
    this.books = [...bookSeeds];
  }
}
