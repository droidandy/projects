import { Injectable } from '@invest.wl/core';
import { IDInputNumberModel, IDOperationTransferCreateModel } from '@invest.wl/domain';
import { makeObservable } from 'mobx';
import { VInputIdModel } from '../../Input/model/V.InputId.model';
import { VInputNumberModel } from '../../Input/model/V.InputNumber.model';
import { VInputStringModel } from '../../Input/model/V.InputString.model';
import { IVInputFormModel } from '../../Input/V.Input.types';
import { VInputFormModel } from '../../Input/V.InputForm.model';

export const VOperationTransferCreateModelTid = Symbol.for('VOperationTransferCreateModelTid');

export interface IVOperationTransferCreateModel extends IVInputFormModel<IDOperationTransferCreateModel> {
}

@Injectable()
export class VOperationTransferCreateModel extends VInputFormModel<IDOperationTransferCreateModel> implements IVOperationTransferCreateModel {
  public fields = {
    agreementFrom: new VInputIdModel(this.domain.fields.agreementFrom),
    accountFrom: new VInputIdModel(this.domain.fields.accountFrom),
    agreementTo: new VInputIdModel(this.domain.fields.agreementTo),
    accountTo: new VInputIdModel(this.domain.fields.accountTo),
    currency: new VInputStringModel(this.domain.fields.currency, { valueSetSkip: true }),
    total: new VInputNumberModel(this.domain.fields.total as IDInputNumberModel),
  };

  constructor(domain: IDOperationTransferCreateModel) {
    super(domain);
    makeObservable(this);
  }
}
