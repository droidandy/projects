import { IoC } from '@invest.wl/core';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view';
import React from 'react';

import { IVNavBarIconProps, VNavBarIcon } from './V.NavBarIcon.component';

export class VNavBarBack extends React.Component<Partial<IVNavBarIconProps>> {
  private _navigation = IoC.get<IVRouterService>(VRouterServiceTid);

  public render() {
    if (!this._navigation.canGoBack()) return null;
    return (
      <VNavBarIcon onPress={this._onPress} name={'nav-back'} {...this.props} />
    );
  }

  private _onPress = () => this._navigation.back();
}
