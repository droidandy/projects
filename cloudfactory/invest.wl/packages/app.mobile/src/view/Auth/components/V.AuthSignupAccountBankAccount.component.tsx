import { EDCurrencyCode } from '@invest.wl/core';
import { VButton, VCol, VText } from '@invest.wl/mobile';
import { IVAuthSignupWithAccountStepProps } from '@invest.wl/view/src/Auth/present/SignupWithAgreement/V.AuthSignupWithAgreement.types';
import { observer } from 'mobx-react';
import React from 'react';
import { VBankAccountForm } from '../../BankAccount/component/V.BankAccountForm.component';

@observer
export class VAuthSignupAccountBankAccountForm extends React.Component<IVAuthSignupWithAccountStepProps> {
  public render() {
    const { stepNext, agreementCreatePr: { bankAccountModel, cse: { isBusy } } } = this.props.present;

    return (
      <VCol flex>
        <VText mb={'lg'} ta={'center'} font={'body7'}>Контактная информация</VText>

        <VBankAccountForm model={bankAccountModel}
          currencyList={[EDCurrencyCode.RUB, EDCurrencyCode.USD, EDCurrencyCode.EUR]} />

        <VCol flex />
        <VButton.Fill mt={'xl'} onPress={stepNext} disabled={!bankAccountModel.isValid || isBusy}>
          Далее
        </VButton.Fill>
      </VCol>
    );
  }
}
