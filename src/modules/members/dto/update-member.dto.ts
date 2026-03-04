import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsEnum,
  Min,
  Max,
} from "class-validator";
import { MemberStatus } from "../../../common/enums/member-status.enum";

/**
 * DTO สำหรับอัปเดตข้อมูลสมาชิกทั้งหมด (PUT /members/:id)
 * ทุก field บังคับกรอก
 */
export class UpdateMemberDto {
  @ApiProperty({ description: "ชื่อ", example: "สมชาย" })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ description: "นามสกุล", example: "ใจดี" })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ description: "อีเมล", example: "somchai@example.com" })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: "เบอร์โทรศัพท์", example: "081-234-5678" })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({
    description: "ที่อยู่",
    example: "123 ถ.สุขุมวิท กรุงเทพฯ 10110",
  })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({
    description: "สถานะสมาชิก",
    enum: MemberStatus,
    example: MemberStatus.ACTIVE,
  })
  @IsEnum(MemberStatus)
  status!: MemberStatus;

  @ApiProperty({
    description: "จำนวนหนังสือสูงสุดที่ยืมได้",
    example: 5,
    minimum: 1,
    maximum: 20,
  })
  @IsNumber()
  @Min(1)
  @Max(20)
  maxBooksAllowed!: number;
}
