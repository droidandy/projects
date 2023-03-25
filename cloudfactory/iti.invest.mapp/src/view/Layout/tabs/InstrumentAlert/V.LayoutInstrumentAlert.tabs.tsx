import React from 'react';
import { observer } from 'mobx-react';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import {
  createHeaderTabBar, IVTabsRouteItem, VContainer, VContent, VNavBar, VStatusBar,
} from '@invest.wl/mobile/src/view/kit';
import { DimensionsWidth } from '@invest.wl/mobile/src/view/Theme';
import { EVInstrumentAlertScreen } from '@invest.wl/view/src/InstrumentAlert/V.InstrumentAlert.types';
import { EDInstrumentAlertStatus } from '@invest.wl/core/src/dto/InstrumentAlert';
import { shadowStyle } from '@invest.wl/mobile/src/view/util/style.util';
import { IoC } from '@invest.wl/core';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
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
        <VStatusBar translucent />
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
