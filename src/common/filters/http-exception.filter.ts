import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ValidationError,
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
    let details: Array<{ field: string }> | undefined;

    if (exception instanceof HttpException) {
      code = exception.name;
      const res = exception.getResponse();

      if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, any>;

        if (Array.isArray(resObj.message)) {
          code = 'VALIDATION_ERROR';
          message = 'El recurso contiene datos inválidos.';
          details = this.getValidationDetails(resObj.message);
        } else if (resObj.error && typeof resObj.error === 'object') {
          const errorPayload = resObj.error as Record<string, any>;
          code = errorPayload.code || code;
          message = errorPayload.message || message;
          details = errorPayload.details;
        } else {
          message = resObj.message || exception.message;
        }
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const error: Record<string, unknown> = {
      code,
      message,
    };

    if (details) {
      error.details = details;
    }

    response.status(status).json({ error });
  }

  private getValidationDetails(message: unknown[]): Array<{ field: string }> | undefined {
    const fields = message
      .map((item) => {
        if (typeof item === 'string') {
          return item.split(' ')[0];
        }

        if (this.isValidationError(item)) {
          return item.property;
        }

        return undefined;
      })
      .filter((field): field is string => Boolean(field));

    const uniqueFields = [...new Set(fields)];

    if (uniqueFields.length === 0) {
      return undefined;
    }

    return uniqueFields.map((field) => ({ field }));
  }

  private isValidationError(value: unknown): value is ValidationError {
    return (
      typeof value === 'object' &&
      value !== null &&
      'property' in value &&
      typeof (value as ValidationError).property === 'string'
    );
  }
}
