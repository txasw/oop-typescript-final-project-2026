import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerResponse,
  ApiParam,
} from "@nestjs/swagger";
import { BooksService } from "./books.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { PatchBookDto } from "./dto/patch-book.dto";
import { QueryBookDto } from "./dto/query-book.dto";
import { BorrowBookDto } from "./dto/borrow-book.dto";
import { ApiResponse } from "../../common/interfaces/api-response.interface";
import { PaginatedResponse } from "../../common/interfaces/paginated-response.interface";
import { Book } from "./interfaces/book.interface";

/**
 * BooksController — จัดการ endpoint สำหรับข้อมูลหนังสือ
 */
@ApiTags("books")
@Controller("books")
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  /**
   * GET /books — ดึงรายการหนังสือทั้งหมด (รองรับ search, filter, pagination)
   */
  @Get()
  @ApiOperation({
    summary: "ดึงรายการหนังสือทั้งหมด (รองรับ search, filter, pagination)",
  })
  @SwaggerResponse({ status: 200, description: "สำเร็จ" })
  findAll(
    @Query() queryDto: QueryBookDto,
  ): ApiResponse<PaginatedResponse<Book>> {
    const result = this.booksService.findAll(queryDto, queryDto);
    return {
      success: true,
      message: "Books retrieved successfully",
      data: result,
    };
  }

  /**
   * GET /books/stats — ดึงสถิติหนังสือ
   */
  @Get("stats")
  @ApiOperation({ summary: "ดึงสถิติหนังสือ" })
  @SwaggerResponse({ status: 200, description: "สำเร็จ" })
  getStats(): ApiResponse<Record<string, unknown>> {
    const stats = this.booksService.getStats();
    return {
      success: true,
      message: "Book statistics retrieved successfully",
      data: stats,
    };
  }

  /**
   * GET /books/:id — ดึงหนังสือตาม ID
   */
  @Get(":id")
  @ApiOperation({ summary: "ดึงหนังสือตาม ID" })
  @ApiParam({ name: "id", description: "UUID ของหนังสือ" })
  @SwaggerResponse({ status: 200, description: "สำเร็จ" })
  @SwaggerResponse({ status: 404, description: "ไม่พบหนังสือ" })
  findOne(@Param("id") id: string): ApiResponse<Book> {
    const book = this.booksService.findOne(id);
    return {
      success: true,
      message: "Book retrieved successfully",
      data: book,
    };
  }

  /**
   * POST /books — สร้างหนังสือใหม่
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "สร้างหนังสือใหม่" })
  @SwaggerResponse({ status: 201, description: "สร้างหนังสือสำเร็จ" })
  @SwaggerResponse({ status: 400, description: "ข้อมูลไม่ถูกต้อง" })
  create(@Body() createBookDto: CreateBookDto): ApiResponse<Book> {
    const book = this.booksService.create(createBookDto);
    return {
      success: true,
      message: "Book created successfully",
      data: book,
    };
  }

  /**
   * PUT /books/:id — อัปเดตข้อมูลหนังสือทั้งหมด
   */
  @Put(":id")
  @ApiOperation({ summary: "อัปเดตข้อมูลหนังสือทั้งหมด (full update)" })
  @ApiParam({ name: "id", description: "UUID ของหนังสือ" })
  @SwaggerResponse({ status: 200, description: "อัปเดตสำเร็จ" })
  @SwaggerResponse({ status: 400, description: "ข้อมูลไม่ถูกต้อง" })
  @SwaggerResponse({ status: 404, description: "ไม่พบหนังสือ" })
  update(
    @Param("id") id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): ApiResponse<Book> {
    const book = this.booksService.update(id, updateBookDto);
    return {
      success: true,
      message: "Book updated successfully",
      data: book,
    };
  }

  /**
   * PATCH /books/:id — อัปเดตข้อมูลหนังสือบางส่วน
   */
  @Patch(":id")
  @ApiOperation({ summary: "อัปเดตข้อมูลหนังสือบางส่วน (partial update)" })
  @ApiParam({ name: "id", description: "UUID ของหนังสือ" })
  @SwaggerResponse({ status: 200, description: "อัปเดตสำเร็จ" })
  @SwaggerResponse({ status: 400, description: "ข้อมูลไม่ถูกต้อง" })
  @SwaggerResponse({ status: 404, description: "ไม่พบหนังสือ" })
  patch(
    @Param("id") id: string,
    @Body() patchBookDto: PatchBookDto,
  ): ApiResponse<Book> {
    const book = this.booksService.patch(id, patchBookDto);
    return {
      success: true,
      message: "Book patched successfully",
      data: book,
    };
  }

  /**
   * DELETE /books/:id — ลบหนังสือ
   */
  @Delete(":id")
  @ApiOperation({ summary: "ลบหนังสือตาม ID" })
  @ApiParam({ name: "id", description: "UUID ของหนังสือ" })
  @SwaggerResponse({ status: 200, description: "ลบสำเร็จ" })
  @SwaggerResponse({ status: 404, description: "ไม่พบหนังสือ" })
  remove(@Param("id") id: string): ApiResponse<Book> {
    const book = this.booksService.remove(id);
    return {
      success: true,
      message: "Book deleted successfully",
      data: book,
    };
  }

  /**
   * POST /books/:id/borrow — ยืมหนังสือ
   */
  @Post(":id/borrow")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "ยืมหนังสือ" })
  @ApiParam({ name: "id", description: "UUID ของหนังสือ" })
  @SwaggerResponse({ status: 200, description: "ยืมหนังสือสำเร็จ" })
  @SwaggerResponse({ status: 400, description: "หนังสือไม่พร้อมให้ยืม" })
  @SwaggerResponse({ status: 404, description: "ไม่พบหนังสือหรือสมาชิก" })
  borrow(
    @Param("id") id: string,
    @Body() borrowBookDto: BorrowBookDto,
  ): ApiResponse<Book> {
    const book = this.booksService.borrow(id, borrowBookDto.memberId);
    return {
      success: true,
      message: "Book borrowed successfully",
      data: book,
    };
  }

  /**
   * POST /books/:id/return — คืนหนังสือ
   */
  @Post(":id/return")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "คืนหนังสือ" })
  @ApiParam({ name: "id", description: "UUID ของหนังสือ" })
  @SwaggerResponse({ status: 200, description: "คืนหนังสือสำเร็จ" })
  @SwaggerResponse({ status: 400, description: "หนังสือไม่ได้ถูกยืม" })
  @SwaggerResponse({ status: 404, description: "ไม่พบหนังสือ" })
  returnBook(@Param("id") id: string): ApiResponse<Record<string, unknown>> {
    const result = this.booksService.returnBook(id);
    const message =
      result.fine > 0
        ? `Book returned successfully. Overdue by ${result.overdueDays} day(s). Fine: ${result.fine} THB.`
        : "Book returned successfully. No overdue fine.";
    return {
      success: true,
      message,
      data: result,
    };
  }

  /**
   * POST /books/:id/reserve — จองหนังสือเข้าคิวรอ
   */
  @Post(":id/reserve")
  @ApiOperation({
    summary: "จองหนังสือเข้าคิวรอ (ต้องเป็นหนังสือที่ถูกยืมอยู่)",
  })
  @ApiParam({ name: "id", description: "Book ID" })
  @SwaggerResponse({ status: 200, description: "จองสำเร็จ" })
  @SwaggerResponse({ status: 400, description: "ไม่สามารถจองได้" })
  @SwaggerResponse({ status: 404, description: "ไม่พบหนังสือ" })
  reserve(
    @Param("id") id: string,
    @Body() borrowBookDto: BorrowBookDto,
  ): ApiResponse<Book> {
    const book = this.booksService.reserve(id, borrowBookDto.memberId);
    return {
      success: true,
      message: `Book reserved successfully. Position in queue: ${book.reservedBy.length + 1}`,
      data: book,
    };
  }
}
