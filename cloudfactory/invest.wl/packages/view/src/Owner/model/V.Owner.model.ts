import { ILambda, IVModelXValue, VModelXValue } from '@invest.wl/common';
import { EDOwnerContactType, Injectable, ISelectItem } from '@invest.wl/core';
import { IDOwnerModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';

export type IVOwnerModelStat = ISelectItem<string> & { type?: EDOwnerContactType };

export const VOwnerModelTid = Symbol.for('VOwnerModelTid');

export interface IVOwnerModel extends IVModelXValue<IDOwnerModel> {
  readonly phone: string;
  readonly phoneCallCenter: string;
  readonly emailHelp: string;
  readonly emailCustomer: string;
  readonly emailTechnical: string;
  readonly address: string;
  readonly statList: IVOwnerModelStat[];
}

@Injectable()
export class VOwnerModel extends VModelXValue<IDOwnerModel> implements IVOwnerModel {
  @computed
  public get phone() {
    return this.domain.dto.phone;
  }

  @computed
  public get phoneCallCenter() {
    return this.domain.dto.phoneCallCenter;
  }

  @computed
  public get emailHelp() {
    return this.domain.dto.emailHelp;
  }

  @computed
  public get emailCustomer() {
    return this.domain.dto.emailCustomer;
  }

  @computed
  public get emailTechnical() {
    return this.domain.dto.emailTechnical;
  }

  @computed
  public get address() {
    return this.domain.dto.address;
  }

  @computed
  public get statList(): IVOwnerModelStat[] {
    return [
      { name: 'Телефон', value: this.phone, type: EDOwnerContactType.Phone },
      { name: 'Клиентское обслуживание', value: this.emailCustomer, type: EDOwnerContactType.Email },
      { name: 'Техническая поддержка', value: this.emailTechnical, type: EDOwnerContactType.Email },
      { name: 'Адрес', value: this.address },
    ];
  }

  constructor(dtoLV: ILambda<IDOwnerModel>) {
    super(dtoLV);
    makeObservable(this);
  }
}
