import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { IVBankModel, VBankModel, VBankModelTid } from './model/V.Bank.model';
import { IVBankAccountModel, VBankAccountModel, VBankAccountModelTid } from './model/V.BankAccount.model';
import { IVBankAccountEditModel, VBankAccountEditModel, VBankAccountEditModelTid } from './model/V.BankAccountEdit.model';
import { IVBankSearchModel, VBankSearchModel, VBankSearchModelTid } from './model/V.BankSearch.model';
import { VBankSearchPresent, VBankSearchPresentTid } from './present/V.BankSearch.present';

export class VBankAccountModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<VBankSearchPresent>(VBankSearchPresentTid).to(VBankSearchPresent);

    ioc.bind<NewableType<IVBankModel>>(VBankModelTid).toConstructor<IVBankModel>(VBankModel);
    ioc.bind<NewableType<IVBankAccountModel>>(VBankAccountModelTid).toConstructor<IVBankAccountModel>(VBankAccountModel);
    ioc.bind<NewableType<IVBankAccountEditModel>>(VBankAccountEditModelTid).toConstructor<IVBankAccountEditModel>(VBankAccountEditModel);
    ioc.bind<NewableType<IVBankSearchModel>>(VBankSearchModelTid).toConstructor<IVBankSearchModel>(VBankSearchModel);
  }
}
