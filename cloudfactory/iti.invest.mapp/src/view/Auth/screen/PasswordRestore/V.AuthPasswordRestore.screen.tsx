import { observer } from 'mobx-react';
import React from 'react';

import {
  IVAuthPasswordRestorePresentProps, VAuthPasswordRestorePresent, VAuthPasswordRestorePresentTid,
} from '@invest.wl/view/src/Auth/present/V.AuthPasswordRestore.present';
import {
  VButton, VCol, VContainer, VContent, VInputField, VNavBar, VStatusBar, VText,
} from '@invest.wl/mobile/src/view/kit';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { EVAuthScreen } from '@invest.wl/view/src/Auth/V.Auth.types';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';

export interface IVAuthPasswordRestoreScreenProps extends IVAuthPasswordRestorePresentProps {
}

@mapScreenPropsToProps
@observer
export class VAuthPasswordRestoreScreen extends React.Component<IVAuthPasswordRestoreScreenProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private pr = IoC.get<VAuthPasswordRestorePresent>(VAuthPasswordRestorePresentTid);
  private router = IoC.get<IVRouterService>(VRouterServiceTid);

  public async componentDidMount() {
    await this.pr.init(this.props);
  }

  public render() {
    const pr = this.pr;
    const theme = this.theme;
    const { fioEmail, serial, num } = pr.model.fields;

    return (
      <VContainer>
        <VStatusBar translucent />
        <VNavBar>
          <VNavBar.Back />
          {/*<VNavBar.Title text={'Восстановление пароля'} />*/}
        </VNavBar>
        <VContent pa={20} bg={theme.color.bg}>
          <VText font={'body4'} ta={'left'}>
            {'Заполните поля ниже'}
          </VText>

          <VInputField mt={'xl'} error={fioEmail.displayErrors} label={'Логин или e-mail'}>
            <VInputField.Input value={fioEmail.value} {...fioEmail.inputEvents} />
          </VInputField>

          <VInputField error={serial.displayErrors} label={'Серия паспорта'}>
            <VInputField.Input value={serial.value} {...serial.inputEvents} />
            <VInputField.Mask {...serial.maskOptions} />
          </VInputField>

          <VInputField error={num.displayErrors} label={'Номер паспорта'}>
            <VInputField.Input value={num.value} {...num.inputEvents} />
            <VInputField.Mask {...num.maskOptions} />
          </VInputField>

          <VCol flex />
          <VButton.Fill mt={theme.space.lg} color={theme.color.accent1} onPress={this._restore}>
            Отправить
          </VButton.Fill>
        </VContent>
      </VContainer>
    );
  }

  private _restore = async () => {
    await this.pr.restore();
    this.router.navigateTo(EVAuthScreen.AuthSignin);
  };
}
