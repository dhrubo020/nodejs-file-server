import { HttpException, HttpStatus } from '@nestjs/common';

export interface APIError {
  message: string;
  code: string;
  errors?: ErrorDetails[];
  stack?: string;
}

interface ErrorDetails {
  message: string;
  code?: string;
}

export class APIException extends HttpException {
  public httpStatus: number;
  public code: string;
  public errors: ErrorDetails[];

  constructor(
    message: string,
    code: string,
    httpStatus?: number,
    errors?: ErrorDetails[],
  ) {
    // Calling parent constructor of base Exception class.
    super(message, httpStatus);
    this.name = APIException.name;
    this.httpStatus = httpStatus || HttpStatus.INTERNAL_SERVER_ERROR;
    this.code = code;
    this.errors = errors;
  }
}
