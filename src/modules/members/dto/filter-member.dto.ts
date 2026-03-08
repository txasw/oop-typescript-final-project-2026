import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsEnum } from "class-validator";
import { MemberStatus } from "../../../common/enums/member-status.enum";

/**
 * DTO for filtering members
 */
export class FilterMemberDto {
  @ApiPropertyOptional({
    description: "Filter by Member Status",
    enum: MemberStatus,
  })
  @IsOptional()
  @IsEnum(MemberStatus)
  status?: MemberStatus;
}
