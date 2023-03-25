import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { IVAddressModel, VAddressModel, VAddressModelTid } from './model/V.Address.model';
import { IVAddressEditModel, VAddressEditModel, VAddressEditModelTid } from './model/V.AddressEdit.model';
import { IVAddressSearchModel, VAddressSearchModel, VAddressSearchModelTid } from './model/V.AddressSearch.model';
import { VAddressSearchPresent, VAddressSearchPresentTid } from './present/V.AddressSearch.present';

export class VAddressModule extends IocModule {
  public configure(ioc: IocContainer) {
    ioc.bind<VAddressSearchPresent>(VAddressSearchPresentTid).to(VAddressSearchPresent);

    ioc.bind<NewableType<IVAddressEditModel>>(VAddressEditModelTid).toConstructor<IVAddressEditModel>(VAddressEditModel);
    ioc.bind<NewableType<IVAddressModel>>(VAddressModelTid).toConstructor<IVAddressModel>(VAddressModel);
    ioc.bind<NewableType<IVAddressSearchModel>>(VAddressSearchModelTid).toConstructor<IVAddressSearchModel>(VAddressSearchModel);
  }
}
