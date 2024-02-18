export interface IServiceSuccessResponse<T> {
  /** Response object from service layer */
  success: boolean;
  data: T;
}

export type IServiceResponse<T> = IServiceSuccessResponse<T>;
