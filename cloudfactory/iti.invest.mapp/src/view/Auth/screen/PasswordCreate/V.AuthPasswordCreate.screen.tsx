import { observer } from 'mobx-react';
import React from 'react';

import {
  IVAuthPasswordCreatePresentProps, VAuthPasswordCreatePresent, VAuthPasswordCreatePresentTid,
} from '@invest.wl/view/src/Auth/present/V.AuthPasswordCreate.present';
import {
  VButton, VCol, VContainer, VContent, VInputField, VNavBar, VStatusBar, VText,
} from '@invest.wl/mobile/src/view/kit';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { EVAuthScreen, IVAuthSmsConfirmPresentProps } from '@invest.wl/view/src/Auth/V.Auth.types';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';

export interface IVAuthPasswordCreateScreenProps extends IVAuthPasswordCreatePresentProps, IVAuthSmsConfirmPresentProps {
}

@mapScreenPropsToProps
@observer
export class VAuthPasswordCreateScreen extends React.Component<IVAuthPasswordCreateScreenProps> {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _pr = IoC.get<VAuthPasswordCreatePresent>(VAuthPasswordCreatePresentTid);
  private _router = IoC.get<IVRouterService>(VRouterServiceTid);

  public async componentDidMount() {
    await this._pr.init(this.props);
  }

  public render() {
    const pr = this._pr;
    const theme = this._theme;
    const { password, passwordConfirm } = pr.model.fields;

    return (
      <VContainer>
        <VStatusBar translucent />
        <VNavBar>
          <VNavBar.Back />
          {/*<VNavBar.Title text={'Вход в приложение'} />*/}
        </VNavBar>
        <VContent pa={20} bg={theme.color.bg}>
          <VText font={'body4'} ta={'left'}>
            {'Введите постоянный пароль,\nкоторый будет использоваться\nдля входа в аккаунт'}
          </VText>

          <VInputField mt={'xl'} error={password.displayErrors} label={'Новый пароль'} type={'password'}>
            <VInputField.Input value={password.value} {...password.inputEvents} />
          </VInputField>

          <VInputField mt={'xs'} error={passwordConfirm.displayErrors} label={'Повторите пароль'} type={'password'}>
            <VInputField.Input value={passwordConfirm.value} {...passwordConfirm.inputEvents} />
          </VInputField>

          <VCol flex />
          <VButton.Fill mt={theme.space.lg} color={theme.color.accent1} onPress={this._create}>
            Сменить пароль
          </VButton.Fill>
        </VContent>
      </VContainer>
    );
  }

  private _create = async () => {
    await this._pr.create();
    this._router.resetTo(EVAuthScreen.AuthSmsConfirm, { present: this.props.present });
  };
}
