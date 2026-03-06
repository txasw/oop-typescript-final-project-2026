import { Module, forwardRef } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";
import { BooksModule } from "../books/books.module";

@Module({
  imports: [forwardRef(() => BooksModule)],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
