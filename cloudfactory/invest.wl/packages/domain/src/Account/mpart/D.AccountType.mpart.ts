import { DModelXValue, IDModelXValue, ILambda } from '@invest.wl/common';
import { EDAccountBoard, EDAccountMarketType, EDAccountAgreementType, IDAccountTypePart } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';

type TDTO = Partial<IDAccountTypePart>;

export interface IDAccountTypeMpart extends IDModelXValue<TDTO> {
  readonly AgreementType?: EDAccountAgreementType;
  readonly isIIS: boolean;
  readonly Board?: EDAccountBoard;
  readonly MarketType: EDAccountMarketType;
  readonly isMarketFund: boolean;
  readonly isMarketFundSPB: boolean;
  readonly isMarketTerm: boolean;
  readonly isMarketCurrency: boolean;
  readonly isMarketOTC: boolean;
}

export class DAccountTypeMpart<DTO extends TDTO = TDTO> extends DModelXValue<DTO> implements IDAccountTypeMpart {
  public static mapBoardToMarketType: { [b in EDAccountBoard]: EDAccountMarketType } = {
    [EDAccountBoard.OTC]: EDAccountMarketType.OTC,
    [EDAccountBoard.FundSPB]: EDAccountMarketType.FundSPB,
    [EDAccountBoard.Currency]: EDAccountMarketType.Currency,
    [EDAccountBoard.Other]: EDAccountMarketType.Fund,
    [EDAccountBoard.Term]: EDAccountMarketType.Term,
  };

  @computed
  public get AgreementType() {
    return this.dto.AgreementType;
  }

  @computed
  public get isIIS() {
    return this.AgreementType === EDAccountAgreementType.IIS;
  }

  @computed
  public get Board() {
    return this.dto.Board;
  }

  @computed
  public get MarketType() {
    return this.dto.MarketType || DAccountTypeMpart.mapBoardToMarketType[this.dto.Board!];
  }

  @computed
  public get isMarketFund() {
    return this.MarketType === EDAccountMarketType.Fund;
  }

  @computed
  public get isMarketFundSPB() {
    return this.MarketType === EDAccountMarketType.FundSPB;
  }

  @computed
  public get isMarketTerm() {
    return this.MarketType === EDAccountMarketType.Term;
  }

  @computed
  public get isMarketCurrency() {
    return this.MarketType === EDAccountMarketType.Currency;
  }

  @computed
  public get isMarketOTC() {
    return this.MarketType === EDAccountMarketType.OTC;
  }

  constructor(dtoLV: ILambda<DTO>) {
    super(dtoLV);
    makeObservable(this);
  }
}
