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
 * BooksController — Manage endpoints for book data
 */
@ApiTags("books")
@Controller("books")
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  /**
   * GET /books — Retrieve all books (supports search, filter, pagination)
   */
  @Get()
  @ApiOperation({
    summary: "Retrieve all books (supports search, filter, pagination)",
  })
  @SwaggerResponse({ status: 200, description: "Success" })
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
   * GET /books/stats — Retrieve book statistics
   */
  @Get("stats")
  @ApiOperation({ summary: "Retrieve book statistics" })
  @SwaggerResponse({ status: 200, description: "Success" })
  getStats(): ApiResponse<Record<string, unknown>> {
    const stats = this.booksService.getStats();
    return {
      success: true,
      message: "Book statistics retrieved successfully",
      data: stats,
    };
  }

  /**
   * GET /books/:id — Retrieve a book by ID
   */
  @Get(":id")
  @ApiOperation({ summary: "Retrieve a book by ID" })
  @ApiParam({ name: "id", description: "Book UUID" })
  @SwaggerResponse({ status: 200, description: "Success" })
  @SwaggerResponse({ status: 404, description: "Book not found" })
  findOne(@Param("id") id: string): ApiResponse<Book> {
    const book = this.booksService.findOne(id);
    return {
      success: true,
      message: "Book retrieved successfully",
      data: book,
    };
  }

  /**
   * POST /books — Create a new book
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new book" })
  @SwaggerResponse({ status: 201, description: "Successfully created book" })
  @SwaggerResponse({ status: 400, description: "Invalid data" })
  create(@Body() createBookDto: CreateBookDto): ApiResponse<Book> {
    const book = this.booksService.create(createBookDto);
    return {
      success: true,
      message: "Book created successfully",
      data: book,
    };
  }

  /**
   * PUT /books/:id — Update all book information
   */
  @Put(":id")
  @ApiOperation({ summary: "Update all book information (full update)" })
  @ApiParam({ name: "id", description: "Book UUID" })
  @SwaggerResponse({ status: 200, description: "Successfully updated" })
  @SwaggerResponse({ status: 400, description: "Invalid data" })
  @SwaggerResponse({ status: 404, description: "Book not found" })
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
   * PATCH /books/:id — Update partial book information
   */
  @Patch(":id")
  @ApiOperation({ summary: "Update partial book information (partial update)" })
  @ApiParam({ name: "id", description: "Book UUID" })
  @SwaggerResponse({ status: 200, description: "Successfully updated" })
  @SwaggerResponse({ status: 400, description: "Invalid data" })
  @SwaggerResponse({ status: 404, description: "Book not found" })
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
   * DELETE /books/:id — Delete a book
   */
  @Delete(":id")
  @ApiOperation({ summary: "Delete a book by ID" })
  @ApiParam({ name: "id", description: "Book UUID" })
  @SwaggerResponse({ status: 200, description: "Successfully deleted" })
  @SwaggerResponse({ status: 404, description: "Book not found" })
  remove(@Param("id") id: string): ApiResponse<Book> {
    const book = this.booksService.remove(id);
    return {
      success: true,
      message: "Book deleted successfully",
      data: book,
    };
  }

  /**
   * POST /books/:id/borrow — Borrow a book
   */
  @Post(":id/borrow")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Borrow a book" })
  @ApiParam({ name: "id", description: "Book UUID" })
  @SwaggerResponse({ status: 200, description: "Successfully borrowed book" })
  @SwaggerResponse({ status: 400, description: "Book not available for loan" })
  @SwaggerResponse({ status: 404, description: "Book or member not found" })
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
   * POST /books/:id/return — Return a book
   */
  @Post(":id/return")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Return a book" })
  @ApiParam({ name: "id", description: "Book UUID" })
  @SwaggerResponse({ status: 200, description: "Successfully returned book" })
  @SwaggerResponse({ status: 400, description: "Book is not borrowed" })
  @SwaggerResponse({ status: 404, description: "Book not found" })
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
   * POST /books/:id/reserve — Reserve a book into queue
   */
  @Post(":id/reserve")
  @ApiOperation({
    summary: "Reserve a book into queue (must be borrowed)",
  })
  @ApiParam({ name: "id", description: "Book ID" })
  @SwaggerResponse({ status: 200, description: "Successfully reserved" })
  @SwaggerResponse({ status: 400, description: "Cannot reserve" })
  @SwaggerResponse({ status: 404, description: "Book not found" })
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
