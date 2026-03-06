import { Module, forwardRef } from "@nestjs/common";
import { BooksController } from "./books.controller";
import { BooksService } from "./books.service";
import { MembersModule } from "../members/members.module";
import { TransactionsModule } from "../transactions/transactions.module";

/**
 * BooksModule — จัดการ dependency injection สำหรับ Book feature
 */
@Module({
  imports: [
    forwardRef(() => MembersModule),
    forwardRef(() => TransactionsModule),
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
