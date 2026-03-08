import { ApiProperty } from "@nestjs/swagger";
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
 * DTO for creating a new book (POST /books)
 */
export class CreateBookDto {
  @ApiProperty({ description: "ISBN Code", example: "978-616-123-456-7" })
  @IsString()
  @IsNotEmpty()
  isbn!: string;

  @ApiProperty({
    description: "Book Title",
    example: "TypeScript Design Patterns",
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: "Author", example: "John Doe" })
  @IsString()
  @IsNotEmpty()
  author!: string;

  @ApiProperty({ description: "Publisher", example: "Tech Publishing" })
  @IsString()
  @IsNotEmpty()
  publisher!: string;

  @ApiProperty({
    description: "Published Year",
    example: 2024,
    minimum: 1000,
    maximum: 2100,
  })
  @IsNumber()
  @Min(1000)
  @Max(2100)
  publishedYear!: number;

  @ApiProperty({
    description: "Category",
    enum: BookCategory,
    example: BookCategory.TECHNOLOGY,
  })
  @IsEnum(BookCategory)
  category!: BookCategory;

  @ApiProperty({
    description: "Description / Synopsis",
    example: "A comprehensive guide to design patterns in TypeScript",
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    description: "Book status",
    enum: BookStatus,
    example: BookStatus.AVAILABLE,
    required: false,
    default: BookStatus.AVAILABLE,
  })
  @IsEnum(BookStatus)
  @IsOptional()
  status?: BookStatus;

  @ApiProperty({
    description: "Available for loan",
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isAvailableForLoan?: boolean;
}
