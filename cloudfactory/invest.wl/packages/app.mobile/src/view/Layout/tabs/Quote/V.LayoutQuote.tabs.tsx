import { EDInstrumentQuoteType, IoC } from '@invest.wl/core';
import { IDInstrumentQuoteListCaseProps } from '@invest.wl/domain/src/Instrument/case/D.InstrumentQuoteList.case';
import { createHeaderTabBar, IVTabsRouteItem, mapScreenPropsToProps, shadowStyle, VContainer, VContent, VNavBar, VStatusBar } from '@invest.wl/mobile';
import { EVInstrumentScreen, IVInstrumentQuoteListPresentProps } from '@invest.wl/view/src/Instrument/V.Instrument.types';
import { IVLayoutScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { observer } from 'mobx-react';
import React from 'react';
import { VInstrumentQuoteListTab } from '../../../Instrument';

export interface IVLayoutQuoteTabsProps extends IDInstrumentQuoteListCaseProps {
}

const QuoteTabs = createHeaderTabBar({ swipeEnabled: true });

@mapScreenPropsToProps
@observer
export class VLayoutQuoteTabs extends React.Component<IVLayoutQuoteTabsProps & IVLayoutScreenProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  private routes: IVTabsRouteItem<IVInstrumentQuoteListPresentProps>[] = [{
    name: EVInstrumentScreen.InstrumentQuoteFavorite, screen: VInstrumentQuoteListTab,
    props: { type: EDInstrumentQuoteType.User }, icon: 'favorites',
  }, {
    name: EVInstrumentScreen.InstrumentQuoteStock, screen: VInstrumentQuoteListTab,
    props: { type: EDInstrumentQuoteType.BlueChips }, title: 'Акции',
  }, {
    name: EVInstrumentScreen.InstrumentQuoteBond, screen: VInstrumentQuoteListTab,
    props: { type: EDInstrumentQuoteType.RubleBond }, title: 'Облигации',
  }, {
    name: EVInstrumentScreen.InstrumentQuoteFund, screen: VInstrumentQuoteListTab,
    props: { type: EDInstrumentQuoteType.ETF }, title: 'Фонды',
  }, {
    name: EVInstrumentScreen.InstrumentQuoteFutures, screen: VInstrumentQuoteListTab,
    props: { type: EDInstrumentQuoteType.Future }, title: 'Фьючерсы',
  }, {
    name: EVInstrumentScreen.InstrumentQuoteCurrency, screen: VInstrumentQuoteListTab,
    props: { type: EDInstrumentQuoteType.Currency }, title: 'Валюта',
  }, {
    //   name: EVInstrumentScreen.InstrumentQuotePlacement, screen: VInstrumentQuoteListScreen,
    //   props: { Type: EDInstrumentQuoteType.Customer }, title: 'Размещения',
    // }, {
    name: EVInstrumentScreen.InstrumentQuoteIndex, screen: VInstrumentQuoteListTab,
    props: { type: EDInstrumentQuoteType.WorldIndex }, title: 'Индексы',
  }];

  public render() {
    const shadow = this.theme.kit.NavBar.shadow;

    return (
      <VContainer>
        <VStatusBar />
        <VNavBar {...(shadow ? shadowStyle(0) : undefined)}>
          {this.props.inFocus && <VNavBar.InstrumentAlertLeft />}
          <VNavBar.Title text={'Котировки'} />
          <VNavBar.InstrumentSearch />
        </VNavBar>
        <VContent noScroll footerTabs>
          <QuoteTabs routes={this.routes} {...shadow} />
        </VContent>
      </VContainer>
    );
  }
}
