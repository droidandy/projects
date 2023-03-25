import React from 'react';
import { observer } from 'mobx-react';
import { VInvestIdeaModel } from '@invest.wl/view/src/InvestIdea/model/V.InvestIdea.model';
import { VChartLine, VCol, VHyperlink, VSelect, VStub, VText } from '@invest.wl/mobile/src/view/kit';
import { VInvestIdeaItem } from './V.InvestIdeaItem.component';
import { VInvestIdeaMarketStat } from './V.InvestIdeaMarketStat.component';
import { VInstrumentMarketHistoryModel } from '@invest.wl/view/src/Instrument/model/V.InstrumentMarketHistory.model';
import { VInstrumentChartLine } from '../../Instrument/component/V.InstrumentChartLine.component';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { IVDatePeriodModel } from '@invest.wl/view/src/Date/model/V.DatePeriod.model';
import { computed, makeObservable } from 'mobx';
import { IVSelectData } from '@invest.wl/mobile/src/view/kit/Input/Select/V.Select.types';

export interface IVInvestIdeaProps {
  model: VInvestIdeaModel;
  historyModel?: VInstrumentMarketHistoryModel;
  periodList: IVDatePeriodModel[];
  periodSelected: IVDatePeriodModel;
  periodSelect(p: IVDatePeriodModel): void;
}

@observer
export class VInvestIdea extends React.Component<IVInvestIdeaProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVInvestIdeaProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get _selectList(): IVSelectData<IVDatePeriodModel> {
    return this.props.periodList.map(p => ({ name: p.abbr, value: p }));
  }

  public render() {
    const { model, historyModel, periodSelect, periodSelected } = this.props;
    const { space } = this.theme;

    return (
      <>
        <VInvestIdeaItem model={model} strategyShow={false} />
        <VCol pa={space.lg}>
          <VHyperlink markdown linkDefault>
            <VText font={'body13'}>{model.strategy}</VText>
          </VHyperlink>
        </VCol>
        <VInvestIdeaMarketStat model={model} />
        {!!model.instrumentIdentity && (
          <React.Fragment key={historyModel?.id}>
            <VCol height={VChartLine.height}>
              {!historyModel && <VStub.Empty />}
              {!!historyModel && <VInstrumentChartLine model={historyModel} />}
            </VCol>
            <VSelect.Tag alignSelf={'center'} mt={space.lg} width={'80%'}
              data={this._selectList} selected={periodSelected} onChange={periodSelect} />
          </React.Fragment>
        )}
      </>
    );
  }
}
