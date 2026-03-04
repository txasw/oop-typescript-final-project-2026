import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsBoolean,
  Min,
  Max,
} from "class-validator";
import { BookStatus } from "../../../common/enums/book-status.enum";
import { BookCategory } from "../../../common/enums/book-category.enum";

/**
 * DTO สำหรับอัปเดตข้อมูลหนังสือทั้งหมด (PUT /books/:id)
 * ทุก field บังคับกรอก
 */
export class UpdateBookDto {
  @ApiProperty({ description: "รหัส ISBN", example: "978-616-123-456-7" })
  @IsString()
  @IsNotEmpty()
  isbn!: string;

  @ApiProperty({
    description: "ชื่อหนังสือ",
    example: "TypeScript Design Patterns",
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: "ผู้แต่ง", example: "John Doe" })
  @IsString()
  @IsNotEmpty()
  author!: string;

  @ApiProperty({ description: "สำนักพิมพ์", example: "Tech Publishing" })
  @IsString()
  @IsNotEmpty()
  publisher!: string;

  @ApiProperty({
    description: "ปีที่พิมพ์",
    example: 2024,
    minimum: 1000,
    maximum: 2100,
  })
  @IsNumber()
  @Min(1000)
  @Max(2100)
  publishedYear!: number;

  @ApiProperty({
    description: "หมวดหมู่",
    enum: BookCategory,
    example: BookCategory.TECHNOLOGY,
  })
  @IsEnum(BookCategory)
  category!: BookCategory;

  @ApiProperty({
    description: "รายละเอียด / เรื่องย่อ",
    example: "A comprehensive guide to design patterns in TypeScript",
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    description: "สถานะของหนังสือ",
    enum: BookStatus,
    example: BookStatus.AVAILABLE,
  })
  @IsEnum(BookStatus)
  status!: BookStatus;

  @ApiProperty({ description: "อนุญาตให้ยืมได้หรือไม่", example: true })
  @IsBoolean()
  isAvailableForLoan!: boolean;
}
