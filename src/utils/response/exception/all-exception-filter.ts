import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { coreConfig } from 'config';
import { Response } from 'express';
import { APIError, APIException } from './api.exception';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  private isProduction: boolean = coreConfig.env === 'PRODUCTION';

  catch(exception: T, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const res: Response = ctx.getResponse<Response>();
    let error: APIError;
    let status: HttpStatus;
    if (exception instanceof APIException) {
      // application specific errors
      error = this.formatAPIException(exception, this.isProduction);
      status = exception.httpStatus;
    } else if (exception instanceof Error) {
      // unknown internal error
      error = this.formatUnknownError(exception, this.isProduction);
    }
    res.status(status || HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
  }

  formatAPIException(exception: APIException, isProduction: boolean): APIError {
    return {
      message: exception.message,
      code: exception.code,
      ...(exception.errors && { errors: exception.errors }),
      ...(!isProduction && { stack: exception.stack }),
    };
  }

  formatUnknownError(exception: Error, isProduction: boolean): APIError {
    return {
      message: exception?.message || 'Internal Server Error',
      code: 'INTERNAL_ERROR',
      ...(!isProduction && exception.stack && { stack: exception.stack }),
    };
  }
}
