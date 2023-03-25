import { IoC } from '@invest.wl/core';

import { mapScreenPropsToProps, VButton, VCol, VContainer, VContent, VInputField, VNavBar, VStatusBar, VText } from '@invest.wl/mobile';
import {
  IVAuthSigninCredPresent,
  IVAuthSigninCredPresentProps,
  VAuthSigninCredPresentTid,
} from '@invest.wl/view/src/Auth/present/SigninCred/V.AuthSigninCred.types';
import { EVAuthScreen } from '@invest.wl/view/src/Auth/V.Auth.types';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { EVSecurityScreen } from '@invest.wl/view/src/Security/V.Security.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVAuthSigninCredScreenProps extends IVAuthSigninCredPresentProps {
}

@mapScreenPropsToProps
@observer
export class VAuthSigninCredScreen extends React.Component<IVAuthSigninCredScreenProps> {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _pr = IoC.get<IVAuthSigninCredPresent>(VAuthSigninCredPresentTid);
  private _router = IoC.get<IVRouterService>(VRouterServiceTid);

  public async componentDidMount() {
    await this._pr.init(this.props);
  }

  public render() {
    const pr = this._pr;
    const { color, space } = this._theme;
    const { login, password } = pr.model.fields;

    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          <VNavBar.Back />
          <VNavBar.Title text={'Вход в приложение'} />
        </VNavBar>
        <VContent pa={space.lg} bg={color.bg}>
          <VText font={'body4'} ta={'center'} mt={space.xl}>
            {'Введите логин и пароль\nдля входа в приложение'}
          </VText>

          <VInputField mt={'xl'} error={login.displayErrors} label={'Логин'}>
            <VInputField.Input autoCapitalize={'none'} value={login.value} {...login.inputEvents} />
          </VInputField>

          <VInputField error={password.displayErrors} label={'Пароль'} type={'password'}>
            <VInputField.Input value={password.value} onSubmitEditing={this._signin} {...password.inputEvents} />
          </VInputField>

          <VCol flex />
          <VButton.Fill onPress={this._signin} color={color.primary2} disabled={!pr.model.isValid} mt={space.lg}>
            ВОЙТИ
          </VButton.Fill>
          <VButton.Stroke mt={space.lg} color={color.accent1} onPress={this._passwordRestore}>ВОССТАНОВИТЬ
            ПАРОЛЬ</VButton.Stroke>
        </VContent>
      </VContainer>
    );
  }

  private _signin = async () => {
    await this._pr.signin();
    this._router.navigateTo(EVSecurityScreen.SecurityAccessCode);
  };
  private _passwordRestore = () => this._router.navigateTo(EVAuthScreen.AuthPasswordRestore);
}
