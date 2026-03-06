import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerResponse,
  ApiParam,
} from "@nestjs/swagger";
import { MembersService } from "./members.service";
import { CreateMemberDto } from "./dto/create-member.dto";
import { UpdateMemberDto } from "./dto/update-member.dto";
import { PatchMemberDto } from "./dto/patch-member.dto";
import { QueryMemberDto } from "./dto/query-member.dto";
import { ApiResponse } from "../../common/interfaces/api-response.interface";
import { PaginatedResponse } from "../../common/interfaces/paginated-response.interface";
import { Member } from "./interfaces/member.interface";

/**
 * MembersController — จัดการ endpoint สำหรับข้อมูลสมาชิก
 */
@ApiTags("members")
@Controller("members")
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  /**
   * GET /members — ดึงรายการสมาชิกทั้งหมด (รองรับ search, filter, pagination)
   */
  @Get()
  @ApiOperation({
    summary: "ดึงรายการสมาชิกทั้งหมด (รองรับ search, filter, pagination)",
  })
  @SwaggerResponse({ status: 200, description: "สำเร็จ" })
  findAll(
    @Query() queryDto: QueryMemberDto,
  ): ApiResponse<PaginatedResponse<Member>> {
    const result = this.membersService.findAll(queryDto, queryDto);
    return {
      success: true,
      message: "Members retrieved successfully",
      data: result,
    };
  }

  /**
   * GET /members/stats — ดึงสถิติสมาชิก
   */
  @Get("stats")
  @ApiOperation({ summary: "ดึงสถิติสมาชิก" })
  @SwaggerResponse({ status: 200, description: "สำเร็จ" })
  getStats(): ApiResponse<Record<string, unknown>> {
    const stats = this.membersService.getStats();
    return {
      success: true,
      message: "Member statistics retrieved successfully",
      data: stats,
    };
  }

  /**
   * GET /members/:id — ดึงสมาชิกตาม ID
   */
  @Get(":id")
  @ApiOperation({ summary: "ดึงสมาชิกตาม ID" })
  @ApiParam({ name: "id", description: "UUID ของสมาชิก" })
  @SwaggerResponse({ status: 200, description: "สำเร็จ" })
  @SwaggerResponse({ status: 404, description: "ไม่พบสมาชิก" })
  findOne(@Param("id") id: string): ApiResponse<Member> {
    const member = this.membersService.findOne(id);
    return {
      success: true,
      message: "Member retrieved successfully",
      data: member,
    };
  }

  /**
   * POST /members — สมัครสมาชิกใหม่
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "สมัครสมาชิกใหม่" })
  @SwaggerResponse({ status: 201, description: "สมัครสมาชิกสำเร็จ" })
  @SwaggerResponse({ status: 400, description: "ข้อมูลไม่ถูกต้อง" })
  create(@Body() createMemberDto: CreateMemberDto): ApiResponse<Member> {
    const member = this.membersService.create(createMemberDto);
    return {
      success: true,
      message: "Member created successfully",
      data: member,
    };
  }

  /**
   * PUT /members/:id — อัปเดตข้อมูลสมาชิกทั้งหมด
   */
  @Put(":id")
  @ApiOperation({ summary: "อัปเดตข้อมูลสมาชิกทั้งหมด (full update)" })
  @ApiParam({ name: "id", description: "UUID ของสมาชิก" })
  @SwaggerResponse({ status: 200, description: "อัปเดตสำเร็จ" })
  @SwaggerResponse({ status: 400, description: "ข้อมูลไม่ถูกต้อง" })
  @SwaggerResponse({ status: 404, description: "ไม่พบสมาชิก" })
  update(
    @Param("id") id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ): ApiResponse<Member> {
    const member = this.membersService.update(id, updateMemberDto);
    return {
      success: true,
      message: "Member updated successfully",
      data: member,
    };
  }

  /**
   * PATCH /members/:id — อัปเดตข้อมูลสมาชิกบางส่วน
   */
  @Patch(":id")
  @ApiOperation({ summary: "อัปเดตข้อมูลสมาชิกบางส่วน (partial update)" })
  @ApiParam({ name: "id", description: "UUID ของสมาชิก" })
  @SwaggerResponse({ status: 200, description: "อัปเดตสำเร็จ" })
  @SwaggerResponse({ status: 400, description: "ข้อมูลไม่ถูกต้อง" })
  @SwaggerResponse({ status: 404, description: "ไม่พบสมาชิก" })
  patch(
    @Param("id") id: string,
    @Body() patchMemberDto: PatchMemberDto,
  ): ApiResponse<Member> {
    const member = this.membersService.patch(id, patchMemberDto);
    return {
      success: true,
      message: "Member patched successfully",
      data: member,
    };
  }

  /**
   * DELETE /members/:id — ลบสมาชิก
   */
  @Delete(":id")
  @ApiOperation({ summary: "ลบสมาชิกตาม ID" })
  @ApiParam({ name: "id", description: "UUID ของสมาชิก" })
  @SwaggerResponse({ status: 200, description: "ลบสำเร็จ" })
  @SwaggerResponse({ status: 404, description: "ไม่พบสมาชิก" })
  remove(@Param("id") id: string): ApiResponse<Member> {
    const member = this.membersService.remove(id);
    return {
      success: true,
      message: "Member deleted successfully",
      data: member,
    };
  }
}
