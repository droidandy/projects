import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { IVOperationModel, VOperationModel, VOperationModelTid } from './model/V.Operation.model';
import { IVOperationDepositCreateModel, VOperationDepositCreateModel, VOperationDepositCreateModelTid } from './model/V.OperationDepositCreate.model';
import { IVOperationTransferCreateModel, VOperationTransferCreateModel, VOperationTransferCreateModelTid } from './model/V.OperationTransferCreate.model';
import { VOperationDepositCreatePresent, VOperationDepositCreatePresentTid } from './present/V.OperationDepositCreate.present';
import { VOperationListPresent, VOperationListPresentTid } from './present/V.OperationList.present';
import { VOperationTransferCreatePresent, VOperationTransferCreatePresentTid } from './present/V.OperationTransferCreate.present';
import { VOperationI18n } from './V.Operation.i18n';
import { VOperationI18nTid } from './V.Operation.types';

export class VOperationModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<VOperationI18n>(VOperationI18nTid).to(VOperationI18n).inSingletonScope();
    ioc.bind<VOperationListPresent>(VOperationListPresentTid).to(VOperationListPresent);
    ioc.bind<VOperationTransferCreatePresent>(VOperationTransferCreatePresentTid).to(VOperationTransferCreatePresent);
    ioc.bind<VOperationDepositCreatePresent>(VOperationDepositCreatePresentTid).to(VOperationDepositCreatePresent);
    ioc.bind<NewableType<IVOperationModel>>(VOperationModelTid).toConstructor<IVOperationModel>(VOperationModel);
    ioc.bind<NewableType<IVOperationTransferCreateModel>>(VOperationTransferCreateModelTid).toConstructor<IVOperationTransferCreateModel>(VOperationTransferCreateModel);
    ioc.bind<NewableType<IVOperationDepositCreateModel>>(VOperationDepositCreateModelTid).toConstructor<IVOperationDepositCreateModel>(VOperationDepositCreateModel);
  }
}
