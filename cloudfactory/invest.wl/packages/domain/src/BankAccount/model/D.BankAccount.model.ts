import { DModelX, IDModelX } from '@invest.wl/common';
import { IDBankAccountDTO, Injectable } from '@invest.wl/core';

type TDTO = IDBankAccountDTO;

export const DBankAccountModelTid = Symbol.for('DBankAccountModelTid');

export interface IDBankAccountModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
}

@Injectable()
export class DBankAccountModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDBankAccountModel<DTO> {
}
