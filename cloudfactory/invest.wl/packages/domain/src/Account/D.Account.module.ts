import { IDAccountItemDTO, IDAccountQUIKItemDTO, IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { DAccountAgreementCreateCase, DAccountAgreementCreateCaseTid } from './case/D.AccountAgreementCreate.case';
import { DAccountListCase, DAccountListCaseTid } from './case/D.AccountList.case';

import { DAccountGateway, DAccountGatewayTid } from './D.Account.gateway';
import { DAccountStore, DAccountStoreTid } from './D.Account.store';
import { DAccountModel, DAccountModelTid, IDAccountModel } from './model/D.Account.model';
import { DAccountAgreementCreateModel, DAccountAgreementCreateModelTid, IDAccountAgreementCreateModel } from './model/D.AccountAgreementCreate.model';
import {
  DAccountByAgreementModel,
  DAccountByAgreementModelFactoryTid,
  DAccountByAgreementModelTid,
  IDAccountByAgreementModel,
  IDAccountByAgreementModelFactory,
} from './model/D.AccountByAgreement.model';
import { DAccountQUIKModel, DAccountQUIKModelTid, IDAccountQUIKModel } from './model/D.AccountQUIK.model';

export class DAccountModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DAccountGateway>(DAccountGatewayTid).to(DAccountGateway).inSingletonScope();
    ioc.bind<DAccountStore>(DAccountStoreTid).to(DAccountStore).inSingletonScope();
    ioc.bind<DAccountListCase>(DAccountListCaseTid).to(DAccountListCase);
    ioc.bind<DAccountAgreementCreateCase>(DAccountAgreementCreateCaseTid).to(DAccountAgreementCreateCase);

    ioc.bind<NewableType<IDAccountModel>>(DAccountModelTid).toConstructor<IDAccountModel>(DAccountModel);
    ioc.bind<NewableType<IDAccountQUIKModel>>(DAccountQUIKModelTid).toConstructor<IDAccountQUIKModel>(DAccountQUIKModel);
    ioc.bind<NewableType<IDAccountByAgreementModel<any>>>(DAccountByAgreementModelTid)
      .toConstructor<IDAccountByAgreementModel<any>>(DAccountByAgreementModel);
    ioc.bind<NewableType<IDAccountAgreementCreateModel>>(DAccountAgreementCreateModelTid)
      .toConstructor<IDAccountAgreementCreateModel>(DAccountAgreementCreateModel);
    ioc.bind<IDAccountByAgreementModelFactory>(DAccountByAgreementModelFactoryTid)
      .toFactory<IDAccountByAgreementModel<any>>((context) =>
      <T extends IDAccountItemDTO | IDAccountQUIKItemDTO>(item: T) => {
        const model = context.container.get<NewableType<IDAccountByAgreementModel<T>>>(DAccountByAgreementModelTid);
        return new model(item);
      },
    );
  }
}
