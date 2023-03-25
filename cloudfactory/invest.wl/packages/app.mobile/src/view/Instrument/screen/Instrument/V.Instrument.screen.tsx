import { EDPortfelGroup, IoC } from '@invest.wl/core';
import {
  IVSelectData, mapScreenPropsToProps, VCard, VChartLine, VCol, VContainer, VContent, VNavBar, VSelect, VStatusBar,
  VStub,
} from '@invest.wl/mobile';
import { IVDatePeriodModel } from '@invest.wl/view/src/Date/model/V.DatePeriod.model';
import {
  IVInstrumentPresentProps, VInstrumentPresent, VInstrumentPresentTid,
} from '@invest.wl/view/src/Instrument/present/V.Instrument.present';
import {
  VInstrumentAlertCreatePresent, VInstrumentAlertCreatePresentTid,
} from '@invest.wl/view/src/InstrumentAlert/present/V.InstrumentAlertCreate.present';
import { IVLayoutScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import {
  VPortfelOfInstrumentPresent, VPortfelOfInstrumentPresentTid,
} from '@invest.wl/view/src/Portfel/present/V.PortfelOfInstrument.present';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { VInstrumentAlertCreateModal } from '../../../InstrumentAlert/component/V.InstrumentAlertCreate.modal';
import { VOrderCreateButtons } from '../../../Order/component/V.OrderCreateButtons.component';
import { VInstrumentChartLine } from '../../component/V.InstrumentChartLine.component';
import { VInstrumentMarketStat } from '../../component/V.InstrumentMarketStat.component';
import { VInstrumentPortfelPLByAccountList } from '../../component/V.InstrumentPortfelPLByAccountList.component';
import { VInstrumentSummary } from '../../component/V.InstrumentSummary.component';
import {
  VInstrumentHistoryPresent, VInstrumentHistoryPresentTid,
} from '@invest.wl/view/src/Instrument/present/V.InstrumentHistory.present';

export interface IVInstrumentScreenProps extends IVInstrumentPresentProps {
}

@mapScreenPropsToProps
@observer
export class VInstrumentScreen extends React.Component<IVInstrumentScreenProps & IVLayoutScreenProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _pr = IoC.get<VInstrumentPresent>(VInstrumentPresentTid);
  private _historyPr = IoC.get<VInstrumentHistoryPresent>(VInstrumentHistoryPresentTid);
  private _portfelPr = IoC.get<VPortfelOfInstrumentPresent>(VPortfelOfInstrumentPresentTid);
  private _alertPr = IoC.get<VInstrumentAlertCreatePresent>(VInstrumentAlertCreatePresentTid);

  @computed
  private get _selectList(): IVSelectData<IVDatePeriodModel> {
    return this._historyPr.marketHistoryPeriodList.map(p => ({ name: p.abbr, value: p }));
  }

  constructor(props: IVInstrumentScreenProps & IVLayoutScreenProps) {
    super(props);
    makeObservable(this);
  }

  public componentDidMount() {
    this._pr.init(this.props);
    this._historyPr.init(this.props);
    this._portfelPr.init({ cid: this.props.cid, groupList: [EDPortfelGroup.AccountId] });
    this._alertPr.init({ cid: this.props.cid });
  }

  public componentWillUnmount() {
    this._portfelPr.dispose();
    this._alertPr.dispose();
  }

  public render() {
    const { inFocus } = this.props;
    const { summaryX } = this._pr;

    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          <VNavBar.Back />
          <VNavBar.Title text={'Инструмент'} />
        </VNavBar>
        <VContent pa={this.theme.space.lg}>
          <VStub mapXList={[summaryX]} inFocus={inFocus}>
            {() => this.contentRender}
          </VStub>
        </VContent>
      </VContainer>
    );
  }

  @computed
  private get contentRender() {
    const { summaryX, favoritePr } = this._pr;
    const { setModel, createModal, hasCompleted, create, dismiss } = this._alertPr;
    const { plGroupListX, accountActiveIndex, accountActiveSet } = this._portfelPr;
    const { space } = this.theme;

    return (
      <VCol>
        <VInstrumentSummary mb={space.lg} model={summaryX.model!} alertHas={hasCompleted}
          onPressAlert={createModal.open} onPressFavorite={favoritePr.toggle} />
        {this._chartRender}
        <VOrderCreateButtons mb={space.lg} cid={this.props.cid} exchangeShow />
        {!!plGroupListX.model?.groupX.innerX?.list.length && (
          <VInstrumentPortfelPLByAccountList mb={space.lg} mh={-space.lg} list={plGroupListX.model.groupX.innerX.list}
            activeIndex={accountActiveIndex} activeSet={accountActiveSet} />
        )}
        <VInstrumentMarketStat ph={space.lg} model={summaryX.model!} />
        <VInstrumentAlertCreateModal alert={setModel} model={createModal}
          onCreate={create} onClose={dismiss} />
      </VCol>
    );
  }

  @computed
  private get _chartRender() {
    const { marketHistoryListX, periodSelected, periodSelect } = this._historyPr;
    const { space } = this.theme;

    return (
      <VCard mb={space.lg} pv={space.lg}>
        <VCol height={VChartLine.height}>
          <VStub mapXList={[marketHistoryListX]} inFocus={this.props.inFocus} errorIgnore>
            {() => <VInstrumentChartLine model={marketHistoryListX.model!} />}
          </VStub>
        </VCol>
        <VSelect.Tag alignSelf={'center'} mt={space.lg} width={'80%'}
          data={this._selectList} selected={periodSelected} onChange={periodSelect} />
      </VCard>
    );
  };
}
