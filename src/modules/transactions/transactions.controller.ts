import { Controller, Get, Query } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerResponse,
  ApiQuery,
} from "@nestjs/swagger";
import { TransactionsService } from "./transactions.service";
import { ApiResponse } from "../../common/interfaces/api-response.interface";
import { PaginatedResponse } from "../../common/interfaces/paginated-response.interface";
import { Transaction } from "./interfaces/transaction.interface";
import { PaginationDto } from "../../common/dto/pagination.dto";

@ApiTags("transactions")
@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * GET /transactions — ดึงประวัติการยืม-คืนทั้งหมด (รองรับ filter ตาม bookId/memberId)
   */
  @Get()
  @ApiOperation({
    summary: "ดึงประวัติการยืม-คืนทั้งหมด (รองรับ filter ตาม bookId/memberId)",
  })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({
    name: "bookId",
    required: false,
    type: String,
    description: "กรองตาม Book ID",
  })
  @ApiQuery({
    name: "memberId",
    required: false,
    type: String,
    description: "กรองตาม Member ID",
  })
  @SwaggerResponse({ status: 200, description: "สำเร็จ" })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query("bookId") bookId?: string,
    @Query("memberId") memberId?: string,
  ): ApiResponse<PaginatedResponse<Transaction>> {
    const result = this.transactionsService.findAll(paginationDto, {
      bookId,
      memberId,
    });
    return {
      success: true,
      message: "Transactions retrieved successfully",
      data: result,
    };
  }
}
