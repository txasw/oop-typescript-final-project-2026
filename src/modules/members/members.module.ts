import { Module, forwardRef } from "@nestjs/common";
import { MembersController } from "./members.controller";
import { MembersService } from "./members.service";
import { BooksModule } from "../books/books.module";

/**
 * MembersModule — Manages dependency injection for Member feature
 */
@Module({
  imports: [forwardRef(() => BooksModule)],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}
