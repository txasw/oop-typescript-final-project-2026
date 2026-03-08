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
 * DTO for partial book update (PATCH /books/:id)
 * All fields are optional
 */
export class PatchBookDto {
  @ApiPropertyOptional({
    description: "ISBN Code",
    example: "978-616-123-456-7",
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  isbn?: string;

  @ApiPropertyOptional({
    description: "Book Title",
    example: "TypeScript Design Patterns",
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: "Author", example: "John Doe" })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  author?: string;

  @ApiPropertyOptional({
    description: "Publisher",
    example: "Tech Publishing",
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  publisher?: string;

  @ApiPropertyOptional({ description: "Published Year", example: 2024 })
  @IsNumber()
  @Min(1000)
  @Max(2100)
  @IsOptional()
  publishedYear?: number;

  @ApiPropertyOptional({
    description: "Category",
    enum: BookCategory,
    example: BookCategory.TECHNOLOGY,
  })
  @IsEnum(BookCategory)
  @IsOptional()
  category?: BookCategory;

  @ApiPropertyOptional({
    description: "Description / Synopsis",
    example: "Updated description",
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: "Book status",
    enum: BookStatus,
    example: BookStatus.AVAILABLE,
  })
  @IsEnum(BookStatus)
  @IsOptional()
  status?: BookStatus;

  @ApiPropertyOptional({ description: "Available for loan", example: true })
  @IsBoolean()
  @IsOptional()
  isAvailableForLoan?: boolean;
}
