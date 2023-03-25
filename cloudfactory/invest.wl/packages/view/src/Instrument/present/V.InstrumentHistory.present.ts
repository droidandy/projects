import { MapX } from '@invest.wl/common';
import { EDInstrumentMarketHistoryMode, Inject, Injectable, Newable } from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';
import { IVDatePeriodModel, VDatePeriodModel } from '../../Date/model/V.DatePeriod.model';
import {
  VInstrumentMarketHistoryModel, VInstrumentMarketHistoryModelTid,
} from '../model/V.InstrumentMarketHistory.model';
import { VInstrumentSummaryModel, VInstrumentSummaryModelTid } from '../model/V.InstrumentSummary.model';
import {
  DInstrumentHistoryCase, DInstrumentHistoryCaseTid, IDInstrumentHistoryCaseProps,
} from '@invest.wl/domain/src/Instrument/case/D.InstrumentHistory.case';

export const VInstrumentHistoryPresentTid = Symbol.for('VInstrumentHistoryPresentTid');

export interface IVInstrumentHistoryPresentProps extends Partial<Pick<IDInstrumentHistoryCaseProps, 'mode'>>, Omit<IDInstrumentHistoryCaseProps, 'mode'> {
}

@Injectable()
export class VInstrumentHistoryPresent {
  @observable public props?: IVInstrumentHistoryPresentProps;

  @computed
  public get marketHistoryPeriodList() {
    return this.cse.marketHistoryPeriodList.map(p => new VDatePeriodModel(p));
  }

  @computed
  public get periodSelected() {
    return new VDatePeriodModel(this.cse.periodSelected);
  }

  public instrumentSummaryX = new MapX.V(
    this.cse.summaryX.source,
    () => this.cse.summaryX.model,
    (m) => new this.modelSummary(m));

  public marketHistoryListX = new MapX.V(
    this.cse.marketHistoryListX.source,
    () => this.cse.marketHistoryListX.list[0],
    (m) => new this.modelMarketHistory(m));

  constructor(
    @Inject(DInstrumentHistoryCaseTid) public cse: DInstrumentHistoryCase,
    @Inject(VInstrumentSummaryModelTid) protected modelSummary: Newable<typeof VInstrumentSummaryModel>,
    @Inject(VInstrumentMarketHistoryModelTid) protected modelMarketHistory: Newable<typeof VInstrumentMarketHistoryModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVInstrumentHistoryPresentProps) {
    this.props = props;
    this.cse.init({ ...props, mode: EDInstrumentMarketHistoryMode.Duration });
  }

  public periodSelect = (period: IVDatePeriodModel) => this.cse.periodSelect(period.domain);
}
