import { Module } from "@nestjs/common";
import { BooksModule } from "./modules/books/books.module";
import { MembersModule } from "./modules/members/members.module";
import { HealthModule } from "./modules/health/health.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";

@Module({
  imports: [BooksModule, MembersModule, HealthModule, TransactionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
