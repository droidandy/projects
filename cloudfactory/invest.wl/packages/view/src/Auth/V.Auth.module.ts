import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { IVAuthPasswordChangeModel, VAuthPasswordChangeModel, VAuthPasswordChangeModelTid } from './model/V.AuthPasswordChange.model';
import { IVAuthPasswordCreateModel, VAuthPasswordCreateModel, VAuthPasswordCreateModelTid } from './model/V.AuthPasswordCreate.model';
import { IVAuthPasswordRestoreModel, VAuthPasswordRestoreModel, VAuthPasswordRestoreModelTid } from './model/V.AuthPasswordRestore.model';
import { IVAuthSigninModel, VAuthSigninModel, VAuthSigninModelTid } from './model/V.AuthSignin.model';
import { IVAuthSignupModel, VAuthSignupModel, VAuthSignupModelTid } from './model/V.AuthSignup.model';
import { VAuthSigninPresent } from './present/Signin/V.AuthSignin.present';
import { VAuthSigninPresentTid } from './present/Signin/V.AuthSignin.types';
import { VAuthSigninCredPresent } from './present/SigninCred/V.AuthSigninCred.present';
import { VAuthSigninCredPresentTid } from './present/SigninCred/V.AuthSigninCred.types';
import { VAuthSignupWithAgreementPresent } from './present/SignupWithAgreement/V.AuthSignupWithAgreement.present';
import { VAuthSignupWithAgreementPresentTid } from './present/SignupWithAgreement/V.AuthSignupWithAgreement.types';
import { VAuthExternalPresent, VAuthExternalPresentTid } from './present/V.AuthExternal.present';
import { VAuthPasswordChangePresent, VAuthPasswordChangePresentTid } from './present/V.AuthPasswordChange.present';
import { VAuthPasswordCreatePresent, VAuthPasswordCreatePresentTid } from './present/V.AuthPasswordCreate.present';
import { VAuthPasswordRestorePresent, VAuthPasswordRestorePresentTid } from './present/V.AuthPasswordRestore.present';
import { VAuthSignupPresent, VAuthSignupPresentTid } from './present/V.AuthSignup.present';

export class VAuthModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<VAuthSigninPresent>(VAuthSigninPresentTid).to(VAuthSigninPresent);
    ioc.bind<VAuthSigninCredPresent>(VAuthSigninCredPresentTid).to(VAuthSigninCredPresent);
    ioc.bind<VAuthSignupPresent>(VAuthSignupPresentTid).to(VAuthSignupPresent);
    ioc.bind<VAuthSignupWithAgreementPresent>(VAuthSignupWithAgreementPresentTid).to(VAuthSignupWithAgreementPresent);
    ioc.bind<VAuthPasswordRestorePresent>(VAuthPasswordRestorePresentTid).to(VAuthPasswordRestorePresent);
    ioc.bind<VAuthPasswordCreatePresent>(VAuthPasswordCreatePresentTid).to(VAuthPasswordCreatePresent);
    ioc.bind<VAuthPasswordChangePresent>(VAuthPasswordChangePresentTid).to(VAuthPasswordChangePresent);
    ioc.bind<VAuthExternalPresent>(VAuthExternalPresentTid).to(VAuthExternalPresent);

    ioc.bind<NewableType<IVAuthSigninModel>>(VAuthSigninModelTid).toConstructor<IVAuthSigninModel>(VAuthSigninModel);
    ioc.bind<NewableType<IVAuthSignupModel>>(VAuthSignupModelTid).toConstructor<IVAuthSignupModel>(VAuthSignupModel);
    ioc.bind<NewableType<IVAuthPasswordCreateModel>>(VAuthPasswordCreateModelTid).toConstructor<IVAuthPasswordCreateModel>(VAuthPasswordCreateModel);
    ioc.bind<NewableType<IVAuthPasswordChangeModel>>(VAuthPasswordChangeModelTid).toConstructor<IVAuthPasswordChangeModel>(VAuthPasswordChangeModel);
    ioc.bind<NewableType<IVAuthPasswordRestoreModel>>(VAuthPasswordRestoreModelTid).toConstructor<IVAuthPasswordRestoreModel>(VAuthPasswordRestoreModel);
  }
}
