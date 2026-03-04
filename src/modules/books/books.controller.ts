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
  ApiQuery,
} from "@nestjs/swagger";
import { BooksService } from "./books.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { PatchBookDto } from "./dto/patch-book.dto";
import { FilterBookDto } from "./dto/filter-book.dto";
import { BorrowBookDto } from "./dto/borrow-book.dto";
import { ApiResponse } from "../../common/interfaces/api-response.interface";
import { PaginationDto } from "../../common/dto/pagination.dto";
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
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "หมายเลขหน้า",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "จำนวนรายการต่อหน้า",
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "คำค้นหา",
  })
  @ApiQuery({
    name: "category",
    required: false,
    description: "กรองตามหมวดหมู่",
  })
  @ApiQuery({ name: "status", required: false, description: "กรองตามสถานะ" })
  @SwaggerResponse({ status: 200, description: "สำเร็จ" })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterBookDto,
  ): ApiResponse<PaginatedResponse<Book>> {
    const result = this.booksService.findAll(paginationDto, filterDto);
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
  returnBook(@Param("id") id: string): ApiResponse<Book> {
    const book = this.booksService.returnBook(id);
    return {
      success: true,
      message: "Book returned successfully",
      data: book,
    };
  }
}
