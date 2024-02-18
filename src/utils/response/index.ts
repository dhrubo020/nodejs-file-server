import { HttpStatus } from '@nestjs/common';
import { APIException } from './api.exception';
import { IServiceSuccessResponse } from './service.response.interface';

export function successResponse<T>(data: T): IServiceSuccessResponse<T> {
  return { success: true, data: data };
}

export function exception(msg: string, httpStatus?: HttpStatus) {
  const code = Object.keys(HttpStatus).find(
    (key) => HttpStatus[key] === httpStatus,
  );
  throw new APIException(msg, code, httpStatus);
}

export * from './service.response.interface';
