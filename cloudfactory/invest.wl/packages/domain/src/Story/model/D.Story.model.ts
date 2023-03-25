import { DModelX, IDModelX } from '@invest.wl/common';
import { IDStoryInfoResponseDTO, Injectable } from '@invest.wl/core';

export const DStoryModelTid = Symbol.for('DStoryModelTid');
type TDTO = IDStoryInfoResponseDTO;

export interface IDStoryModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
}

@Injectable()
export class DStoryModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDStoryModel<DTO> {

}
