import { Controller, Post } from "@nestjs/common";
import { BooksService } from "./modules/books/books.service";
import { MembersService } from "./modules/members/members.service";
import { TransactionsService } from "./modules/transactions/transactions.service";

@Controller()
export class AppController {
  constructor(
    private readonly booksService: BooksService,
    private readonly membersService: MembersService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @Post("reset")
  resetDatabase() {
    this.booksService.reset();
    this.membersService.reset();
    this.transactionsService.reset();
    return { success: true, message: "Database reset to default seed data" };
  }
}
