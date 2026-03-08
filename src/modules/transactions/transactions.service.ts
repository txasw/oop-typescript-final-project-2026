import { Injectable } from "@nestjs/common";
import { Transaction } from "./interfaces/transaction.interface";
import { generateId } from "../../common/utils/generate-id.util";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { PaginatedResponse } from "../../common/interfaces/paginated-response.interface";

@Injectable()
export class TransactionsService {
  private transactions: Transaction[] = [];

  /**
   * Record a new Transaction
   */
  record(data: Omit<Transaction, "id" | "createdAt">): Transaction {
    const transaction: Transaction = {
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.transactions.push(transaction);
    return transaction;
  }

  /**
   * Retrieve all Transactions with optional filter by bookId/memberId
   */
  findAll(
    paginationDto: PaginationDto,
    filters: { bookId?: string; memberId?: string },
  ): PaginatedResponse<Transaction> {
    let filtered = [...this.transactions];

    if (filters.bookId) {
      filtered = filtered.filter((t) => t.bookId === filters.bookId);
    }
    if (filters.memberId) {
      filtered = filtered.filter((t) => t.memberId === filters.memberId);
    }

    // Sort by newest first
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit);
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return {
      items,
      meta: {
        totalItems,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  /**
   * Reset data to default seed
   */
  reset(): void {
    this.transactions = [];
  }
}
