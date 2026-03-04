import { Module } from "@nestjs/common";
import { BooksModule } from "./modules/books/books.module";
import { MembersModule } from "./modules/members/members.module";

@Module({
  imports: [BooksModule, MembersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
