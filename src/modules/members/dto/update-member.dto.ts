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
 * DTO for full member update (PUT /members/:id)
 * All fields are required
 */
export class UpdateMemberDto {
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
  })
  @IsEnum(MemberStatus)
  status!: MemberStatus;

  @ApiProperty({
    description: "Maximum books allowed",
    example: 5,
    minimum: 1,
    maximum: 20,
  })
  @IsNumber()
  @Min(1)
  @Max(20)
  maxBooksAllowed!: number;
}
