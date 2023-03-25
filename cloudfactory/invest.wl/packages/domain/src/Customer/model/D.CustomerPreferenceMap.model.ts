import { DModelX, IDModelXValue } from '@invest.wl/common';
import { IDCustomerPreferenceMap, Injectable } from '@invest.wl/core';

export const DCustomerPreferenceMapModelTid = Symbol.for('DCustomerPreferenceMapModelTid');
type TDTO = IDCustomerPreferenceMap;

export interface IDCustomerPreferenceMapModel<DTO extends TDTO = TDTO> extends IDModelXValue<DTO> {
}

@Injectable()
export class DCustomerPreferenceMapModel<DTO extends TDTO = TDTO> extends DModelX.Value<DTO> implements IDCustomerPreferenceMapModel<DTO> {

}
