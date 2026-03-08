import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
  Max,
} from "class-validator";
import { MemberStatus } from "../../../common/enums/member-status.enum";

/**
 * DTO for partial member update (PATCH /members/:id)
 * All fields are optional
 */
export class PatchMemberDto {
  @ApiPropertyOptional({ description: "First Name", example: "สมชาย" })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ description: "Last Name", example: "ใจดี" })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ description: "Email", example: "somchai@example.com" })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: "Phone Number",
    example: "081-234-5678",
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: "Address",
    example: "123 ถ.สุขุมวิท กรุงเทพฯ 10110",
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: "Member Status",
    enum: MemberStatus,
    example: MemberStatus.ACTIVE,
  })
  @IsEnum(MemberStatus)
  @IsOptional()
  status?: MemberStatus;

  @ApiPropertyOptional({
    description: "Maximum books allowed",
    example: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(20)
  @IsOptional()
  maxBooksAllowed?: number;
}
