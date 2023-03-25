import { IErrorDTO } from '@invest.wl/core';
import { IDModelXValue } from '../../reactive/ModelX/ModelX.types';

export interface IErrorModel<DTO extends IErrorDTO = IErrorDTO> extends IDModelXValue<DTO> {
  message: string;
  isNotified: boolean;
  toError(): Error;
}
