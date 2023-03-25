import { Formatter, ILambda, IVModelX, VModelX } from '@invest.wl/common';
import { EDCurrencyCode, Injectable } from '@invest.wl/core';
import { IDAccountQUIKModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVAccountIdentityMpart, VAccountIdentityMpart } from '../mpart/V.AccountIdentity.mpart';

export const VAccountQUIKModelTid = Symbol.for('VAccountQUIKModelTid');

export interface IVAccountQUIKModel extends IVModelX<IDAccountQUIKModel> {
  readonly identity: IVAccountIdentityMpart;
  readonly marketValue: string;
}

@Injectable()
export class VAccountQUIKModel extends VModelX<IDAccountQUIKModel> implements IVAccountQUIKModel {
  public identity = new VAccountIdentityMpart(() => this.domain.dto);

  @computed
  public get marketValue() {
    return Formatter.currency(this.domain.dto.MarketValue, { code: EDCurrencyCode.RUR });
  }

  constructor(dtoLV: ILambda<IDAccountQUIKModel>) {
    super(dtoLV);
    makeObservable(this);
  }
}
