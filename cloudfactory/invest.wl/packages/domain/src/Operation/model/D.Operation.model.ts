import { DModelX, IDModelX } from '@invest.wl/common';
import { IDOperationItemDTO, Injectable } from '@invest.wl/core';

export const DOperationModelTid = Symbol.for('DOperationModelTid');
type TDTO = IDOperationItemDTO;

export interface IDOperationModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
}

@Injectable()
export class DOperationModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDOperationModel<DTO> {

}
