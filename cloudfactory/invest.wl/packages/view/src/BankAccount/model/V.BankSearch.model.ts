import { Injectable } from '@invest.wl/core';
import { IDBankSearchModel } from '@invest.wl/domain';
import { VInputStringModel } from '../../Input/model/V.InputString.model';
import { IVInputFormModel } from '../../Input/V.Input.types';

import { VInputFormModel } from '../../Input/V.InputForm.model';

export const VBankSearchModelTid = Symbol.for('VBankSearchModelTid');

export interface IVBankSearchModel extends IVInputFormModel<IDBankSearchModel> {
}

@Injectable()
export class VBankSearchModel extends VInputFormModel<IDBankSearchModel> implements IVBankSearchModel {
  public fields = {
    text: new VInputStringModel(this.domain.fields.text),
  };
}
