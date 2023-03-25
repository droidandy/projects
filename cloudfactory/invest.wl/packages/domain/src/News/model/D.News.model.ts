import { DModelX, IDModelX } from '@invest.wl/common';
import { IDNewsInfoResponseDTO, Injectable } from '@invest.wl/core';

export const DNewsModelTid = Symbol.for('DNewsModelTid');
type TDTO = IDNewsInfoResponseDTO;

export interface IDNewsModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
}

@Injectable()
export class DNewsModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDNewsModel<DTO> {

}
