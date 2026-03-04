import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { ApiResponse } from "../interfaces/api-response.interface";

/**
 * Global HTTP Exception Filter
 * จัดการ error response ให้เป็น format เดียวกันทั้งระบบ
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        if (typeof responseObj["message"] === "string") {
          message = responseObj["message"];
        } else if (Array.isArray(responseObj["message"])) {
          message = (responseObj["message"] as string[]).join(", ");
        }
      }
    }

    const errorResponse: ApiResponse<null> = {
      success: false,
      message,
      data: null,
    };

    response.status(status).json(errorResponse);
  }
}
