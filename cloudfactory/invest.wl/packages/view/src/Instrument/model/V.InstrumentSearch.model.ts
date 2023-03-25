import { Formatter, ILambda, IVModelX, VModelX } from '@invest.wl/common';
import { Injectable } from '@invest.wl/core';
import { IDInstrumentSearchModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVInstrumentIdentityMpart, VInstrumentIdentityMpart } from '../mpart/V.InstrumentIdentity.mpart';
import { IVInstrumentInfoMpart, VInstrumentInfoMpart } from '../mpart/V.InstrumentInfo.mpart';

export const VInstrumentSearchModelTid = Symbol.for('VInstrumentSearchModelTid');

export interface IVInstrumentSearchModel extends IVModelX<IDInstrumentSearchModel> {
  readonly identity: IVInstrumentIdentityMpart;
  readonly info: IVInstrumentInfoMpart;
  readonly date: string;
  readonly maturity?: string;
}

@Injectable()
export class VInstrumentSearchModel extends VModelX<IDInstrumentSearchModel> implements IVInstrumentSearchModel {
  public identity = new VInstrumentIdentityMpart(() => this.domain.dto);
  public info = new VInstrumentInfoMpart(() => this.domain.dto);

  @computed
  public get maturity() {
    const { Perpetual, MaturityDate } = this.domain.dto;
    if (this.info.isBond && Perpetual === 1) return 'бессрочная';
    const date = MaturityDate ? Formatter.date(MaturityDate, { pattern: 'date' }) : '';
    return date ? `погашение: ${date}` : undefined;
  }

  public date = '';

  constructor(dtoLV: ILambda<IDInstrumentSearchModel>) {
    super(dtoLV);
    makeObservable(this);
  }
}
