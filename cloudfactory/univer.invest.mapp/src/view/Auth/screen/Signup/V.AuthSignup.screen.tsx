import { observer } from 'mobx-react';
import React from 'react';

import {
  IVAuthSignupPresentProps, VAuthSignupPresent, VAuthSignupPresentTid,
} from '@invest.wl/view/src/Auth/present/V.AuthSignup.present';
import {
  VButton, VCol, VContainer, VContent, VInputField, VNavBar, VStatusBar, VText,
} from '@invest.wl/mobile/src/view/kit';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { EVAuthScreen } from '@invest.wl/view/src/Auth/V.Auth.types';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';

@mapScreenPropsToProps
@observer
export class VAuthSignupScreen extends React.Component<IVAuthSignupPresentProps> {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _pr = IoC.get<VAuthSignupPresent>(VAuthSignupPresentTid);
  private _router = IoC.get<IVRouterService>(VRouterServiceTid);

  public async componentDidMount() {
    await this._pr.init(this.props);
  }

  public render() {
    const pr = this._pr;
    const theme = this._theme;
    const { fio, phone, email } = pr.model.fields;

    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          <VNavBar.Back />
          <VNavBar.Title text={'Регистрация'} />
        </VNavBar>
        <VContent pa={20} bg={theme.color.bg}>
          <VText font={'body4'} ta={'center'} mt={'xl'}>
            {'Заполните поля ниже, чтобы\nзарегистрироваться в приложении'}
          </VText>

          <VInputField mt={'xl'} error={fio.displayErrors} label={'Ф.И.О.'}>
            <VInputField.Input value={fio.value} {...fio.inputEvents} />
          </VInputField>

          <VInputField error={phone.displayErrors} label={'Телефон'}>
            <VInputField.Input value={phone.value} {...phone.inputEvents} />
          </VInputField>

          <VInputField error={email.displayErrors} label={'E-mail'}>
            <VInputField.Input value={email.value} {...email.inputEvents} />
          </VInputField>

          <VCol flex />
          <VButton.Fill mt={theme.space.lg} color={theme.color.primary2} onPress={this._signup}>
            ВОЙТИ
          </VButton.Fill>
          <VButton.Stroke mt={theme.space.lg} color={theme.color.accent1}
            onPress={this._passwordRestore}>ВОССТАНОВИТЬ</VButton.Stroke>
        </VContent>
      </VContainer>
    );
  }

  private _passwordRestore = () => this._router.navigateTo(EVAuthScreen.AuthPasswordRestore);
  private _signup = async () => {
    await this._pr.signup();
    this._router.resetTo(EVAuthScreen.AuthSignin);
  };
}
