import { observer } from 'mobx-react';
import React from 'react';

import {
  VButton, VCol, VContainer, VContent, VInputField, VNavBar, VStatusBar, VText,
} from '@invest.wl/mobile/src/view/kit';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import {
  IVAuthSigninPresent, IVAuthSigninPresentProps, VAuthSigninPresentTid,
} from '@invest.wl/view/src/Auth/present/Signin/V.AuthSignin.types';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { EVAuthScreen } from '@invest.wl/view/src/Auth/V.Auth.types';
import { EDAuthPasswordType } from '@invest.wl/core';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';

export interface IVAuthSigninScreenProps extends IVAuthSigninPresentProps {
}

@mapScreenPropsToProps
@observer
export class VAuthSigninScreen extends React.Component<IVAuthSigninScreenProps> {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _pr = IoC.get<IVAuthSigninPresent>(VAuthSigninPresentTid);
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
            {'Введите логин и пароль\n' +
            'для входа в приложение'}
          </VText>

          <VInputField mt={'xl'} error={login.displayErrors} label={'Логин'}>
            <VInputField.Input autoCapitalize={'none'} value={login.value} {...login.inputEvents} />
          </VInputField>

          <VInputField error={password.displayErrors} label={'Пароль'} type={'password'}>
            <VInputField.Input value={password.value} onSubmitEditing={this._signin} {...password.inputEvents} />
          </VInputField>

          <VCol flex />
          <VButton.Fill onPress={this._signin} color={color.primary1} disabled={!pr.model.isValid}
            mt={20}>ВОЙТИ</VButton.Fill>
          <VButton.Stroke mt={space.lg} color={color.primary1}
            onPress={this._passwordRestore}>ВОССТАНОВИТЬ ПАРОЛЬ</VButton.Stroke>
        </VContent>
      </VContainer>
    );
  }

  private _passwordRestore = () => this._router.navigateTo(EVAuthScreen.AuthPasswordRestore);
  private _signin = async () => {
    const res = await this._pr.signin();
    this._router.resetTo(res.passwordType === EDAuthPasswordType.Temporary
      ? EVAuthScreen.AuthPasswordCreate : EVAuthScreen.AuthSmsConfirm, { present: this._pr });
  };
}
