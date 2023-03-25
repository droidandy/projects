import React from 'react';
import { observer } from 'mobx-react';
import { computed, makeObservable } from 'mobx';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import {
  IVInstrumentPresentProps, VInstrumentPresent, VInstrumentPresentTid,
} from '@invest.wl/view/src/Instrument/present/V.Instrument.present';
import {
  VChartLine, VCol, VContainer, VContent, VNavBar, VSelect, VStatusBar, VStub,
} from '@invest.wl/mobile/src/view/kit';
import { VInstrumentSummary } from '../../component/V.InstrumentSummary.component';
import { VInstrumentMarketStat } from '../../component/V.InstrumentMarketStat.component';
import { VInstrumentPortfelPLByAccountList } from '../../component/V.InstrumentPortfelPLByAccountList.component';
import { VInstrumentChartLine } from '../../component/V.InstrumentChartLine.component';
import { VOrderCreateButtons } from '../../../Order/component/V.OrderCreateButtons.component';
import { VInstrumentAlertCreateModal } from '../../../InstrumentAlert/component/V.InstrumentAlertCreate.modal';
import { IVLayoutScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import { IVSelectData } from '@invest.wl/mobile/src/view/kit/Input/Select/V.Select.types';
import { IVDatePeriodModel } from '@invest.wl/view/src/Date/model/V.DatePeriod.model';
import {
  VPortfelOfInstrumentPresent, VPortfelOfInstrumentPresentTid,
} from '@invest.wl/view/src/Portfel/present/V.PortfelOfInstrument.present';
import { EDPortfelGroup } from '@invest.wl/core';
import {
  VInstrumentAlertCreatePresent,
  VInstrumentAlertCreatePresentTid,
} from '@invest.wl/view/src/InstrumentAlert/present/V.InstrumentAlertCreate.present';

export interface IVInstrumentScreenProps extends IVInstrumentPresentProps {
}

@mapScreenPropsToProps
@observer
export class VInstrumentScreen extends React.Component<IVInstrumentScreenProps & IVLayoutScreenProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _pr = IoC.get<VInstrumentPresent>(VInstrumentPresentTid);
  private _portfelPr = IoC.get<VPortfelOfInstrumentPresent>(VPortfelOfInstrumentPresentTid);
  private _alertPr = IoC.get<VInstrumentAlertCreatePresent>(VInstrumentAlertCreatePresentTid);

  @computed
  private get _selectList(): IVSelectData<IVDatePeriodModel> {
    return this._pr.marketHistoryPeriodList.map(p => ({ name: p.abbr, value: p }));
  }

  constructor(props: IVInstrumentScreenProps & IVLayoutScreenProps) {
    super(props);
    makeObservable(this);
  }

  public componentDidMount() {
    this._pr.init(this.props);
    this._portfelPr.init({ cid: this.props.cid, groupList: [EDPortfelGroup.AccountId] });
    this._alertPr.init({ cid: this.props.cid });
  }

  public componentWillUnmount() {
    this._portfelPr.dispose();
    this._alertPr.dispose();
  }

  public render() {
    const { inFocus } = this.props;
    const { instrumentSummaryX } = this._pr;

    return (
      <VContainer>
        <VStatusBar translucent />
        <VNavBar>
          <VNavBar.Back />
        </VNavBar>
        <VContent>
          <VStub mapXList={[instrumentSummaryX]} inFocus={inFocus}>
            {() => this.contentRender}
          </VStub>
        </VContent>
      </VContainer>
    );
  }

  @computed
  private get contentRender() {
    const { instrumentSummaryX, favoritePr } = this._pr;
    const { setModel, createModal, hasCompleted, create, dismiss } = this._alertPr;
    const { plGroupListX, accountActiveIndex, accountActiveSet } = this._portfelPr;
    const { space } = this.theme;

    return (
      <VCol>
        <VInstrumentSummary ph={space.lg} mb={space.lg} model={instrumentSummaryX.model!} alertHas={hasCompleted}
          onPressAlert={createModal.open} onPressFavorite={favoritePr.toggle} />
        {this._chartRender}
        <VOrderCreateButtons ph={space.lg} mb={space.lg} summary={instrumentSummaryX.model!} exchangeShow />
        {!!plGroupListX.model?.groupX.innerX?.list.length && (
          <VInstrumentPortfelPLByAccountList ph={space.lg} mb={space.lg} mh={-space.lg} list={plGroupListX.model.groupX.innerX.list}
            activeIndex={accountActiveIndex} activeSet={accountActiveSet} />
        )}
        <VInstrumentMarketStat ph={space.lg} model={instrumentSummaryX.model!} />
        <VInstrumentAlertCreateModal ph={space.lg}  alert={setModel} model={createModal}
          onCreate={create} onClose={dismiss} />
      </VCol>
    );
  }

  @computed
  private get _chartRender() {
    const { marketHistoryListX, periodSelected, periodSelect } = this._pr;
    const { space } = this.theme;

    return (
      <VContent mb={space.lg} pv={space.lg}>
        <VCol height={VChartLine.height}>
          <VStub mapXList={[marketHistoryListX]} inFocus={this.props.inFocus} errorIgnore>
            {() => <VInstrumentChartLine model={marketHistoryListX.model!} />}
          </VStub>
        </VCol>
        <VSelect.Tag alignSelf={'center'} mt={space.lg} width={'80%'}
          data={this._selectList} selected={periodSelected} onChange={periodSelect} />
      </VContent>
    );
  };
}
