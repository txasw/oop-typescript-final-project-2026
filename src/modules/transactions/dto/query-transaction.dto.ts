import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "../../../common/dto/pagination.dto";

export class QueryTransactionDto extends PaginationDto {
  @ApiPropertyOptional({ description: "กรองตาม Book ID" })
  @IsOptional()
  @IsString()
  bookId?: string;

  @ApiPropertyOptional({ description: "กรองตาม Member ID" })
  @IsOptional()
  @IsString()
  memberId?: string;
}
