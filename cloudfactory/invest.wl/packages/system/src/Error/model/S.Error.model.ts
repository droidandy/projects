import { ErrorModel } from '@invest.wl/common';
import { ISErrorDTO } from '@invest.wl/core';
import { ISErrorModel } from '../S.Error.types';

export class SErrorModel<DTO extends ISErrorDTO = ISErrorDTO>
  extends ErrorModel<DTO> implements ISErrorModel<DTO> {

}
