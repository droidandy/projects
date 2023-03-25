import { Formatter, ILambda, IVModelX, VModelX } from '@invest.wl/common';
import { Injectable } from '@invest.wl/core';
import { IDInstrumentAlertModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVInstrumentIdentityMpart, VInstrumentIdentityMpart } from '../../Instrument/mpart/V.InstrumentIdentity.mpart';

export const VInstrumentAlertModelTid = Symbol.for('VInstrumentAlertModelTid');

export interface IVInstrumentAlertModel extends IVModelX<IDInstrumentAlertModel> {
  readonly instrumentIdentity: IVInstrumentIdentityMpart;
  readonly date: string;
  readonly targetPrice: string;
  readonly lastPrice: string;
  readonly pointToTargetPrice: string;
  readonly percentToTargetPrice: string;
  readonly completePercent: string;
}

@Injectable()
export class VInstrumentAlertModel extends VModelX<IDInstrumentAlertModel> implements IVInstrumentAlertModel {
  public instrumentIdentity = new VInstrumentIdentityMpart(() => this.domain.dto.Instrument);

  @computed
  public get date() {
    return Formatter.date(this.domain.dto.ExerciseDate, { pattern: 'default' });
  }

  @computed
  public get targetPrice() {
    return Formatter.currency(this.domain.dto.TargetPrice, {
      symbol: this.domain.instrumentType.symbol, priceStep: this.domain.priceStep, signed: false,
    });
  }

  @computed
  public get lastPrice() {
    return Formatter.currency(this.domain.dto.Instrument.LastPrice, {
      symbol: this.domain.instrumentType.symbol, priceStep: this.domain.priceStep, signed: false,
    });
  }

  @computed
  public get pointToTargetPrice() {
    return Formatter.currency(this.domain.dto.PointToTargetPrice, {
      symbol: this.domain.instrumentType.symbol, priceStep: this.domain.priceStep, signed: false,
    });
  }

  @computed
  public get percentToTargetPrice() {
    return Formatter.currency(this.domain.percentToTargetPrice, { symbol: '%', signed: false });
  }

  @computed
  public get completePercent() {
    return Formatter.currency(this.domain.completePercent, { symbol: '%', signed: false });
  }

  constructor(dtoLV: ILambda<IDInstrumentAlertModel>) {
    super(dtoLV);
    makeObservable(this);
  }
}
