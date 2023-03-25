import { IVAuthSigninPresent, IVAuthSigninPresentProps } from './present/Signin/V.AuthSignin.types';
import { IVAuthSignupWithAgreementPresentProps } from './present/SignupWithAgreement/V.AuthSignupWithAgreement.types';
import { IVAuthPasswordChangePresentProps } from './present/V.AuthPasswordChange.present';
import { IVAuthPasswordCreatePresentProps } from './present/V.AuthPasswordCreate.present';
import { IVAuthPasswordRestorePresentProps } from './present/V.AuthPasswordRestore.present';
import { IVAuthSignupPresentProps } from './present/V.AuthSignup.present';

export interface IVAuthSmsConfirmPresentProps {
  present: IVAuthSigninPresent;
}

export enum EVAuthScreen {
  AuthSignup = 'AuthSignup',
  AuthSignupWithAgreement = 'AuthSignupWithAgreement',
  AuthSignin = 'AuthSignin',
  AuthPasswordRestore = 'AuthPasswordRestore',
  AuthPasswordCreate = 'AuthPasswordCreate',
  AuthPasswordChange = 'AuthPasswordChange',
  AuthSmsConfirm = 'AuthSmsConfirm',
}

export interface IVAuthScreenParams {
  AuthSignup: IVAuthSignupPresentProps;
  AuthSignupWithAgreement: IVAuthSignupWithAgreementPresentProps;
  AuthSignin: IVAuthSigninPresentProps;
  AuthPasswordRestore: IVAuthPasswordRestorePresentProps;
  AuthPasswordCreate: IVAuthPasswordCreatePresentProps & IVAuthSmsConfirmPresentProps;
  AuthPasswordChange: IVAuthPasswordChangePresentProps;
  AuthSmsConfirm: IVAuthSmsConfirmPresentProps;
}
