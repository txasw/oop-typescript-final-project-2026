import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { BooksModule } from "./modules/books/books.module";
import { MembersModule } from "./modules/members/members.module";
import { HealthModule } from "./modules/health/health.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
    }),
    BooksModule,
    MembersModule,
    HealthModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
