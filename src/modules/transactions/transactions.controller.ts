import { Controller, Get, Query } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerResponse,
} from "@nestjs/swagger";
import { TransactionsService } from "./transactions.service";
import { ApiResponse } from "../../common/interfaces/api-response.interface";
import { PaginatedResponse } from "../../common/interfaces/paginated-response.interface";
import { Transaction } from "./interfaces/transaction.interface";
import { QueryTransactionDto } from "./dto/query-transaction.dto";

@ApiTags("transactions")
@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * GET /transactions — Retrieve all borrow-return history (supports filter by bookId/memberId)
   */
  @Get()
  @ApiOperation({
    summary: "Retrieve all borrow-return history (supports filter by bookId/memberId)",
  })
  @SwaggerResponse({ status: 200, description: "Success" })
  findAll(
    @Query() queryDto: QueryTransactionDto,
  ): ApiResponse<PaginatedResponse<Transaction>> {
    const result = this.transactionsService.findAll(queryDto, {
      bookId: queryDto.bookId,
      memberId: queryDto.memberId,
    });
    return {
      success: true,
      message: "Transactions retrieved successfully",
      data: result,
    };
  }
}
