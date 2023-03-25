import React from 'react';
import { observer } from 'mobx-react';
import { IDInstrumentQuoteListCaseProps } from '@invest.wl/domain/src/Instrument/case/D.InstrumentQuoteList.case';
import {
  createHeaderTabBar, IVTabsRouteItem, VContainer, VContent, VNavBar, VStatusBar,
} from '@invest.wl/mobile/src/view/kit';
import {
  EVInstrumentScreen, IVInstrumentQuoteListPresentProps,
} from '@invest.wl/view/src/Instrument/V.Instrument.types';
import { EDInstrumentQuoteType } from '@invest.wl/core/src/dto/Instrument';
import { shadowStyle } from '@invest.wl/mobile/src/view/util/style.util';
import { IoC } from '@invest.wl/core';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VInstrumentQuoteListTab } from '../../../Instrument';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import { IVLayoutScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';

export interface IVLayoutQuoteTabsProps extends IDInstrumentQuoteListCaseProps {
}

const QuoteTabs = createHeaderTabBar({ swipeEnabled: true });

@mapScreenPropsToProps
@observer
export class VLayoutQuoteTabs extends React.Component<IVLayoutQuoteTabsProps & IVLayoutScreenProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  private routes: IVTabsRouteItem<IVInstrumentQuoteListPresentProps>[] = [{
    name: EVInstrumentScreen.InstrumentQuoteFavorite, screen: VInstrumentQuoteListTab,
    props: { type: EDInstrumentQuoteType.User }, title: 'Избранное',
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
    const { space } = this.theme;

    return (
      <VContainer>
        <VStatusBar />
        <VNavBar {...(shadow ? shadowStyle(0) : undefined)}>
          {this.props.inFocus && <VNavBar.InstrumentAlertLeft />}
          <VNavBar.Title text={'Котировки'} />
          <VNavBar.InstrumentSearch />
        </VNavBar>
        <VContent noScroll footerTabs mt={space.lg}>
          <QuoteTabs routes={this.routes} itemWidthMin={120} mb={space.lg} {...shadow} />
        </VContent>
      </VContainer>
    );
  }
}
