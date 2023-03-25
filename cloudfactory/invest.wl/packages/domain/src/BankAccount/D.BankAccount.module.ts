import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { DBankAccountEditCase, DBankAccountEditCaseTid } from './case/D.BankAccountEdit.case';
import { DBankAccountListCase, DBankAccountListCaseTid } from './case/D.BankAccountList.case';
import { DBankSearchCase, DBankSearchCaseTid } from './case/D.BankSearch.case';
import { DBankAccountGateway, DBankAccountGatewayTid } from './D.BankAccount.gateway';
import { DBankAccountStore, DBankAccountStoreTid } from './D.BankAccount.store';
import { DBankModel, DBankModelTid, IDBankModel } from './model/D.Bank.model';
import { DBankAccountModel, DBankAccountModelTid, IDBankAccountModel } from './model/D.BankAccount.model';
import { DBankAccountEditModel, DBankAccountEditModelTid, IDBankAccountEditModel } from './model/D.BankAccountEdit.model';
import { DBankSearchModel, DBankSearchModelTid, IDBankSearchModel } from './model/D.BankSearch.model';

export class DBankAccountModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DBankAccountGateway>(DBankAccountGatewayTid).to(DBankAccountGateway).inSingletonScope();
    ioc.bind<DBankAccountStore>(DBankAccountStoreTid).to(DBankAccountStore).inSingletonScope();
    ioc.bind<DBankAccountListCase>(DBankAccountListCaseTid).to(DBankAccountListCase);
    ioc.bind<DBankAccountEditCase>(DBankAccountEditCaseTid).to(DBankAccountEditCase);
    ioc.bind<DBankSearchCase>(DBankSearchCaseTid).to(DBankSearchCase);

    ioc.bind<NewableType<IDBankModel>>(DBankModelTid).toConstructor<IDBankModel>(DBankModel);
    ioc.bind<NewableType<IDBankAccountModel>>(DBankAccountModelTid).toConstructor<IDBankAccountModel>(DBankAccountModel);
    ioc.bind<NewableType<IDBankAccountEditModel>>(DBankAccountEditModelTid).toConstructor<IDBankAccountEditModel>(DBankAccountEditModel);
    ioc.bind<NewableType<IDBankSearchModel>>(DBankSearchModelTid).toConstructor<IDBankSearchModel>(DBankSearchModel);
  }
}
