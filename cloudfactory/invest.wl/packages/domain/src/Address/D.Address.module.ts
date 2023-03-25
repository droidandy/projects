import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { DAddressSearchCase, DAddressSearchCaseTid } from './case/D.AddressSearch.case';
import { DAddressGateway, DAddressGatewayTid } from './D.Address.gateway';
import { DAddressModel, DAddressModelTid, IDAddressModel } from './model/D.Address.model';
import { DAddressEditModel, DAddressEditModelTid, IDAddressEditModel } from './model/D.AddressEdit.model';
import { DAddressSearchModel, DAddressSearchModelTid, IDAddressSearchModel } from './model/D.AddressSearch.model';

export class DAddressModule extends IocModule {
  public configure(ioc: IocContainer) {
    ioc.bind<DAddressGateway>(DAddressGatewayTid).to(DAddressGateway).inSingletonScope();
    ioc.bind<DAddressSearchCase>(DAddressSearchCaseTid).to(DAddressSearchCase);

    ioc.bind<NewableType<IDAddressModel>>(DAddressModelTid).toConstructor<IDAddressModel>(DAddressModel);
    ioc.bind<NewableType<IDAddressEditModel>>(DAddressEditModelTid).toConstructor<IDAddressEditModel>(DAddressEditModel);
    ioc.bind<NewableType<IDAddressSearchModel>>(DAddressSearchModelTid).toConstructor<IDAddressSearchModel>(DAddressSearchModel);
  }
}
