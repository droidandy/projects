import { IDCustomerPreferenceSetRequestDTO, Injectable, Typify } from '@invest.wl/core';
import { IDInputFormModel } from '../../Input/D.Input.types';
import { DInputValidator } from '../../Input/D.Input.validator';
import { DInputFormModel } from '../../Input/D.InputForm.model';
import { DInputStringModel } from '../../Input/model/D.InputString.model';

export const DCustomerPreferenceSetModelTid = Symbol.for('DCustomerSetModelTid');
type TDTO = Typify<IDCustomerPreferenceSetRequestDTO>;

export interface IDCustomerPreferenceSetModel extends IDInputFormModel<TDTO> {
}


@Injectable()
export class DCustomerPreferenceSetModel extends DInputFormModel<TDTO> implements IDCustomerPreferenceSetModel {
  constructor() {
    super({
      value: new DInputStringModel({ validatorList: [DInputValidator.required] }),
      settingId: new DInputStringModel({ validatorList: [DInputValidator.required] }),
    });
  }
}
