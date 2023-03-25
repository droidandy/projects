import { EDInstrumentAlertStatus, IoC } from '@invest.wl/core';
import {
  createHeaderTabBar,
  DimensionsWidth,
  IVTabsRouteItem,
  mapScreenPropsToProps,
  shadowStyle,
  VContainer,
  VContent,
  VNavBar,
  VStatusBar
} from '@invest.wl/mobile';
import { EVInstrumentAlertScreen } from '@invest.wl/view/src/InstrumentAlert/V.InstrumentAlert.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { observer } from 'mobx-react';
import React from 'react';
import { IVInstrumentAlertListTabProps, VInstrumentAlertListTab } from '../../../InstrumentAlert/tab/V.InstrumentAlertList.tab';

const InstrumentAlertTabs = createHeaderTabBar();

export interface IVInstrumentAlertTabsScreenProps {
}

@mapScreenPropsToProps
@observer
export class VLayoutInstrumentAlertTabs extends React.Component<IVInstrumentAlertTabsScreenProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  private _routes: IVTabsRouteItem[] = [{
    name: EVInstrumentAlertScreen.InstrumentAlertActive, screen: VInstrumentAlertListTab, title: 'Активные',
    props: { status: EDInstrumentAlertStatus.Active } as IVInstrumentAlertListTabProps,
  }, {
    name: EVInstrumentAlertScreen.InstrumentAlertCompleted, screen: VInstrumentAlertListTab, title: 'Исполненные',
    props: { status: EDInstrumentAlertStatus.Completed } as IVInstrumentAlertListTabProps,
  }];

  public render() {
    const shadow = this.theme.kit.NavBar.shadow;

    return (
      <VContainer>
        <VStatusBar />
        <VNavBar {...(shadow ? shadowStyle(0) : undefined)}>
          <VNavBar.Back />
          <VNavBar.Title text={'Уведомления'} />
        </VNavBar>
        <VContent noScroll>
          <InstrumentAlertTabs itemWidthMin={DimensionsWidth * 0.49} routes={this._routes} {...shadow} />
        </VContent>
      </VContainer>
    );
  }
}
