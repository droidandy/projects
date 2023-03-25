import { IDOperationDepositCreateDTO, Injectable } from '@invest.wl/core';
import { makeObservable } from 'mobx';
import { IDInputFormModel } from '../../Input/D.Input.types';
import { DInputValidator } from '../../Input/D.Input.validator';
import { DInputFormModel } from '../../Input/D.InputForm.model';
import { DInputIdModel } from '../../Input/model/D.InputId.model';
import { DInputNumberModel } from '../../Input/model/D.InputNumber.model';
import { DInputStringModel } from '../../Input/model/D.InputString.model';

export const DOperationDepositCreateModelTid = Symbol.for('DOperationDepositCreateModelTid');

type TDTO = IDOperationDepositCreateDTO;

export interface IDOperationDepositCreateModel extends IDInputFormModel<TDTO> {
}

@Injectable()
export class DOperationDepositCreateModel extends DInputFormModel<TDTO> implements IDOperationDepositCreateModel {
  constructor() {
    super({
      agreement: new DInputIdModel({ validatorList: [DInputValidator.required] }),
      account: new DInputIdModel({ validatorList: [DInputValidator.required] }),
      currency: new DInputStringModel({ validatorList: [DInputValidator.required] }),
      total: new DInputNumberModel({ validatorList: [DInputValidator.numberRequired] }),
    });
    makeObservable(this);
  }
}
