import { IoC } from '@invest.wl/core';
import { VContainer, VContent, VNavBar, VStatusBar, VStubEmpty, VSwitchField } from '@invest.wl/mobile';
import {
  IVSecuritySettingsPresentProps,
  VSecuritySettingsPresent,
  VSecuritySettingsPresentTid,
} from '@invest.wl/view/src/Security/present/V.SecuritySettings.present';
import { IVSecurityI18n, VSecurityI18nTid } from '@invest.wl/view/src/Security/V.Security.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVSecuritySettingsScreenProps extends IVSecuritySettingsPresentProps {
}

@observer
export class VSecuritySettingsScreen extends React.Component<IVSecuritySettingsScreenProps> {
  private pr = IoC.get<VSecuritySettingsPresent>(VSecuritySettingsPresentTid);
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _i18n = IoC.get<IVSecurityI18n>(VSecurityI18nTid);

  constructor(props: IVSecuritySettingsScreenProps) {
    super(props);
    makeObservable(this);
  }

  public componentDidMount() {
    this.pr.init(this.props);
  }

  public render() {
    const { cse: { accessCase, authSigninByBio, authSigninByBioSet } } = this.pr;

    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          <VNavBar.Back />
          <VNavBar.Title text={'Настройки'} />
        </VNavBar>
        <VContent footerTabs pv={this._theme.space.lg}>
          {this._isBiometry && (
            <VSwitchField ph={this._theme.space.lg}
              title={`Использовать ${this._i18n.biometry!.name}\nдля подтверждения входа`}
              value={authSigninByBio}
              onValueChange={authSigninByBioSet} />
          )}
          <VSwitchField ph={this._theme.space.lg}
            title={`Использовать ${this._securityTypeName}\nдля подтверждения заявки`}
            value={this._orderConfirmValueBy} onValueChange={this._orderConfirmValueBySet} />
          {!accessCase.biometryHas && <VStubEmpty>Биометрия недоступна</VStubEmpty>}
        </VContent>
      </VContainer>
    );
  }

  @computed
  private get _isBiometry() {
    return this.pr.cse.accessCase.biometryHas && !!this._i18n.biometry;
  }

  @computed
  private get _orderConfirmValueBy() {
    const { cse: { orderConfirmByBio, orderConfirmByCode } } = this.pr;
    return this._isBiometry ? orderConfirmByBio : orderConfirmByCode;
  }

  @computed
  private get _orderConfirmValueBySet() {
    const { cse: { orderConfirmByBioSet, orderConfirmByCodeSet } } = this.pr;
    return this._isBiometry ? orderConfirmByBioSet : orderConfirmByCodeSet;
  }

  @computed
  private get _securityTypeName() {
    return this._isBiometry ? this._i18n.biometry!.name : this._i18n.code.name;
  }
}
