import { IVAccountAgreementCreatePresentProps, VAccountAgreementCreatePresent } from '../../../Account/present/V.AccountAgreementCreate.present';
import { IVCustomerCreateSelfPresentProps, VCustomerCreateSelfPresent } from '../../../Customer/present/V.CustomerCreateSelf.present';

export const VAuthSignupWithAgreementPresentTid = Symbol.for('VAuthSignupWithAgreementPresentTid');

export interface IVAuthSignupWithAgreementPresent {
  readonly props?: IVAuthSignupWithAgreementPresentProps;
  readonly isBusy: boolean;
  readonly customerCreatePr: VCustomerCreateSelfPresent;
  readonly agreementCreatePr: VAccountAgreementCreatePresent;
  readonly stepIndex: number;
  readonly stepList: EVAuthSignupWithAgreementScreenStep[];
  readonly step: EVAuthSignupWithAgreementScreenStep;
  init(props: IVAuthSignupWithAgreementPresentProps): void;
  stepNext(): void;
  stepPrev(): void;
}

export interface IVAuthSignupWithAgreementPresentProps extends Omit<IVCustomerCreateSelfPresentProps, 'required' | 'confirmNeed'>,
  Omit<IVAccountAgreementCreatePresentProps, 'required'> {
  customerConfirmNeed?: IVCustomerCreateSelfPresentProps['confirmNeed'];
  customerRequired: IVCustomerCreateSelfPresentProps['required'];
}

export interface IVAuthSignupWithAccountStepProps {
  present: IVAuthSignupWithAgreementPresent;
}

export enum EVAuthSignupWithAgreementScreenStep {
  CustomerPassport,
  CustomerPersonal,
  CustomerAddress,
  CustomerContact,
  CustomerPEP,
  AccountBankAccount,
  AccountQuestionPdl,
  AccountAgreement,
  AccountPEP,
}
