import { Formatter, ILambda, IVModelX, VModelX } from '@invest.wl/common';
import { Injectable } from '@invest.wl/core';
import { IDInstrumentQuoteModel } from '@invest.wl/domain';
import isNumber from 'lodash/isNumber';
import { computed, makeObservable } from 'mobx';
import { IVInstrumentIdentityMpart, VInstrumentIdentityMpart } from '../mpart/V.InstrumentIdentity.mpart';
import { IVInstrumentInfoMpart, VInstrumentInfoMpart } from '../mpart/V.InstrumentInfo.mpart';

export const VInstrumentQuoteModelTid = Symbol.for('VInstrumentQuoteModelTid');

export interface IVInstrumentQuoteModel extends IVModelX<IDInstrumentQuoteModel> {
  readonly identity: IVInstrumentIdentityMpart;
  readonly info: IVInstrumentInfoMpart;
  readonly date: string;
  readonly maturity?: string;
}

@Injectable()
export class VInstrumentQuoteModel extends VModelX<IDInstrumentQuoteModel> implements IVInstrumentQuoteModel {
  public identity = new VInstrumentIdentityMpart(() => this.domain.dto);
  public info = new VInstrumentInfoMpart(() => this.domain.dto);

  @computed
  public get date() {
    return Formatter.date(this.domain.dto.Time, { pattern: 'D MMM, HH:mm', calendar: true });
  }

  @computed
  public get maturity() {
    if (!this.info.isBond) return;
    const { DaysToMaturity, MaturityDate } = this.domain.dto;
    if (isNumber(DaysToMaturity) && DaysToMaturity <= 0) return 'бессрочная';
    const date = MaturityDate ? Formatter.date(MaturityDate, { pattern: 'date' }) : '';
    return date ? `погашение: ${date}` : undefined;
  }

  constructor(dtoLV: ILambda<IDInstrumentQuoteModel>) {
    super(dtoLV);
    makeObservable(this);
  }
}
