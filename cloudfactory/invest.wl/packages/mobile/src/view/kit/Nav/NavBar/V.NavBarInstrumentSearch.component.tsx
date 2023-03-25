import { IoC } from '@invest.wl/core';
import { EVInstrumentScreen, IVRouterService, VRouterServiceTid } from '@invest.wl/view';
import { observer } from 'mobx-react';
import React from 'react';

import { IVNavBarIconProps, VNavBarIcon } from './V.NavBarIcon.component';

@observer
export class VNavBarInstrumentSearch extends React.Component<Partial<IVNavBarIconProps>> {
  private _navigation = IoC.get<IVRouterService>(VRouterServiceTid);

  public render() {
    return (
      <VNavBarIcon name={'search'} onPress={this._onPress} {...this.props} />
    );
  }

  private _onPress = () => this._navigation.navigateTo(EVInstrumentScreen.InstrumentSearch);
}
