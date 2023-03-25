import { ILambda, IVModelX, VModelX } from '@invest.wl/common';
import { Injectable, ISelectItem } from '@invest.wl/core';
import { IDCustomerAccountSelfModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';

export const VCustomerAccountSelfModelTid = Symbol.for('VCustomerAccountSelfModelTid');

export interface IVCustomerAccountSelfModel extends IVModelX<IDCustomerAccountSelfModel> {
  readonly name: string;
  readonly phone?: string;
  readonly email?: string;
  readonly statList: ISelectItem<string>[];
}

@Injectable()
export class VCustomerAccountSelfModel extends VModelX<IDCustomerAccountSelfModel> implements IVCustomerAccountSelfModel {
  @computed
  public get name() {
    return this.domain.dto.Name;
  }

  @computed
  public get phone() {
    return this.domain.dto.phone;
  }

  @computed
  public get email() {
    return this.domain.dto.email;
  }

  @computed
  public get statList(): ISelectItem<string>[] {
    return [
      { name: 'Ф.И.О. пользователя', value: this.name },
      { name: 'Телефон', value: this.phone },
      { name: 'E-mail', value: this.email },
    ];
  }

  constructor(dtoLV: ILambda<IDCustomerAccountSelfModel>) {
    super(dtoLV);
    makeObservable(this);
  }
}
