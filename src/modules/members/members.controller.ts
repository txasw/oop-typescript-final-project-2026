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
 * MembersController — Manages member endpoints
 */
@ApiTags("members")
@Controller("members")
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  /**
   * GET /members — Retrieve all members (supports search, filter, pagination)
   */
  @Get()
  @ApiOperation({
    summary: "Retrieve all members (supports search, filter, pagination)",
  })
  @SwaggerResponse({ status: 200, description: "Success" })
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
   * GET /members/stats — Retrieve member statistics
   */
  @Get("stats")
  @ApiOperation({ summary: "Retrieve member statistics" })
  @SwaggerResponse({ status: 200, description: "Success" })
  getStats(): ApiResponse<Record<string, unknown>> {
    const stats = this.membersService.getStats();
    return {
      success: true,
      message: "Member statistics retrieved successfully",
      data: stats,
    };
  }

  /**
   * GET /members/:id — Retrieve member by ID
   */
  @Get(":id")
  @ApiOperation({ summary: "Retrieve member by ID" })
  @ApiParam({ name: "id", description: "Member UUID" })
  @SwaggerResponse({ status: 200, description: "Success" })
  @SwaggerResponse({ status: 404, description: "Member not found" })
  findOne(@Param("id") id: string): ApiResponse<Member> {
    const member = this.membersService.findOne(id);
    return {
      success: true,
      message: "Member retrieved successfully",
      data: member,
    };
  }

  /**
   * POST /members — Register a new member
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register a new member" })
  @SwaggerResponse({ status: 201, description: "Successfully registered member" })
  @SwaggerResponse({ status: 400, description: "Invalid data" })
  create(@Body() createMemberDto: CreateMemberDto): ApiResponse<Member> {
    const member = this.membersService.create(createMemberDto);
    return {
      success: true,
      message: "Member created successfully",
      data: member,
    };
  }

  /**
   * PUT /members/:id — Update all member info
   */
  @Put(":id")
  @ApiOperation({ summary: "Update all member info (full update)" })
  @ApiParam({ name: "id", description: "Member UUID" })
  @SwaggerResponse({ status: 200, description: "Successfully updated" })
  @SwaggerResponse({ status: 400, description: "Invalid data" })
  @SwaggerResponse({ status: 404, description: "Member not found" })
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
   * PATCH /members/:id — Update partial member info
   */
  @Patch(":id")
  @ApiOperation({ summary: "Update partial member info (partial update)" })
  @ApiParam({ name: "id", description: "Member UUID" })
  @SwaggerResponse({ status: 200, description: "Successfully updated" })
  @SwaggerResponse({ status: 400, description: "Invalid data" })
  @SwaggerResponse({ status: 404, description: "Member not found" })
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
   * DELETE /members/:id — Delete a member
   */
  @Delete(":id")
  @ApiOperation({ summary: "Delete member by ID" })
  @ApiParam({ name: "id", description: "Member UUID" })
  @SwaggerResponse({ status: 200, description: "Successfully deleted" })
  @SwaggerResponse({ status: 404, description: "Member not found" })
  remove(@Param("id") id: string): ApiResponse<Member> {
    const member = this.membersService.remove(id);
    return {
      success: true,
      message: "Member deleted successfully",
      data: member,
    };
  }
}
