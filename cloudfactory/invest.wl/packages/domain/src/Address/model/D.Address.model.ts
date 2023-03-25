import { DModelX, IDModelX } from '@invest.wl/common';
import { IDAddressItemDTO, Injectable } from '@invest.wl/core';

type TDTO = IDAddressItemDTO;

export const DAddressModelTid = Symbol.for('DAddressModelTid');

export interface IDAddressModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
}

@Injectable()
export class DAddressModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDAddressModel<DTO> {
}
