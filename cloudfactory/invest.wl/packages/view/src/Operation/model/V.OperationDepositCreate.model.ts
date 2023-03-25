import { Formatter } from '@invest.wl/common';
import { Injectable } from '@invest.wl/core';
import { IDInputNumberModel, IDOperationDepositCreateModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { VInputIdModel } from '../../Input/model/V.InputId.model';
import { VInputNumberModel } from '../../Input/model/V.InputNumber.model';
import { VInputStringModel } from '../../Input/model/V.InputString.model';
import { IVInputFormModel } from '../../Input/V.Input.types';
import { VInputFormModel } from '../../Input/V.InputForm.model';

export const VOperationDepositCreateModelTid = Symbol.for('VOperationDepositCreateModelTid');

export interface IVOperationDepositCreateModel extends IVInputFormModel<IDOperationDepositCreateModel> {
}

@Injectable()
export class VOperationDepositCreateModel extends VInputFormModel<IDOperationDepositCreateModel> implements IVOperationDepositCreateModel {
  @computed
  public get currencySymbol() {
    return this.fields.currency.value ? Formatter.symbol(this.fields.currency.value) : '';
  }

  public fields = {
    agreement: new VInputIdModel(this.domain.fields.agreement),
    account: new VInputIdModel(this.domain.fields.account),
    currency: new VInputStringModel(this.domain.fields.currency),
    total: new VInputNumberModel(this.domain.fields.total as IDInputNumberModel),
  };

  constructor(domain: IDOperationDepositCreateModel) {
    super(domain);
    makeObservable(this);
  }
}
