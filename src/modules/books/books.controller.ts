import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
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
import { ApiResponse } from "../../common/interfaces/api-response.interface";
import { Book } from "./interfaces/book.interface";

/**
 * BooksController — จัดการ endpoint สำหรับข้อมูลหนังสือ
 */
@ApiTags("books")
@Controller("books")
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  /**
   * GET /books — ดึงรายการหนังสือทั้งหมด
   */
  @Get()
  @ApiOperation({ summary: "ดึงรายการหนังสือทั้งหมด" })
  @SwaggerResponse({ status: 200, description: "สำเร็จ" })
  findAll(): ApiResponse<Book[]> {
    const books = this.booksService.findAll();
    return {
      success: true,
      message: "Books retrieved successfully",
      data: books,
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
}
