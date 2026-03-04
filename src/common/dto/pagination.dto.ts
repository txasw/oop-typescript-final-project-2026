import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsInt, Min, Max, IsString } from "class-validator";
import { Type } from "class-transformer";

/**
 * DTO สำหรับ Pagination query parameters
 * ใช้ร่วมกับ GET endpoints ทั้งหมด
 */
export class PaginationDto {
  @ApiPropertyOptional({
    description: "หมายเลขหน้า",
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
    description: "จำนวนรายการต่อหน้า",
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
    description: "คำค้นหา (ค้นจากทุก field ที่เป็น string)",
    example: "TypeScript",
  })
  @IsOptional()
  @IsString()
  search?: string;
}
