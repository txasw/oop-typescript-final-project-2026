import { Injectable, NotFoundException } from "@nestjs/common";
import { Book } from "./interfaces/book.interface";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { PatchBookDto } from "./dto/patch-book.dto";
import { BookStatus } from "../../common/enums/book-status.enum";
import { generateId } from "../../common/utils/generate-id.util";

/**
 * BooksService — จัดการข้อมูลหนังสือแบบ in-memory
 */
@Injectable()
export class BooksService {
  private books: Book[] = [];

  /**
   * ดึงรายการหนังสือทั้งหมด
   */
  findAll(): Book[] {
    return this.books;
  }

  /**
   * ดึงหนังสือตาม ID
   * @throws NotFoundException ถ้าไม่พบหนังสือ
   */
  findOne(id: string): Book {
    const book = this.books.find((b) => b.id === id);
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
    const bookIndex = this.books.findIndex((b) => b.id === id);
    if (bookIndex === -1) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }

    const deletedBook = this.books[bookIndex];
    this.books.splice(bookIndex, 1);
    return deletedBook;
  }
}
