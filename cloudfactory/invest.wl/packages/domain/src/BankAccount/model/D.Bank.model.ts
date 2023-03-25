import { DModelX, IDModelX } from '@invest.wl/common';
import { IDBankItemDTO, Injectable } from '@invest.wl/core';

type TDTO = IDBankItemDTO;

export const DBankModelTid = Symbol.for('DBankModelTid');

export interface IDBankModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
}

@Injectable()
export class DBankModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDBankModel<DTO> {
}
