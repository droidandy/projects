import { IoC } from '@invest.wl/core';
import { VButton, VCol, VInputField, VText, VTouchable } from '@invest.wl/mobile';
import { ISConfigStore, SConfigStoreTid } from '@invest.wl/system/src/Config/S.Config.types';
import { IVAuthSignupWithAccountStepProps } from '@invest.wl/view/src/Auth/present/SignupWithAgreement/V.AuthSignupWithAgreement.types';
import { IVThemeStore, VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Linking } from 'react-native';

@observer
export class VAuthSignupCustomerPEP extends React.Component<IVAuthSignupWithAccountStepProps> {
  private _theme = IoC.get<IVThemeStore>(VThemeStoreTid);
  private _cfg = IoC.get<ISConfigStore>(SConfigStoreTid);

  constructor(props: IVAuthSignupWithAccountStepProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const { cse: { isConfirmed } } = this.props.present.customerCreatePr;
    return isConfirmed ? this._accountRender : this._signRender;
  }

  @computed
  private get _signRender() {
    const { color } = this._theme;
    const { code, timer, cse: { isBusy, confirm, codeResend } } = this.props.present.customerCreatePr;

    return (
      <VCol flex>
        <VText mb={'lg'} ta={'center'} font={'body7'}>Подтвердите свои данные и подпишите документ, введя
          СМС-код</VText>
        <VInputField label={'СМС-код'} error={code.displayErrors}>
          <VInputField.Input autoFocus keyboardType={'number-pad'}
            value={code.value} {...code.inputEvents} />
        </VInputField>

        {!timer.domain.isEnded ? (
          <VText font={'body6'} ta={'center'} color={color.muted4}>
            {`Получить новый СМС-код можно\nчерез ${timer.timeToEnd}`}
          </VText>
        ) : (
          <VTouchable.Opacity onPress={codeResend}>
            <VText font={'body6'} ta={'center'} color={color.accent2}>{'Отправить новый СМС-код'}</VText>
          </VTouchable.Opacity>
        )}

        <VCol flex />
        <VButton.Stroke mt={'lg'} onPress={this._agreementPepOpen}>
          {'Соглашение об использовании простой\nэлектронной подписи'}
        </VButton.Stroke>
        <VButton.Fill mt={'xl'} onPress={confirm} disabled={!code.isValid || isBusy}>
          Далее
        </VButton.Fill>
      </VCol>
    );
  }

  @computed
  private get _accountRender() {
    const { color } = this._theme;
    const { stepNext } = this.props.present;

    return (
      <VCol flex>
        <VCol flex justifyContent={'center'}>
          <VText font={'body4'} ta={'center'}>
            {'Поздравляем вы успещно прошли\nрегистрацию. Вам доступен личный\nкабинет клиента ВЕЛЕС Капитал'}
          </VText>
          <VText mt={'xl'} font={'body4'} ta={'center'} color={color.primary1}>
            {'Для открытия счета заполните\nАнкету'}
          </VText>
        </VCol>
        <VButton.Fill mt={'xl'} onPress={stepNext}>Заполнить</VButton.Fill>
      </VCol>
    );
  }

  private _agreementPepOpen = () => Linking.openURL(this._cfg.ownerAgreementPepLink || '');
}
