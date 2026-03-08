import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsInt, Min, Max, IsString } from "class-validator";
import { Type } from "class-transformer";

/**
 * DTO for Pagination query parameters
 * Used with all GET endpoints
 */
export class PaginationDto {
  @ApiPropertyOptional({
    description: "Page number",
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: "Number of items per page",
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: "Search keyword (searches all string fields)",
    example: "TypeScript",
  })
  @IsOptional()
  @IsString()
  search?: string;
}
