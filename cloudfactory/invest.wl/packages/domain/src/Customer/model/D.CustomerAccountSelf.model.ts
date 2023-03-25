import { DModelX, IDModelX } from '@invest.wl/common';
import { IDCustomerAccountSelfResponseDTO, Injectable } from '@invest.wl/core';

export const DCustomerAccountSelfModelTid = Symbol.for('DCustomerAccountSelfModelTid');
type TDTO = IDCustomerAccountSelfResponseDTO;

export interface IDCustomerAccountSelfModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
}

@Injectable()
export class DCustomerAccountSelfModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDCustomerAccountSelfModel<DTO> {

}
