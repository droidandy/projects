import React from 'react';
import { observer } from 'mobx-react';
import { VButton, VCol, VText } from '@invest.wl/mobile/src/view/kit';
import { IVAuthSignupWithAccountStepProps } from '@invest.wl/view/src/Auth/present/SignupWithAgreement/V.AuthSignupWithAgreement.types';

@observer
export class VAuthSignupAccountAgreementForm extends React.Component<IVAuthSignupWithAccountStepProps> {
  public render() {
    const { agreementCreatePr: { accountAgreementModel, cse: { isBusy } } } = this.props.present;

    return (
      <VCol flex>
        <VText mb={'lg'} ta={'center'} font={'body7'}>Параметры договора</VText>

        <VCol flex />
        <VButton.Fill mt={'xl'} onPress={this._next} disabled={!accountAgreementModel.isValid || isBusy}>
          Далее
        </VButton.Fill>
      </VCol>
    );
  }

  private _next = async () => {
    const { stepNext, agreementCreatePr } = this.props.present;
    await agreementCreatePr.cse.create();
    stepNext();
  };
}
