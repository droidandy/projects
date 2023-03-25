import { IoC } from '@invest.wl/core';
import { DAuthCase, DAuthCaseTid, DInstrumentAlertStore, DInstrumentAlertStoreTid } from '@invest.wl/domain';
import { EVLayoutScreen, IVRouterService, VRouterServiceTid } from '@invest.wl/view';
import { observer } from 'mobx-react';
import React from 'react';
import { VCol } from '../../Layout';
import { VBadge } from '../../Output/Badge';

import { VNavBarIcon } from './V.NavBarIcon.component';

@observer
export class VNavBarInstrumentAlert extends React.Component {
  private _router = IoC.get<IVRouterService>(VRouterServiceTid);
  private _authCase = IoC.get<DAuthCase>(DAuthCaseTid);
  private _alertStore = IoC.get<DInstrumentAlertStore>(DInstrumentAlertStoreTid);

  public render() {
    if (!this._authCase.authenticated) {
      return null;
    }

    return (
      <VCol>
        <VNavBarIcon name={'notification'} onPress={this._onPress} {...this.props} />
        <VBadge absolute top={-8} right={-8} size={'sm'} value={this._alertStore.countX.model?.dto.value} pointerEvents={'none'} />
      </VCol>
    );
  }

  private _onPress = () => this._router.navigateTo(EVLayoutScreen.LayoutInstrumentAlertTabs);
}
