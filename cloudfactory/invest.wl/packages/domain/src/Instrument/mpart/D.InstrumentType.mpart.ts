import { DModelXValue, Formatter, IDModelXValue, ILambda } from '@invest.wl/common';
import { EDCurrencyCode, EDInstrumentAssetSubType, EDInstrumentAssetType, IDInstrumentTypePart, IoC } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { DCurrencyConfig, DCurrencyConfigTid } from '../../Currency';

type TDTO = IDInstrumentTypePart;

export interface IDInstrumentTypeMpart extends IDModelXValue<TDTO> {
  readonly currency: EDCurrencyCode;
  readonly assetType: EDInstrumentAssetType;
  readonly assetSubType: EDInstrumentAssetSubType;
  readonly symbol: string;
  readonly symbolMoney: string;
  readonly isBond: boolean;
  readonly isIndex: boolean;
  readonly isFuture: boolean;
  readonly isOption: boolean;
  readonly isFX: boolean;
  readonly isMoney: boolean;
  readonly isMoneyRub: boolean;
}

export class DInstrumentTypeMpart<DTO extends TDTO = TDTO> extends DModelXValue<DTO> implements IDInstrumentTypeMpart {
  private _currencyCfg = IoC.get<DCurrencyConfig>(DCurrencyConfigTid);

  @computed
  public get currency() {
    return this.dto.Currency.Name as EDCurrencyCode;
  }

  @computed
  public get assetType() {
    return this.dto.AssetType;
  }

  @computed
  public get assetSubType() {
    return this.dto.AssetSubType;
  }

  @computed
  public get symbol() {
    return this.isBond ? '%' : this.symbolMoney;
  }

  @computed
  public get symbolMoney() {
    return this.isIndex ? 'P' : this.isFuture ? '' : Formatter.symbol(this.currency);
  }

  @computed
  public get isBond() {
    return this.dto.AssetType === EDInstrumentAssetType.Bond;
  }

  @computed
  public get isIndex() {
    return this.dto.AssetType === EDInstrumentAssetType.Index || this.dto.AssetType === EDInstrumentAssetType.CompositeIndex;
  }

  @computed
  public get isFuture() {
    return this.dto.AssetType === EDInstrumentAssetType.Future;
  }

  @computed
  public get isOption() {
    return this.dto.AssetType === EDInstrumentAssetType.Option;
  }

  @computed
  public get isFX() {
    return this.dto.AssetType === EDInstrumentAssetType.FX;
  }

  @computed
  public get isMoney() {
    return this.dto.AssetType === EDInstrumentAssetType.Money;
  }

  @computed
  public get isMoneyRub() {
    return this.isMoney && this._currencyCfg.codeRuble.includes(this.currency);
  }

  constructor(dtoLV: ILambda<DTO>) {
    super(dtoLV);
    makeObservable(this);
  }
}
