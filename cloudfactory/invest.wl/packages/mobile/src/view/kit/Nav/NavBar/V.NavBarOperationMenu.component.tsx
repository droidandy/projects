import { IoC } from '@invest.wl/core';
import { DAuthCase, DAuthCaseTid } from '@invest.wl/domain';
import { EVLayoutScreen, IVRouterService, VRouterServiceTid } from '@invest.wl/view';
import { observer } from 'mobx-react';
import React from 'react';

import { IVNavBarIconProps, VNavBarIcon } from './V.NavBarIcon.component';

@observer
export class VNavBarOperationMenu extends React.Component<Partial<IVNavBarIconProps>> {
  private _navigation = IoC.get<IVRouterService>(VRouterServiceTid);
  private _authCase = IoC.get<DAuthCase>(DAuthCaseTid);

  public render() {
    if (!this._authCase.authenticated) return null;

    return (
      <VNavBarIcon name={'portfel'} onPress={this._onPress} {...this.props} />
    );
  }

  private _onPress = () => this._navigation.navigateTo(EVLayoutScreen.LayoutOperationMenu);
}
