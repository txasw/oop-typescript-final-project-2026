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
 * DTO สำหรับอัปเดตข้อมูลสมาชิกบางส่วน (PATCH /members/:id)
 * ทุก field เป็น optional
 */
export class PatchMemberDto {
  @ApiPropertyOptional({ description: "ชื่อ", example: "สมชาย" })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ description: "นามสกุล", example: "ใจดี" })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ description: "อีเมล", example: "somchai@example.com" })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: "เบอร์โทรศัพท์",
    example: "081-234-5678",
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: "ที่อยู่",
    example: "123 ถ.สุขุมวิท กรุงเทพฯ 10110",
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: "สถานะสมาชิก",
    enum: MemberStatus,
    example: MemberStatus.ACTIVE,
  })
  @IsEnum(MemberStatus)
  @IsOptional()
  status?: MemberStatus;

  @ApiPropertyOptional({
    description: "จำนวนหนังสือสูงสุดที่ยืมได้",
    example: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(20)
  @IsOptional()
  maxBooksAllowed?: number;
}
