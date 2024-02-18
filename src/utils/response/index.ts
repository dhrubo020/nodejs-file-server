import { HttpStatus } from '@nestjs/common';
import { from } from 'rxjs';
import { APIException } from './exception';
export interface IServiceSuccessResponse<T> {
  success: boolean;
  data: T;
}
export type IServiceResponse<T> = IServiceSuccessResponse<T>;
export function successResponse<T>(data: T): IServiceSuccessResponse<T> {
  return { success: true, data: data };
}

export function exception(msg: string, httpStatus?: HttpStatus) {
  const code = Object.keys(HttpStatus).find(
    (key) => HttpStatus[key] === httpStatus,
  );
  throw new APIException(msg, code, httpStatus);
}
export * from './exception';
