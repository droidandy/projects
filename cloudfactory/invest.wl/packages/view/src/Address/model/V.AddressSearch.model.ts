import { Injectable } from '@invest.wl/core';
import { IDAddressSearchModel } from '@invest.wl/domain';
import { VInputStringModel } from '../../Input/model/V.InputString.model';
import { IVInputFormModel } from '../../Input/V.Input.types';

import { VInputFormModel } from '../../Input/V.InputForm.model';

export const VAddressSearchModelTid = Symbol.for('VAddressSearchModelTid');

export interface IVAddressSearchModel extends IVInputFormModel<IDAddressSearchModel> {
}

@Injectable()
export class VAddressSearchModel extends VInputFormModel<IDAddressSearchModel> implements IVAddressSearchModel {
  public fields = {
    text: new VInputStringModel(this.domain.fields.text),
  };
}
