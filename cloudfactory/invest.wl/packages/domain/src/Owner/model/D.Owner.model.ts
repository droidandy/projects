import { DModelXValue, IDModelXValue } from '@invest.wl/common';
import { IDOwnerDTO } from '@invest.wl/core';

export const DOwnerModelTid = Symbol.for('DOwnerModelTid');
type TDTO = IDOwnerDTO;

export interface IDOwnerModel<DTO extends TDTO = TDTO> extends IDModelXValue<DTO> {
}

export class DOwnerModel extends DModelXValue<TDTO> implements IDOwnerModel<TDTO> {
}
