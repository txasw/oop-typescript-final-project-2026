import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsEnum } from "class-validator";
import { MemberStatus } from "../../../common/enums/member-status.enum";

/**
 * DTO สำหรับ filter สมาชิก
 */
export class FilterMemberDto {
  @ApiPropertyOptional({
    description: "กรองตามสถานะสมาชิก",
    enum: MemberStatus,
  })
  @IsOptional()
  @IsEnum(MemberStatus)
  status?: MemberStatus;
}
