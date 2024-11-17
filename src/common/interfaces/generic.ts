export type Dict<T = any> = { [key: string]: T };
export type NumDict<T = any> = { [key: number]: T };

export type Registry<T = any> = Dict<T>;

import { HttpStatus } from '@nestjs/common';

export interface CommonResponse<T = void> {
  message?: string;
  status: HttpStatus;
  data?: T;
  test?: string;
}
