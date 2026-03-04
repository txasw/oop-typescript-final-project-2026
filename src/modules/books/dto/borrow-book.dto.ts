import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

/**
 * DTO สำหรับยืมหนังสือ (POST /books/:id/borrow)
 */
export class BorrowBookDto {
  @ApiProperty({
    description: "UUID ของสมาชิกที่ต้องการยืม",
    example: "uuid-of-member",
  })
  @IsString()
  @IsNotEmpty()
  memberId!: string;
}
