import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { DSecurityAccessCase, DSecurityAccessCaseTid } from './case/D.SecurityAccess.case';
import { DSecurityCheckCase, DSecurityCheckCaseTid } from './case/D.SecurityCheck.case';
import { DSecuritySettingCase, DSecuritySettingCaseTid } from './case/D.SecuritySetting.case';
import { DSecurityUnlockCase, DSecurityUnlockCaseTid } from './case/D.SecurityUnlock.case';
import { DSecurityConfig, DSecurityConfigTid } from './D.Security.config';
import { DSecurityService } from './D.Security.service';
import { DSecurityStore } from './D.Security.store';
import { DSecurityServiceTid, DSecurityStoreTid } from './D.Security.types';
import { DSecurityCodeModel, DSecurityCodeModelTid, IDSecurityCodeModel } from './model/D.SecurityCode.model';

export class DSecurityModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DSecurityConfig>(DSecurityConfigTid).to(DSecurityConfig).inSingletonScope();
    ioc.bind<DSecurityStore>(DSecurityStoreTid).to(DSecurityStore).inSingletonScope();
    ioc.bind<DSecurityService>(DSecurityServiceTid).to(DSecurityService).inSingletonScope();
    ioc.bind<DSecuritySettingCase>(DSecuritySettingCaseTid).to(DSecuritySettingCase);
    ioc.bind<DSecurityCheckCase>(DSecurityCheckCaseTid).to(DSecurityCheckCase);
    ioc.bind<DSecurityUnlockCase>(DSecurityUnlockCaseTid).to(DSecurityUnlockCase);
    ioc.bind<DSecurityAccessCase>(DSecurityAccessCaseTid).to(DSecurityAccessCase);
    ioc.bind<NewableType<DSecurityCodeModel>>(DSecurityCodeModelTid).toConstructor<IDSecurityCodeModel>(DSecurityCodeModel);
  }
}
