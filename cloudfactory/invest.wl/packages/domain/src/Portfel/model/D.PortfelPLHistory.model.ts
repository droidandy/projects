import { DModelX, IDModelX } from '@invest.wl/common';
import { IDPortfelPLHistoryItemDTO, Injectable } from '@invest.wl/core';

export const DPortfelPLHistoryModelTid = Symbol.for('DPortfelPLHistoryModelTid');
type TDTO = IDPortfelPLHistoryItemDTO;

export interface IDPortfelPLHistoryModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
}

@Injectable()
export class DPortfelPLHistoryModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDPortfelPLHistoryModel<DTO> {

}
