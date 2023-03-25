import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { IVOwnerModel, VOwnerModel, VOwnerModelTid } from './model/V.Owner.model';
import { VOwnerContactPresent, VOwnerContactPresentTid } from './present/V.OwnerContact.present';
import { VOwnerInfoPresent, VOwnerInfoPresentTid } from './present/V.OwnerInfo.present';
import { VOwnerTermsPresent, VOwnerTermsPresentTid } from './present/V.OwnerTerms.present';

export class VOwnerModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<VOwnerInfoPresent>(VOwnerInfoPresentTid).to(VOwnerInfoPresent);
    ioc.bind<VOwnerTermsPresent>(VOwnerTermsPresentTid).to(VOwnerTermsPresent);
    ioc.bind<VOwnerContactPresent>(VOwnerContactPresentTid).to(VOwnerContactPresent);
    ioc.bind<NewableType<IVOwnerModel>>(VOwnerModelTid).toConstructor<IVOwnerModel>(VOwnerModel);
  }
}
