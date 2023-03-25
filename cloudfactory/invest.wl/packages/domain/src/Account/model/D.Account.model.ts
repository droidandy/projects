import { DModelX, IDModelX } from '@invest.wl/common';
import { IDAccountItemDTO, Injectable } from '@invest.wl/core';
import { DAccountTypeMpart, IDAccountTypeMpart } from '../mpart/D.AccountType.mpart';

export const DAccountModelTid = Symbol.for('DAccountModelTid');
type TDTO = IDAccountItemDTO;

export interface IDAccountModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
  readonly type: IDAccountTypeMpart;
}

@Injectable()
export class DAccountModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDAccountModel<DTO> {
  public type = new DAccountTypeMpart(() => this.dto);
}
