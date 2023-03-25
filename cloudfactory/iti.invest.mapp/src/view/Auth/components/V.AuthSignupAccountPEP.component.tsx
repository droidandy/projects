import React from 'react';
import { observer } from 'mobx-react';
import { VButton, VCol, VInputField, VText, VTouchable } from '@invest.wl/mobile/src/view/kit';
import { IoC } from '@invest.wl/core';
import { IVThemeStore, VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { IVAuthSignupWithAccountStepProps } from '@invest.wl/view/src/Auth/present/SignupWithAgreement/V.AuthSignupWithAgreement.types';

@observer
export class VAuthSignupAccountPEP extends React.Component<IVAuthSignupWithAccountStepProps> {
  private _theme = IoC.get<IVThemeStore>(VThemeStoreTid);

  public render() {
    const { color } = this._theme;
    const { agreementCreatePr: { code, timer, cse: { isBusy, codeResend } } } = this.props.present;

    return (
      <VCol flex>
        <VText mb={'lg'} ta={'center'} font={'body7'}>Подпишите сформированные документы с помощью СМС кода</VText>
        <VInputField label={'СМС-код'} error={code.displayErrors}>
          <VInputField.Input autoFocus keyboardType={'number-pad'}
            value={code.value} {...code.inputEvents} />
        </VInputField>

        {!timer.domain.isEnded ? (
          <VText font={'body6'} ta={'center'} color={color.text}>
            {`Получить новый СМС-код можно\nчерез ${timer.timeToEnd}`}
          </VText>
        ) : (
          <VTouchable.Opacity onPress={codeResend}>
            <VText font={'body6'} ta={'center'} color={color.accent1}>{'Отправить новый СМС-код'}</VText>
          </VTouchable.Opacity>
        )}

        <VCol flex />
        <VButton.Fill mt={'xl'} onPress={this._next} disabled={!code.isValid || isBusy}>
          Далее
        </VButton.Fill>
      </VCol>
    );
  }

  private _next = async () => {
    const { stepNext, agreementCreatePr } = this.props.present;
    await agreementCreatePr.cse.confirm();
    stepNext();
  };
}
