import { DModelX, IDModelX } from '@invest.wl/common';
import { IDNewsItemDTO, Injectable } from '@invest.wl/core';

export const DNewsItemModelTid = Symbol.for('DNewsItemModelTid');
type TDTO = IDNewsItemDTO;

export interface IDNewsItemModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
}

@Injectable()
export class DNewsItemModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDNewsItemModel<DTO> {

}
