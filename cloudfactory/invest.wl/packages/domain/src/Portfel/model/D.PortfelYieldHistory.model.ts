import { DModelX, IDModelX } from '@invest.wl/common';
import { IDPortfelYieldHistoryItemDTO, Injectable } from '@invest.wl/core';

export const DPortfelYieldHistoryModelTid = Symbol.for('DPortfelYieldHistoryModelTid');
type TDTO = IDPortfelYieldHistoryItemDTO;

export interface IDPortfelYieldHistoryModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
}

@Injectable()
export class DPortfelYieldHistoryModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDPortfelYieldHistoryModel<DTO> {

}
