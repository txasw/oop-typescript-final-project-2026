import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("health")
@Controller("health")
export class HealthController {
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Check API Server status" })
  @ApiResponse({ status: 200, description: "API is running normally" })
  check() {
    return {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      message: "Library Management System API is running smoothly.",
    };
  }
}
