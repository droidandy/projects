import { DModelX, IDModelX } from '@invest.wl/common';
import { IDAccountQUIKItemDTO, Injectable } from '@invest.wl/core';
import { DAccountTypeMpart, IDAccountTypeMpart } from '../mpart/D.AccountType.mpart';

export const DAccountQUIKModelTid = Symbol.for('DAccountQUIKModelTid');
type TDTO = IDAccountQUIKItemDTO;

export interface IDAccountQUIKModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
  readonly type: IDAccountTypeMpart;
}

@Injectable()
export class DAccountQUIKModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDAccountQUIKModel<DTO> {
  public type = new DAccountTypeMpart(() => this.dto);
}
