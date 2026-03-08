import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsEnum } from "class-validator";
import { BookStatus } from "../../../common/enums/book-status.enum";
import { BookCategory } from "../../../common/enums/book-category.enum";

/**
 * DTO for filtering books
 */
export class FilterBookDto {
  @ApiPropertyOptional({ description: "กรองตามCategory", enum: BookCategory })
  @IsOptional()
  @IsEnum(BookCategory)
  category?: BookCategory;

  @ApiPropertyOptional({ description: "Filter by status", enum: BookStatus })
  @IsOptional()
  @IsEnum(BookStatus)
  status?: BookStatus;
}
