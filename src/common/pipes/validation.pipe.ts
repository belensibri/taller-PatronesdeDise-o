import { HttpStatus, ValidationPipe } from '@nestjs/common';

export const createValidationPipe = () =>
  new ValidationPipe({
    whitelist: true,
    transform: true,
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  });
