import { Formatter, ILambda, IVModelX, VModelX } from '@invest.wl/common';
import { EDCurrencyCode, Injectable } from '@invest.wl/core';
import { IDAccountModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVAccountIdentityMpart, VAccountIdentityMpart } from '../mpart/V.AccountIdentity.mpart';

export const VAccountModelTid = Symbol.for('VAccountModelTid');

export interface IVAccountModel extends IVModelX<IDAccountModel> {
  readonly identity: IVAccountIdentityMpart;
  readonly marketValue: string;
}

@Injectable()
export class VAccountModel extends VModelX<IDAccountModel> implements IVAccountModel {
  public identity = new VAccountIdentityMpart(() => this.domain.dto);

  @computed
  public get marketValue() {
    return Formatter.currency(this.domain.dto.MarketValue, { code: EDCurrencyCode.RUR });
  }

  constructor(dtoLV: ILambda<IDAccountModel>) {
    super(dtoLV);
    makeObservable(this);
  }
}
