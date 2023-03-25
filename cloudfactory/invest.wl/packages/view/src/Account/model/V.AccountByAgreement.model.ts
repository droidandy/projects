import { ILambda, IMapXList, MapX, VModelX } from '@invest.wl/common';
import { IDAccountItemDTO, IDAccountQUIKItemDTO, Injectable, IoC, Newable } from '@invest.wl/core';
import { IDAccountByAgreementModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVAccountModel, VAccountModel, VAccountModelTid } from './V.Account.model';

export const VAccountByAgreementModelTid = Symbol.for('VAccountByAgreementModelTid');

type IAccountItem = IDAccountItemDTO | IDAccountQUIKItemDTO;

export interface IVAccountByAgreementModel<I extends IAccountItem> {
  readonly number: string;
  readonly name: string;
  readonly accountListX: IMapXList<IVAccountModel>;
}

@Injectable()
export class VAccountByAgreementModel<I extends IAccountItem> extends VModelX<IDAccountByAgreementModel<I>> implements IVAccountByAgreementModel<I> {
  private _model = IoC.get<Newable<typeof VAccountModel>>(VAccountModelTid);

  @computed
  public get number() {
    return this.domain.agreement.Agreement;
  }

  @computed
  public get name() {
    return this.domain.agreement.Name;
  }

  public accountListX = new MapX.BaseList(
    () => this.domain.listX.list,
    v => new this._model(v),
  );

  constructor(dtoLV: ILambda<IDAccountByAgreementModel<I>>) {
    super(dtoLV);
    makeObservable(this);
  }
}
