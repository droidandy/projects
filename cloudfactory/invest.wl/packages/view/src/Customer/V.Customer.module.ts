import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { IVCustomerAccountSelfModel, VCustomerAccountSelfModel, VCustomerAccountSelfModelTid } from './model/V.CustomerAccountSelf.model';
import { IVCustomerAddressEditModel, VCustomerAddressEditModel, VCustomerAddressEditModelTid } from './model/V.CustomerAddressEdit.model';
import { IVCustomerContactEditModel, VCustomerContactEditModel, VCustomerContactEditModelTid } from './model/V.CustomerContactEdit.model';
import { IVCustomerPassportEditModel, VCustomerPassportEditModel, VCustomerPassportEditModelTid } from './model/V.CustomerPassportEdit.model';
import { IVCustomerPersonalEditModel, VCustomerPersonalEditModel, VCustomerPersonalEditModelTid } from './model/V.CustomerPersonalEdit.model';
import { IVCustomerPreferenceMapModel, VCustomerPreferenceMapModel, VCustomerPreferenceMapModelTid } from './model/V.CustomerPreferenceMap.model';
import { IVCustomerPreferenceSetModel, VCustomerPreferenceSetModel, VCustomerPreferenceSetModelTid } from './model/V.CustomerPreferenceSet.model';
import { VCustomerAccountSelfPresent, VCustomerAccountSelfPresentTid } from './present/V.CustomerAccountSelf.present';
import { VCustomerCreateSelfPresent, VCustomerCreateSelfPresentTid } from './present/V.CustomerCreateSelf.present';

export class VCustomerModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<VCustomerAccountSelfPresent>(VCustomerAccountSelfPresentTid).to(VCustomerAccountSelfPresent);
    ioc.bind<VCustomerCreateSelfPresent>(VCustomerCreateSelfPresentTid).to(VCustomerCreateSelfPresent);
    ioc.bind<NewableType<IVCustomerAccountSelfModel>>(VCustomerAccountSelfModelTid).toConstructor<IVCustomerAccountSelfModel>(VCustomerAccountSelfModel);
    ioc.bind<NewableType<IVCustomerPreferenceMapModel>>(VCustomerPreferenceMapModelTid).toConstructor<IVCustomerPreferenceMapModel>(VCustomerPreferenceMapModel);
    ioc.bind<NewableType<IVCustomerPreferenceSetModel>>(VCustomerPreferenceSetModelTid).toConstructor<IVCustomerPreferenceSetModel>(VCustomerPreferenceSetModel);
    ioc.bind<NewableType<IVCustomerAddressEditModel>>(VCustomerAddressEditModelTid).toConstructor<IVCustomerAddressEditModel>(VCustomerAddressEditModel);
    ioc.bind<NewableType<IVCustomerContactEditModel>>(VCustomerContactEditModelTid).toConstructor<IVCustomerContactEditModel>(VCustomerContactEditModel);
    ioc.bind<NewableType<IVCustomerPassportEditModel>>(VCustomerPassportEditModelTid).toConstructor<IVCustomerPassportEditModel>(VCustomerPassportEditModel);
    ioc.bind<NewableType<IVCustomerPersonalEditModel>>(VCustomerPersonalEditModelTid).toConstructor<IVCustomerPersonalEditModel>(VCustomerPersonalEditModel);
  }
}
