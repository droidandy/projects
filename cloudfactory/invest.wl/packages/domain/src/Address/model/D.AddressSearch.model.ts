import { IDAddressSearchRequestDTO, Injectable } from '@invest.wl/core';
import { IDInputFormModel } from '../../Input/D.Input.types';
import { DInputValidator } from '../../Input/D.Input.validator';
import { DInputFormModel } from '../../Input/D.InputForm.model';
import { DInputStringModel } from '../../Input/model/D.InputString.model';

type TDTO = IDAddressSearchRequestDTO;

export const DAddressSearchModelTid = Symbol.for('DAddressSearchModelTid');

export interface IDAddressSearchModel extends IDInputFormModel<TDTO> {
}

@Injectable()
export class DAddressSearchModel extends DInputFormModel<TDTO> implements IDAddressSearchModel {
  constructor() {
    super({
      text: new DInputStringModel({ validatorList: [DInputValidator.required] }),
    });
  }
}
