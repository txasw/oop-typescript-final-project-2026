import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsOptional,
  Min,
  Max,
} from "class-validator";
import { BookStatus } from "../../../common/enums/book-status.enum";
import { BookCategory } from "../../../common/enums/book-category.enum";

/**
 * DTO สำหรับอัปเดตข้อมูลหนังสือบางส่วน (PATCH /books/:id)
 * ทุก field เป็น optional
 */
export class PatchBookDto {
  @ApiPropertyOptional({
    description: "รหัส ISBN",
    example: "978-616-123-456-7",
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  isbn?: string;

  @ApiPropertyOptional({
    description: "ชื่อหนังสือ",
    example: "TypeScript Design Patterns",
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: "ผู้แต่ง", example: "John Doe" })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  author?: string;

  @ApiPropertyOptional({
    description: "สำนักพิมพ์",
    example: "Tech Publishing",
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  publisher?: string;

  @ApiPropertyOptional({ description: "ปีที่พิมพ์", example: 2024 })
  @IsNumber()
  @Min(1000)
  @Max(2100)
  @IsOptional()
  publishedYear?: number;

  @ApiPropertyOptional({
    description: "หมวดหมู่",
    enum: BookCategory,
    example: BookCategory.TECHNOLOGY,
  })
  @IsEnum(BookCategory)
  @IsOptional()
  category?: BookCategory;

  @ApiPropertyOptional({
    description: "รายละเอียด / เรื่องย่อ",
    example: "Updated description",
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: "สถานะของหนังสือ",
    enum: BookStatus,
    example: BookStatus.AVAILABLE,
  })
  @IsEnum(BookStatus)
  @IsOptional()
  status?: BookStatus;

  @ApiPropertyOptional({ description: "อนุญาตให้ยืมได้หรือไม่", example: true })
  @IsBoolean()
  @IsOptional()
  isAvailableForLoan?: boolean;
}
