import { ToggleX } from '@invest.wl/common/src/reactive/ToggleX';
import { IoC } from '@invest.wl/core';
import { DSecurityCheckCase, DSecurityCheckCaseTid } from '@invest.wl/domain/src/Security/case/D.SecurityCheck.case';
import { VModalDialog } from '@invest.wl/mobile';
import { IVSecurityI18n, VSecurityI18nTid } from '@invest.wl/view/src/Security/V.Security.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { VSecurityCode } from '../V.SecurityCode.component';

export interface IVSecurityCheckProps {
  disableBiometry?: boolean;
  onUnlock(): void;
  onCancel(): void;
}

@observer
export class VSecurityCheck extends React.Component<IVSecurityCheckProps> {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _i18n = IoC.get<IVSecurityI18n>(VSecurityI18nTid);
  private _case = IoC.get<DSecurityCheckCase>(DSecurityCheckCaseTid);

  constructor(props: IVSecurityCheckProps) {
    super(props);
    makeObservable(this);
  }

  public async componentDidMount() {
    this.toggler.open();
    await this._case.init({ biometryText: `Для подтверждения ${this._i18n.biometry?.actionText}` }).then();
    if (this._isBiometryEnabled) this._biometryCheck().then();
  }

  public toggler = new ToggleX();
  @observable public isBusy = false;

  @computed
  private get _isBiometryEnabled() {
    return this._case.biometryAccessed && !this.props.disableBiometry;
  }

  public render() {
    const { space } = this._theme;

    return (
      <VModalDialog isVisible={this.toggler.isOpen} onClose={this._onClose}>
        {!this._isBiometryEnabled && (
          <VSecurityCode pa={space.lg} onFulfilled={this._onFullFilled} />
        )}
        {/* {this._case.biometryEnabled && !!biometry && ( */}
        {/*  <VCol justifyContent={'center'} alignItems={'center'}> */}
        {/*    <VText font={'title5'}>{biometry.name}</VText> */}
        {/*    <VIcon name={biometry.iconName} fontSize={40} /> */}
        {/*    <VText font={'body13'}>{biometry.actionText}</VText> */}
        {/*  </VCol> */}
        {/* )} */}
      </VModalDialog>
    );
  }

  private _biometryCheck = async () => {
    try {
      await this._case.biometryCheck();
      this.props.onUnlock();
    } finally {
      this.toggler.close();
      this.props.onCancel();
    }
  };

  private _onFullFilled = async (code: string) => {
    await this._case.codeCheck(code);
    this.toggler.close();
    this.props.onUnlock();
  };

  private _onClose = async () => {
    this.toggler.close();
    await this._case.biometryCheckCancel();
    this.props.onCancel();
  };
}
