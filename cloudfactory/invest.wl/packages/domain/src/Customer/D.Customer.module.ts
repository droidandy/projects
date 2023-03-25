import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { DCustomerAccountSelfCase, DCustomerAccountSelfCaseTid } from './case/D.CustomerAccountSelf.case';
import { DCustomerCreateSelfCase, DCustomerCreateSelfCaseTid } from './case/D.CustomerCreateSelf.case';
import { DCustomerGateway } from './D.Customer.gateway';
import { DCustomerStore } from './D.Customer.store';
import { DCustomerGatewayTid, DCustomerStoreTid } from './D.Customer.types';
import { DCustomerAccountSelfModel, DCustomerAccountSelfModelTid, IDCustomerAccountSelfModel } from './model/D.CustomerAccountSelf.model';
import { DCustomerAddressEditModel, DCustomerAddressEditModelTid, IDCustomerAddressEditModel } from './model/D.CustomerAddressEdit.model';
import { DCustomerContactEditModel, DCustomerContactEditModelTid, IDCustomerContactEditModel } from './model/D.CustomerContactEdit.model';
import { DCustomerPassportEditModel, DCustomerPassportEditModelTid, IDCustomerPassportEditModel } from './model/D.CustomerPassportEdit.model';
import { DCustomerPersonalEditModel, DCustomerPersonalEditModelTid, IDCustomerPersonalEditModel } from './model/D.CustomerPersonalEdit.model';
import { DCustomerPreferenceMapModel, DCustomerPreferenceMapModelTid, IDCustomerPreferenceMapModel } from './model/D.CustomerPreferenceMap.model';
import { DCustomerPreferenceSetModel, DCustomerPreferenceSetModelTid, IDCustomerPreferenceSetModel } from './model/D.CustomerPreferenceSet.model';

export class DCustomerModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DCustomerGateway>(DCustomerGatewayTid).to(DCustomerGateway).inSingletonScope();
    ioc.bind<DCustomerStore>(DCustomerStoreTid).to(DCustomerStore).inSingletonScope();
    ioc.bind<DCustomerAccountSelfCase>(DCustomerAccountSelfCaseTid).to(DCustomerAccountSelfCase);
    ioc.bind<DCustomerCreateSelfCase>(DCustomerCreateSelfCaseTid).to(DCustomerCreateSelfCase);
    ioc.bind<NewableType<IDCustomerAccountSelfModel>>(DCustomerAccountSelfModelTid).toConstructor<IDCustomerAccountSelfModel>(DCustomerAccountSelfModel);
    ioc.bind<NewableType<IDCustomerPreferenceMapModel>>(DCustomerPreferenceMapModelTid).toConstructor<IDCustomerPreferenceMapModel>(DCustomerPreferenceMapModel);
    ioc.bind<NewableType<IDCustomerPreferenceSetModel>>(DCustomerPreferenceSetModelTid).toConstructor<IDCustomerPreferenceSetModel>(DCustomerPreferenceSetModel);
    ioc.bind<NewableType<IDCustomerAddressEditModel>>(DCustomerAddressEditModelTid).toConstructor<IDCustomerAddressEditModel>(DCustomerAddressEditModel);
    ioc.bind<NewableType<IDCustomerContactEditModel>>(DCustomerContactEditModelTid).toConstructor<IDCustomerContactEditModel>(DCustomerContactEditModel);
    ioc.bind<NewableType<IDCustomerPassportEditModel>>(DCustomerPassportEditModelTid).toConstructor<IDCustomerPassportEditModel>(DCustomerPassportEditModel);
    ioc.bind<NewableType<IDCustomerPersonalEditModel>>(DCustomerPersonalEditModelTid).toConstructor<IDCustomerPersonalEditModel>(DCustomerPersonalEditModel);
  }
}
