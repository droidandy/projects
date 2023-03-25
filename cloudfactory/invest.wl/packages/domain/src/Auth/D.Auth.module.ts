import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { DAuthCase, DAuthCaseTid } from './case/D.Auth.case';
import { DAuthExternalCase, DAuthExternalCaseTid } from './case/D.AuthExternal.case';
import { DAuthPasswordChangeCase, DAuthPasswordChangeCaseTid } from './case/D.AuthPasswordChange.case';
import { DAuthPasswordCreateCase, DAuthPasswordCreateCaseTid } from './case/D.AuthPasswordCreate.case';
import { DAuthPasswordRestoreCase, DAuthPasswordRestoreCaseTid } from './case/D.AuthPasswordRestore.case';
import { DAuthSigninCase, DAuthSigninCaseTid } from './case/D.AuthSignin.case';
import { DAuthSigninCredCase, DAuthSigninCredCaseTid } from './case/D.AuthSigninCred.case';
import { DAuthSignupCase, DAuthSignupCaseTid } from './case/D.AuthSignup.case';
import { DAuthConfig } from './D.Auth.config';
import { DAuthGateway } from './D.Auth.gateway';
import { DAuthService } from './D.Auth.service';
import { DAuthStore } from './D.Auth.store';
import { DAuthConfigTid, DAuthGatewayTid, DAuthServiceTid, DAuthStoreTid } from './D.Auth.types';
import { DAuthPasswordChangeModel, DAuthPasswordChangeModelTid, IDAuthPasswordChangeModel } from './model/D.AuthPasswordChange.model';
import { DAuthPasswordCreateModel, DAuthPasswordCreateModelTid, IDAuthPasswordCreateModel } from './model/D.AuthPasswordCreate.model';
import { DAuthPasswordRestoreModel, DAuthPasswordRestoreModelTid, IDAuthPasswordRestoreModel } from './model/D.AuthPasswordRestore.model';
import { DAuthSigninModel, DAuthSigninModelTid, IDAuthSigninModel } from './model/D.AuthSignin.model';
import { DAuthSignupModel, DAuthSignupModelTid, IDAuthSignupModel } from './model/D.AuthSignup.model';

export class DAuthModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DAuthConfig>(DAuthConfigTid).to(DAuthConfig).inSingletonScope();
    ioc.bind<DAuthStore>(DAuthStoreTid).to(DAuthStore).inSingletonScope();
    ioc.bind<DAuthGateway>(DAuthGatewayTid).to(DAuthGateway).inSingletonScope();
    ioc.bind<DAuthService>(DAuthServiceTid).to(DAuthService).inSingletonScope();
    ioc.bind<DAuthCase>(DAuthCaseTid).to(DAuthCase);
    ioc.bind<DAuthSigninCase>(DAuthSigninCaseTid).to(DAuthSigninCase);
    ioc.bind<DAuthSignupCase>(DAuthSignupCaseTid).to(DAuthSignupCase);
    ioc.bind<DAuthSigninCredCase>(DAuthSigninCredCaseTid).to(DAuthSigninCredCase);
    ioc.bind<DAuthPasswordRestoreCase>(DAuthPasswordRestoreCaseTid).to(DAuthPasswordRestoreCase);
    ioc.bind<DAuthPasswordCreateCase>(DAuthPasswordCreateCaseTid).to(DAuthPasswordCreateCase);
    ioc.bind<DAuthPasswordChangeCase>(DAuthPasswordChangeCaseTid).to(DAuthPasswordChangeCase);
    ioc.bind<DAuthExternalCase>(DAuthExternalCaseTid).to(DAuthExternalCase);

    ioc.bind<NewableType<IDAuthSigninModel>>(DAuthSigninModelTid).toConstructor<IDAuthSigninModel>(DAuthSigninModel);
    ioc.bind<NewableType<IDAuthSignupModel>>(DAuthSignupModelTid).toConstructor<IDAuthSignupModel>(DAuthSignupModel);
    ioc.bind<NewableType<IDAuthPasswordCreateModel>>(DAuthPasswordCreateModelTid).toConstructor<IDAuthPasswordCreateModel>(DAuthPasswordCreateModel);
    ioc.bind<NewableType<IDAuthPasswordChangeModel>>(DAuthPasswordChangeModelTid).toConstructor<IDAuthPasswordChangeModel>(DAuthPasswordChangeModel);
    ioc.bind<NewableType<IDAuthPasswordRestoreModel>>(DAuthPasswordRestoreModelTid).toConstructor<IDAuthPasswordRestoreModel>(DAuthPasswordRestoreModel);
  }
}
