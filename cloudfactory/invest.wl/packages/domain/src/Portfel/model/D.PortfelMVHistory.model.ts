import { DModelX, IDModelX } from '@invest.wl/common';
import { IDPortfelMVHistoryItemDTO, Injectable } from '@invest.wl/core';

export const DPortfelMVHistoryModelTid = Symbol.for('DPortfelMVHistoryModelTid');
type TDTO = IDPortfelMVHistoryItemDTO;

export interface IDPortfelMVHistoryModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
}

@Injectable()
export class DPortfelMVHistoryModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDPortfelMVHistoryModel<DTO> {

}
