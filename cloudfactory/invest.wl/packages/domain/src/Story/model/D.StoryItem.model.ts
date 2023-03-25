import { DModelX, IDModelX } from '@invest.wl/common';
import { IDStoryItemDTO, Injectable } from '@invest.wl/core';

export const DStoryItemModelTid = Symbol.for('DStoryItemModelTid');
type TDTO = IDStoryItemDTO;

export interface IDStoryItemModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
}

@Injectable()
export class DStoryItemModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDStoryItemModel<DTO> {

}
