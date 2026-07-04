import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      code = exception.name;
      const res = exception.getResponse();

      if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, any>;

        if (status === HttpStatus.BAD_REQUEST && Array.isArray(resObj.message)) {
          code = 'VALIDATION_ERROR';
          message = 'El recurso contiene datos inválidos.';
        } else if (resObj.error && typeof resObj.error === 'object') {
          const errorPayload = resObj.error as Record<string, any>;
          code = errorPayload.code || code;
          message = errorPayload.message || message;
        } else {
          message = resObj.message || exception.message;
        }
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      error: {
        code,
        message,
      },
    });
  }
}
