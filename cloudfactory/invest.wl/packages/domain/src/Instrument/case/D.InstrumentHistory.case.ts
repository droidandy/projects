import { EDInstrumentMarketHistoryMode, IDInstrumentId, Inject, Injectable } from '@invest.wl/core';
import { action, makeObservable, observable } from 'mobx';
import { DDatePeriodModel, IDDatePeriodModel } from '../../Date/model/D.DatePeriod.model';
import { DInstrumentGateway, DInstrumentGatewayTid } from '../D.Instrument.gateway';
import { DInstrumentService, DInstrumentServiceTid } from '../D.Instrument.service';
import { DChartConfigTid, IDChartConfig } from '../../Chart';

export const DInstrumentHistoryCaseTid = Symbol.for('DInstrumentHistoryCaseTid');

export interface IDInstrumentHistoryCaseProps {
  mode: EDInstrumentMarketHistoryMode;
  cid: IDInstrumentId;
}

// TODO: use it in VInstrumentPresent & VInvestIdeaPresent
@Injectable()
export class DInstrumentHistoryCase {
  @observable.ref public props?: IDInstrumentHistoryCaseProps;
  @observable public marketHistoryPeriodList = this._chartCfg.linePeriodList.map(p => new DDatePeriodModel(p));
  @observable public periodSelected = this.marketHistoryPeriodList.find(p => p.unit === 'M3')!;

  public marketHistoryListX = this._gw.marketHistoryList({
    name: 'DInstrumentHistoryCase.marketHistoryListX', req: () => {
      const cid = this.summaryX.model?.dto.Instrument.id;
      if (!this.props || !cid?.isFull) return;
      return {
        mode: this.props.mode,
        gap: this._service.period2HistoryGap(this.periodSelected),
        dateTo: this.periodSelected.to.format('YYYY-MM-DD') + 'T23:59:59Z',
        dateFrom: this.periodSelected.from.format('YYYY-MM-DD') + 'T00:00:00Z',
        classCode: cid.classCode!, secureCode: cid.secureCode!,
      };
    },
  }, {
    period: () => this.periodSelected, instrumentSummary: () => this.summaryX.model,
  });

  public summaryX = this._gw.summary({
    name: 'DInstrumentHistoryCase.summaryX', req: () => this.props?.cid.toJSON(),
  });

  constructor(
    @Inject(DChartConfigTid) private _chartCfg: IDChartConfig,
    @Inject(DInstrumentGatewayTid) private _gw: DInstrumentGateway,
    @Inject(DInstrumentServiceTid) private _service: DInstrumentService,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDInstrumentHistoryCaseProps) {
    this.props = props;
  }

  @action
  public periodSelect(period: IDDatePeriodModel) {
    this.periodSelected = period;
  }
}
