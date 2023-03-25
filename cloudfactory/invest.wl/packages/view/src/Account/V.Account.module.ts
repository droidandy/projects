import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { IVAccountModel, VAccountModel, VAccountModelTid } from './model/V.Account.model';
import { IVAccountAgreementCreateModel, VAccountAgreementCreateModel, VAccountAgreementCreateModelTid } from './model/V.AccountAgreementCreate.model';
import { IVAccountByAgreementModel, VAccountByAgreementModel, VAccountByAgreementModelTid } from './model/V.AccountByAgreement.model';
import { IVAccountQUIKModel, VAccountQUIKModel, VAccountQUIKModelTid } from './model/V.AccountQUIK.model';
import { VAccountAgreementCreatePresent, VAccountAgreementCreatePresentTid } from './present/V.AccountAgreementCreate.present';
import { VAccountListPresent, VAccountListPresentTid } from './present/V.AccountList.present';
import { VAccountI18n } from './V.Account.i18n';
import { IVAccountI18n, VAccountI18nTid } from './V.Account.types';

export class VAccountModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<IVAccountI18n>(VAccountI18nTid).to(VAccountI18n);
    ioc.bind<VAccountListPresent>(VAccountListPresentTid).to(VAccountListPresent);
    ioc.bind<VAccountAgreementCreatePresent>(VAccountAgreementCreatePresentTid).to(VAccountAgreementCreatePresent);
    ioc.bind<NewableType<IVAccountModel>>(VAccountModelTid).toConstructor<IVAccountModel>(VAccountModel);
    ioc.bind<NewableType<IVAccountQUIKModel>>(VAccountQUIKModelTid).toConstructor<IVAccountQUIKModel>(VAccountQUIKModel);
    ioc.bind<NewableType<IVAccountByAgreementModel<any>>>(VAccountByAgreementModelTid)
      .toConstructor<IVAccountByAgreementModel<any>>(VAccountByAgreementModel);
    ioc.bind<NewableType<IVAccountAgreementCreateModel>>(VAccountAgreementCreateModelTid)
      .toConstructor<IVAccountAgreementCreateModel>(VAccountAgreementCreateModel);
  }
}
