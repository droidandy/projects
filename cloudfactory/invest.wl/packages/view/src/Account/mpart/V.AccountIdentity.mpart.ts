import { DModelX, IDModelXValue, ILambda } from '@invest.wl/common';
import { EDAccountAgreementType, IDAccountIdentityPart, IDAccountTypePart, IoC } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { IVAccountI18n, VAccountI18nTid } from '../V.Account.types';

type TDTO = Partial<Pick<IDAccountIdentityPart, 'Name' | 'DisplayName'> & IDAccountTypePart>;

export interface IVAccountIdentityMpart extends IDModelXValue<TDTO> {
  readonly name: string;
  readonly marketType: string;
  readonly type: string;
}

export class VAccountIdentityMpart<DTO extends TDTO = TDTO> extends DModelX.Value<DTO> implements IVAccountIdentityMpart {
  private _accountI18n = IoC.get<IVAccountI18n>(VAccountI18nTid);

  @computed
  public get name() {
    return this.dto.DisplayName || this.dto.Name || '';
  }

  @computed
  public get marketType() {
    const { MarketType, Board } = this.dto;
    const { marketType, board } = this._accountI18n;
    return MarketType ? marketType[MarketType] : Board ? board[Board] : 'unknown';
  }

  @computed
  public get type() {
    return this._accountI18n.agreementType[this.dto.AgreementType ?? EDAccountAgreementType.Default];
  }

  constructor(dtoLV: ILambda<DTO>) {
    super(dtoLV);
    makeObservable(this);
  }
}
