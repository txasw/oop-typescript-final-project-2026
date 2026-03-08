import { ApiProperty } from "@nestjs/swagger";
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
 * DTO for registering a new member (POST /members)
 */
export class CreateMemberDto {
  @ApiProperty({ description: "First Name", example: "Somchai" })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ description: "Last Name", example: "Jaidee" })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ description: "Email", example: "somchai@example.com" })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: "Phone Number", example: "081-234-5678" })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({
    description: "Address",
    example: "123 Sukhumvit Rd., Bangkok 10110",
  })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({
    description: "Member Status",
    enum: MemberStatus,
    example: MemberStatus.ACTIVE,
    required: false,
    default: MemberStatus.ACTIVE,
  })
  @IsEnum(MemberStatus)
  @IsOptional()
  status?: MemberStatus;

  @ApiProperty({
    description: "Maximum books allowed",
    example: 5,
    required: false,
    default: 5,
    minimum: 1,
    maximum: 20,
  })
  @IsNumber()
  @Min(1)
  @Max(20)
  @IsOptional()
  maxBooksAllowed?: number;
}
