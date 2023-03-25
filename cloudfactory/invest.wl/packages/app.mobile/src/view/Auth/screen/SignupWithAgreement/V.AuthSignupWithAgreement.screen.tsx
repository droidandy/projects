import { IoC } from '@invest.wl/core';
import { mapScreenPropsToProps, VContainer, VContent, VNavBar, VStatusBar, VStub } from '@invest.wl/mobile';
import { VAuthSignupWithAgreementPresent } from '@invest.wl/view/src/Auth/present/SignupWithAgreement/V.AuthSignupWithAgreement.present';

import {
  EVAuthSignupWithAgreementScreenStep,
  IVAuthSignupWithAgreementPresentProps,
  VAuthSignupWithAgreementPresentTid,
} from '@invest.wl/view/src/Auth/present/SignupWithAgreement/V.AuthSignupWithAgreement.types';
import { observer } from 'mobx-react';
import React from 'react';
import { VAuthSignupAccountAgreementForm } from '../../components/V.AuthSignupAccountAgreement.component';
import { VAuthSignupAccountBankAccountForm } from '../../components/V.AuthSignupAccountBankAccount.component';
import { VAuthSignupAccountPEP } from '../../components/V.AuthSignupAccountPEP.component';
import { VAuthSignupAccountQuestionPdlForm } from '../../components/V.AuthSignupAccountQuestionPdl.component';
import { VAuthSignupCustomerAddressForm } from '../../components/V.AuthSignupCustomerAddress.component';
import { VAuthSignupCustomerForm } from '../../components/V.AuthSignupCustomerForm.component';
import { VAuthSignupCustomerFormAdditional } from '../../components/V.AuthSignupCustomerFormAdditional.component';
import { VAuthSignupCustomerPEP } from '../../components/V.AuthSignupCustomerPEP.component';

export interface IVAuthSignupWithAgreementScreenProps extends IVAuthSignupWithAgreementPresentProps {

}

@mapScreenPropsToProps
@observer
export class VAuthSignupWithAgreementScreen extends React.Component<IVAuthSignupWithAgreementScreenProps> {
  public static step2component = {
    [EVAuthSignupWithAgreementScreenStep.CustomerPassport]: VAuthSignupCustomerForm,
    [EVAuthSignupWithAgreementScreenStep.CustomerPersonal]: undefined,
    [EVAuthSignupWithAgreementScreenStep.CustomerAddress]: VAuthSignupCustomerAddressForm,
    [EVAuthSignupWithAgreementScreenStep.CustomerContact]: VAuthSignupCustomerFormAdditional,
    [EVAuthSignupWithAgreementScreenStep.CustomerPEP]: VAuthSignupCustomerPEP,
    [EVAuthSignupWithAgreementScreenStep.AccountBankAccount]: VAuthSignupAccountBankAccountForm,
    [EVAuthSignupWithAgreementScreenStep.AccountQuestionPdl]: VAuthSignupAccountQuestionPdlForm,
    [EVAuthSignupWithAgreementScreenStep.AccountAgreement]: VAuthSignupAccountAgreementForm,
    [EVAuthSignupWithAgreementScreenStep.AccountPEP]: VAuthSignupAccountPEP,
  };

  private _pr = IoC.get<VAuthSignupWithAgreementPresent>(VAuthSignupWithAgreementPresentTid);

  public async componentDidMount() {
    this._pr.init(this.props);
  }

  public render() {
    const { stepList, stepIndex } = this._pr;

    return (
      <VContainer>
        <VStatusBar />
        <VNavBar middleCenter={false}>
          <VNavBar.Middle alignItems={'flex-start'} />
          <VNavBar.Back />
          <VNavBar.Title text={`Регистрация. Шаг ${stepIndex + 1} из ${stepList.length}`} />
        </VNavBar>
        <VContent pa={'lg'}>
          {this._renderContent()}
        </VContent>
      </VContainer>
    );
  }

  private _renderContent() {
    const Component = VAuthSignupWithAgreementScreen.step2component[this._pr.step] as any;
    if (!Component) return <VStub.Error />;
    return (<Component present={this._pr} />);
  }
}
