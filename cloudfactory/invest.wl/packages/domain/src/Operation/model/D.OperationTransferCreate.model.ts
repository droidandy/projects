import { IDOperationTransferCreateDTO, Injectable } from '@invest.wl/core';
import { makeObservable } from 'mobx';
import { IDInputFormModel } from '../../Input/D.Input.types';
import { DInputValidator } from '../../Input/D.Input.validator';
import { DInputFormModel } from '../../Input/D.InputForm.model';
import { DInputIdModel } from '../../Input/model/D.InputId.model';
import { DInputNumberModel } from '../../Input/model/D.InputNumber.model';
import { DInputStringModel } from '../../Input/model/D.InputString.model';

export const DOperationTransferCreateModelTid = Symbol.for('DOperationTransferCreateModelTid');
type TDTO = IDOperationTransferCreateDTO;

export interface IDOperationTransferCreateModel extends IDInputFormModel<TDTO> {
}

@Injectable()
export class DOperationTransferCreateModel extends DInputFormModel<TDTO> implements IDOperationTransferCreateModel {
  constructor() {
    super({
      agreementFrom: new DInputIdModel({ validatorList: [DInputValidator.required] }),
      accountFrom: new DInputIdModel({ validatorList: [DInputValidator.required] }),
      agreementTo: new DInputIdModel({ validatorList: [DInputValidator.required] }),
      accountTo: new DInputIdModel({ validatorList: [DInputValidator.required] }),
      currency: new DInputStringModel({ validatorList: [DInputValidator.required] }),
      total: new DInputNumberModel({ validatorList: [DInputValidator.numberRequired] }),
    });
    makeObservable(this);
  }
}
