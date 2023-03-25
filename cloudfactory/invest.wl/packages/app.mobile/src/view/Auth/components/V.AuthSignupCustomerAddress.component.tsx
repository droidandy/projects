import { VButton, VCol } from '@invest.wl/mobile';
import { IVAuthSignupWithAccountStepProps } from '@invest.wl/view/src/Auth/present/SignupWithAgreement/V.AuthSignupWithAgreement.types';
import { observer } from 'mobx-react';
import React from 'react';
import { VCustomerAddressForm } from '../../Customer/component/V.CustomerAddressForm.component';

@observer
export class VAuthSignupCustomerAddressForm extends React.Component<IVAuthSignupWithAccountStepProps> {
  public render() {
    const { stepNext, customerCreatePr: { addressModel, cse: { isBusy } } } = this.props.present;

    return (
      <VCol flex>
        <VCustomerAddressForm model={addressModel} postalNeed={true} />
        <VCol flex />
        <VButton.Fill mt={'xl'} onPress={stepNext} disabled={!addressModel.isValid || isBusy}>Далее</VButton.Fill>
      </VCol>
    );
  }
}
