import { IDBankSearchRequestDTO, Injectable, Typify } from '@invest.wl/core';
import { IDInputFormModel } from '../../Input/D.Input.types';
import { DInputValidator } from '../../Input/D.Input.validator';
import { DInputFormModel } from '../../Input/D.InputForm.model';
import { DInputStringModel } from '../../Input/model/D.InputString.model';

type TDTO = Typify<IDBankSearchRequestDTO>;

export const DBankSearchModelTid = Symbol.for('DBankSearchModelTid');

export interface IDBankSearchModel extends IDInputFormModel<TDTO> {
}

@Injectable()
export class DBankSearchModel extends DInputFormModel<TDTO> implements IDBankSearchModel {
  constructor() {
    super({
      text: new DInputStringModel({ validatorList: [DInputValidator.required] }),
    });
  }
}
