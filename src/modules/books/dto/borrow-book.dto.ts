import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

/**
 * DTO for borrowing a book (POST /books/:id/borrow)
 */
export class BorrowBookDto {
  @ApiProperty({
    description: "UUID of borrowing member",
    example: "uuid-of-member",
  })
  @IsString()
  @IsNotEmpty()
  memberId!: string;
}
