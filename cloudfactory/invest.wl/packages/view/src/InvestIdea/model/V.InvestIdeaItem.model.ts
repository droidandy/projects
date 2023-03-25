import { Formatter, ILambda, IVModelX, VModelX } from '@invest.wl/common';
import { Injectable, IoC, ISelectItem } from '@invest.wl/core';
import { IDInvestIdeaItemModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { TVIconName } from '../../Icon/V.Icon.types';
import { IVInstrumentIdentityMpart, VInstrumentIdentityMpart } from '../../Instrument/mpart/V.InstrumentIdentity.mpart';
import { IVInstrumentInfoMpart, VInstrumentInfoMpart } from '../../Instrument/mpart/V.InstrumentInfo.mpart';
import { VThemeStore } from '../../Theme/V.Theme.store';
import { VThemeStoreTid } from '../../Theme/V.Theme.types';
import { IVInvestIdeaIdentityMpart, VInvestIdeaIdentityMpart } from '../mpart/V.InvestIdeaIdentity.mpart';

export const VInvestIdeaItemModelTid = Symbol.for('VInvestIdeaItemModelTid');

export interface IVInvestIdeaItemModel extends IVModelX<IDInvestIdeaItemModel> {
  readonly identity: IVInvestIdeaIdentityMpart;
  readonly instrumentIdentity?: IVInstrumentIdentityMpart;
  readonly instrumentInfo?: IVInstrumentInfoMpart;
  readonly profit: string;
  readonly directionIcon: TVIconName;
  readonly directionColor: string;
  readonly strategy: string;
  readonly openDate?: string;
  readonly priceOpen?: string;
  readonly priceClose?: string;
  readonly instrumentStat?: ISelectItem<string>[];
}

@Injectable()
export class VInvestIdeaItemModel extends VModelX<IDInvestIdeaItemModel> implements IVInvestIdeaItemModel {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public identity = new VInvestIdeaIdentityMpart(() => this.domain.dto);
  public instrumentIdentity = this.domain.dto.Instrument?.AssetType != null ? new VInstrumentIdentityMpart(() => this.domain.dto.Instrument!) : undefined;
  public instrumentInfo = this.domain.dto.Instrument?.AssetType != null ? new VInstrumentInfoMpart(() => this.domain.dto.Instrument!) : undefined;

  @computed
  public get priceOpen() {
    if (!this.instrumentInfo) return;
    const { PriceOpen } = this.domain.dto;
    const { priceStep, symbolMoney } = this.instrumentInfo;
    return Formatter.currency(PriceOpen, { priceStep, symbol: symbolMoney });
  }

  @computed
  public get priceClose() {
    if (!this.instrumentInfo) return;
    const { PriceClose } = this.domain.dto;
    const { priceStep, symbolMoney } = this.instrumentInfo;
    return Formatter.currency(PriceClose, { priceStep, symbol: symbolMoney });
  }

  @computed
  public get instrumentStat() {
    if (!this.instrumentInfo) return;
    return [
      { name: 'Цена открытия', value: this.priceOpen },
      { name: 'Текущая цена', value: this.instrumentInfo?.midRate },
      { name: 'Цена продажи', value: this.priceClose },
    ];
  }

  @computed
  public get profit() {
    return Formatter.currency(this.domain.profit, { symbol: '%' });
  }

  @computed
  public get directionIcon(): TVIconName {
    return this.domain.isGrow ? 'arrow-up' : 'arrow-down';
  }

  @computed
  public get directionColor() {
    return this.domain.isGrow ? this._theme.color.positive : this._theme.color.negativeLight;
  }

  @computed
  public get strategy() {
    return this.domain.dto.Strategy;
  }

  @computed
  public get openDate() {
    return this.domain.dto.DateOpen && Formatter.date(this.domain.dto.DateOpen, { pattern: 'default' });
  }

  constructor(dtoLV: ILambda<IDInvestIdeaItemModel>) {
    super(dtoLV);
    makeObservable(this);
  }
}
