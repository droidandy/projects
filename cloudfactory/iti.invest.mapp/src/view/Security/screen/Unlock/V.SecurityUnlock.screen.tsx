import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import {
  IVSecurityUnlockPresentProps, VSecurityUnlockPresent, VSecurityUnlockPresentTid,
} from '@invest.wl/view/src/Security/present/V.SecurityUnlock.present';
import {
  VButton, VCol, VContainer, VContent, VIcon, VImage, VNavBar, VStatusBar,
} from '@invest.wl/mobile/src/view/kit';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VSecurityCode } from '../../';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import {
  VCustomerAccountSelfPresent, VCustomerAccountSelfPresentTid,
} from '@invest.wl/view/src/Customer/present/V.CustomerAccountSelf.present';
import { IVSecurityI18n, VSecurityI18nTid } from '@invest.wl/view/src/Security/V.Security.types';

export interface IVSecurityUnlockScreenProps extends IVSecurityUnlockPresentProps {
}

@mapScreenPropsToProps
@observer
export class VSecurityUnlockScreen extends React.Component<IVSecurityUnlockScreenProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private pr = IoC.get<VSecurityUnlockPresent>(VSecurityUnlockPresentTid);
  private customerPr = IoC.get<VCustomerAccountSelfPresent>(VCustomerAccountSelfPresentTid);
  private _i18n = IoC.get<IVSecurityI18n>(VSecurityI18nTid);
  private _ref = React.createRef<VSecurityCode>();

  constructor(props: IVSecurityUnlockScreenProps) {
    super(props);
    makeObservable(this);
  }

  public componentDidMount() {
    this.pr.init({
      ...this.props, biometryText: this._i18n.biometry?.unlockText || '',
    });
  }

  public componentWillUnmount() {
    this.pr.dispose();
  }

  public render() {
    const pr = this.pr;
    const theme = this.theme;

    return (
      <VContainer>
        <VStatusBar translucent />
        <VNavBar>
          <VNavBar.RightText title={'ВЫЙТИ'} onPress={pr.cse.signOut} />
        </VNavBar>
        <VContent flex bg={theme.color.bg} alignItems={'center'}>
          <VCol flex />
          <VImage source={require('../../../../assets/image/minilogo.png')} resizeMode={'contain'} />
          <VCol flex />
          <VSecurityCode ref={this._ref} title={this.customerPr.welcome} buttonLeft={this.leftButtonRender}
            onFulfilled={this._unlock} />
          <VCol flex />
        </VContent>
      </VContainer>
    );
  }

  @computed
  private get leftButtonRender() {
    if (!this.pr.cse.biometryEnabled) return null;
    return (
      <VButton.Text>
        <VIcon name={this._i18n.biometry!.iconName} color={this.theme.color.muted3}
          fontSize={44} onPress={this.pr.biometryUnlock} />
      </VButton.Text>
    );
  }

  private _unlock = async (code: string) => {
    try {
      await this.pr.codeUnlock(code);
    } catch (e: any) {
      this._ref.current?.clear();
    }
  };
}
