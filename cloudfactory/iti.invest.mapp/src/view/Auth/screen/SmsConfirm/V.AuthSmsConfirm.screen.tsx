import { observer } from 'mobx-react';
import React from 'react';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import {
  VButton, VCol, VContainer, VContent, VInputField, VNavBar, VStatusBar, VStubLoading, VText, VTouchable,
} from '@invest.wl/mobile/src/view/kit';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { EVLayoutScreen } from '@invest.wl/view/src/Layout/V.Layout.types';
import { EVSecurityScreen } from '@invest.wl/view/src/Security/V.Security.types';
import { IVAuthSmsConfirmPresentProps } from '@invest.wl/view/src/Auth/V.Auth.types';

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
        <VStatusBar translucent />
        <VNavBar>
          <VNavBar.LeftIcon name={'nav-back'} onPress={this._navBack} />
          {/*<VNavBar.Title text={'Вход в приложение'} />*/}
        </VNavBar>
        <VContent pa={20} bg={color.bg}>
          <VText font={'body4'} ta={'left'}>
            {'Введите СМС-код для продолжения'}
          </VText>

          <VInputField mt={'xl'} error={code.displayErrors} label={'СМС-код'}>
            <VInputField.Input autoFocus keyboardType={'number-pad'} value={code.value}
              maxLength={code.length} onSubmitEditing={this._confirm} {...code.inputEvents} />
          </VInputField>

          {!timer.domain.isEnded ? (
            <VText font={'body8'} ta={'center'} color={color.text}>
              {`Получить новый СМС-код можно\nчерез ${timer.timeToEnd}`}
            </VText>
          ) : (
            <VTouchable.Opacity onPress={caseSignin.codeResend}>
              <VText font={'body8'} ta={'center'} color={color.accent1}>{'Отправить новый СМС-код'}</VText>
            </VTouchable.Opacity>
          )}

          <VCol flex />
          <VButton.Stroke mt={space.lg} color={color.accent1} onPress={this._confirm}>
            {'Войти'}
          </VButton.Stroke>
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
