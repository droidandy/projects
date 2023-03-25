import { ILambda, IVModelX, VModelX } from '@invest.wl/common';
import { Injectable } from '@invest.wl/core';
import { IDBankModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';

export const VBankModelTid = Symbol.for('VBankModelTid');

export interface IVBankModel extends IVModelX<IDBankModel> {
  readonly name: string;
  readonly bik: string;
  readonly inn?: string;
}

@Injectable()
export class VBankModel extends VModelX<IDBankModel> implements IVBankModel {
  @computed
  public get name() {
    return this.domain.dto.name;
  }

  @computed
  public get bik() {
    return this.domain.dto.bik;
  }

  @computed
  public get inn() {
    return this.domain.dto.inn;
  }

  constructor(dtoLV: ILambda<IDBankModel>) {
    super(dtoLV);
    makeObservable(this);
  }
}
