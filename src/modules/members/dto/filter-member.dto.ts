import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsEnum } from "class-validator";
import { MemberStatus } from "../../../common/enums/member-status.enum";

/**
 * DTO for filtering members
 */
export class FilterMemberDto {
  @ApiPropertyOptional({
    description: "กรองตามMember Status",
    enum: MemberStatus,
  })
  @IsOptional()
  @IsEnum(MemberStatus)
  status?: MemberStatus;
}
