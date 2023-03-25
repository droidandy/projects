import { Formatter, ILambda } from '@invest.wl/common';
import { IDInstrumentInfoPart, IoC } from '@invest.wl/core';
import { DInstrumentTypeMpart, IDInstrumentTypeMpart } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVThemeStore, VThemeStoreTid } from '../../Theme/V.Theme.types';

type TDTO = IDInstrumentInfoPart;

export interface IVInstrumentInfoMpart extends IDInstrumentTypeMpart {
  readonly midRate: string;
  readonly midRatePercent: string;
  readonly change: string;
  readonly changeYear: string;
  readonly changePoint?: string;
  readonly changeColor: string;
  readonly priceStep: number;
  readonly isGrow: boolean;
}

export class VInstrumentInfoMpart<DTO extends TDTO = TDTO> extends DInstrumentTypeMpart<DTO> implements IVInstrumentInfoMpart {
  private _theme = IoC.get<IVThemeStore>(VThemeStoreTid);

  @computed
  public get midRate() {
    return Formatter.currency(this.dto.MidRate, { symbol: this.symbolMoney, priceStep: this.dto.PriceStep });
  }

  @computed
  public get midRatePercent() {
    return this.isBond ? Formatter.currency(this.dto.MidRatePercent, { symbol: '%' }) : '';
  }

  @computed
  public get changePoint() {
    return Formatter.currency(this.dto.ChangePoint, { signed: true, symbol: this.symbolMoney });
  }

  @computed
  public get change() {
    return Formatter.currency(this.dto.Change, { symbol: '%' });
  }

  @computed
  public get changeYear() {
    return Formatter.currency(this.dto.YTM || 0, { symbol: '%' }) + ' годовых';
  }

  @computed
  public get changeColor() {
    return this.isGrow ? this._theme.color.positive : this._theme.color.negativeLight;
  }

  @computed
  public get priceStep() {
    return this.dto.PriceStep;
  }

  @computed
  public get isGrow() {
    return (this.dto.Change || 0) >= 0;
  }

  constructor(dtoLV: ILambda<DTO>) {
    super(dtoLV);
    makeObservable(this);
  }
}
