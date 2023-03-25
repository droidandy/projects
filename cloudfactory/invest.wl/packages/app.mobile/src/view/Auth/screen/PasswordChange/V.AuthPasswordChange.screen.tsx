import { IoC } from '@invest.wl/core';
import { mapScreenPropsToProps, VButton, VCol, VContainer, VContent, VImage, VInputField, VNavBar, VRow, VStatusBar, VText } from '@invest.wl/mobile';
import {
  IVAuthPasswordChangePresentProps,
  VAuthPasswordChangePresent,
  VAuthPasswordChangePresentTid,
} from '@invest.wl/view/src/Auth/present/V.AuthPasswordChange.present';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';

import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { VSecurityCheck } from '../../../Security/component/Check/V.SecurityCheck.component';

export interface IVAuthPasswordChangeScreenProps extends IVAuthPasswordChangePresentProps {
}

@mapScreenPropsToProps
@observer
export class VAuthPasswordChangeScreen extends React.Component<IVAuthPasswordChangeScreenProps> {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private pr = IoC.get<VAuthPasswordChangePresent>(VAuthPasswordChangePresentTid);
  private _router = IoC.get<IVRouterService>(VRouterServiceTid);

  constructor(props: IVAuthPasswordChangeScreenProps) {
    super(props);
    makeObservable(this);
  }

  @observable private _securityConfirmation = false;

  public componentDidMount() {
    this.pr.init(this.props);
  }

  public render() {
    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          <VNavBar.Back />
          <VNavBar.Title text={'Смена пароля'} />
        </VNavBar>
        <VContent pa={this._theme.space.lg}>
          {this._changePasswordRender}
          {this._securityUnlockRender}
        </VContent>
      </VContainer>
    );
  }

  @computed
  private get _changePasswordRender() {
    const pr = this.pr;
    const { space, color } = this._theme;
    const { passwordOld, password, passwordConfirm } = pr.model.fields;

    return (
      <>
        <VRow alignItems={'center'}>
          <VImage mr={space.md} source={require('../../../../assets/image/minilogo.png')} resizeMode={'contain'} />
          <VText font={'title2'}>Экспобанк</VText>
        </VRow>

        <VText font={'body9'} mt={space.xl}>{'Для смены пароля на новый заполните поля ниже'}</VText>

        <VInputField mt={space.md} error={passwordOld.displayErrors} label={'Старый пароль'} type={'password'}>
          <VInputField.Input value={passwordOld.value} {...passwordOld.inputEvents} />
        </VInputField>
        <VInputField error={password.displayErrors} label={'Новый пароль'} type={'password'}>
          <VInputField.Input value={password.value} {...password.inputEvents} />
        </VInputField>
        <VInputField error={passwordConfirm.displayErrors} label={'Новый пароль еще раз'} type={'password'}>
          <VInputField.Input value={passwordConfirm.value} {...passwordConfirm.inputEvents} />
        </VInputField>

        <VText font={'body19'} color={color.muted4} mt={'xl'} mr={space.xl}>
          Длина пароля от 8 до 50 {'\n'}{'\n'}
          Пароль должен содержать латинские буквы верхнего и нижнего регистра и как минимум одну цифру, не может
          содержать пробел
        </VText>

        <VCol flex />
        <VButton.Fill mt={space.lg} color={color.accent1} disabled={!pr.model.isValid}
          onPress={this._securityConfirmStart}>ДАЛЕЕ</VButton.Fill>
      </>
    );
  }

  @computed
  private get _securityUnlockRender() {
    if (!this._securityConfirmation) return null;
    return <VSecurityCheck onUnlock={this._onUnlock} onCancel={this._securityConfirmClose} />;
  }

  private _onUnlock = async () => {
    this._securityConfirmClose();
    await this.pr.change();
    this._router.back();
  };

  @action
  private _securityConfirmStart = () => this._securityConfirmation = true;

  @action
  private _securityConfirmClose = () => this._securityConfirmation = false;
}
