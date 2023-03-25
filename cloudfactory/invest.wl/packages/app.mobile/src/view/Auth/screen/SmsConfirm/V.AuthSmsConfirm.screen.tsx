import { IoC } from '@invest.wl/core';
import {
  mapScreenPropsToProps,
  VButton,
  VCol,
  VContainer,
  VContent,
  VInputField,
  VNavBar,
  VStatusBar,
  VStubLoading,
  VText,
  VTouchable
} from '@invest.wl/mobile';
import { IVAuthSmsConfirmPresentProps } from '@invest.wl/view/src/Auth/V.Auth.types';
import { EVLayoutScreen } from '@invest.wl/view/src/Layout/V.Layout.types';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { EVSecurityScreen } from '@invest.wl/view/src/Security/V.Security.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVAuthSmsConfirmScreenProps extends IVAuthSmsConfirmPresentProps {
}

@mapScreenPropsToProps
@observer
export class VAuthSmsConfirmScreen extends React.Component<IVAuthSmsConfirmScreenProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private router = IoC.get<IVRouterService>(VRouterServiceTid);

  public render() {
    const { model, timer, caseSignin } = this.props.present;
    if (!model || !timer) return <VStubLoading />;

    const { color, space } = this.theme;
    const { code } = model;

    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          <VNavBar.LeftIcon name={'nav-back'} onPress={this._navBack} />
          <VNavBar.Title text={'Вход в приложение'} />
        </VNavBar>
        <VContent pa={20} bg={color.bg}>
          <VText font={'body4'} ta={'center'} mt={'xl'}>
            {'Введите СМС-код для продолжения'}
          </VText>

          <VInputField mt={'xl'} error={code.displayErrors} label={'СМС-код'}>
            <VInputField.Input autoFocus keyboardType={'number-pad'} value={code.value}
              maxLength={code.length} onSubmitEditing={this._confirm} {...code.inputEvents} />
          </VInputField>

          {!timer.domain.isEnded ? (
            <VText font={'body8'} ta={'center'} color={color.muted4}>
              {`Получить новый СМС-код можно\nчерез ${timer.timeToEnd}`}
            </VText>
          ) : (
            <VTouchable.Opacity onPress={caseSignin.codeResend}>
              <VText font={'body8'} ta={'center'} color={color.accent2}>{'Отправить новый СМС-код'}</VText>
            </VTouchable.Opacity>
          )}

          <VCol flex />
          <VButton.Fill mt={space.lg} color={color.primary2} onPress={this._confirm}>
            {'ВОЙТИ'}
          </VButton.Fill>
        </VContent>
      </VContainer>
    );
  }

  private _navBack = () => this.router.resetTo(EVLayoutScreen.LayoutEntry);
  private _confirm = async () => {
    await this.props.present.confirm();
    this.router.resetTo(EVSecurityScreen.SecurityAccessCode);
  };
}
