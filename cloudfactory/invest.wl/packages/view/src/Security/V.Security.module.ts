import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { IVSecurityCodeModel, VSecurityCodeModel, VSecurityCodeModelTid } from './model/V.SecurityCode.model';
import { VSecurityAccessBiometryPresent, VSecurityAccessBiometryPresentTid } from './present/V.SecurityAccessBiometry.present';
import { VSecurityAccessCodePresent, VSecurityAccessCodePresentTid } from './present/V.SecurityAccessCode.present';
import { VSecuritySettingsPresent, VSecuritySettingsPresentTid } from './present/V.SecuritySettings.present';
import { VSecurityUnlockPresent, VSecurityUnlockPresentTid } from './present/V.SecurityUnlock.present';

export class VSecurityModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<VSecurityAccessBiometryPresent>(VSecurityAccessBiometryPresentTid).to(VSecurityAccessBiometryPresent);
    ioc.bind<VSecurityAccessCodePresent>(VSecurityAccessCodePresentTid).to(VSecurityAccessCodePresent);
    ioc.bind<VSecurityUnlockPresent>(VSecurityUnlockPresentTid).to(VSecurityUnlockPresent);
    ioc.bind<VSecuritySettingsPresent>(VSecuritySettingsPresentTid).to(VSecuritySettingsPresent);
    ioc.bind<NewableType<VSecurityCodeModel>>(VSecurityCodeModelTid).toConstructor<IVSecurityCodeModel>(VSecurityCodeModel);
  }
}
