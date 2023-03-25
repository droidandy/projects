import { DModelX, IDModelX } from '@invest.wl/common';
import { IDInstrumentInfoResponseDTO, Injectable } from '@invest.wl/core';
import { DInstrumentTypeMpart, IDInstrumentTypeMpart } from '../mpart/D.InstrumentType.mpart';

export const DInstrumentInfoModelTid = Symbol.for('DInstrumentInfoModelTid');
type TDTO = IDInstrumentInfoResponseDTO;

export interface IDInstrumentInfoModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
  readonly type: IDInstrumentTypeMpart;
}

@Injectable()
export class DInstrumentInfoModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDInstrumentInfoModel<DTO> {
  public type = new DInstrumentTypeMpart(() => this.dto);
}
