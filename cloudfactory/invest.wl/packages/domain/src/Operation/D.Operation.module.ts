import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { DOperationDepositCreateCase, DOperationDepositCreateCaseTid } from './case/D.OperationDepositCreate.case';
import { DOperationListCase, DOperationListCaseTid } from './case/D.OperationList.case';
import { DOperationTransferCreateCase, DOperationTransferCreateCaseTid } from './case/D.OperationTransferCreate.case';
import { DOperationWithdrawCreateCase, DOperationWithdrawCreateCaseTid } from './case/D.OperationWithdrawCreate.case';
import { DOperationGateway, DOperationGatewayTid } from './D.Operation.gateway';
import { DOperationModel, DOperationModelTid, IDOperationModel } from './model/D.Operation.model';
import { DOperationDepositCreateModel, DOperationDepositCreateModelTid, IDOperationDepositCreateModel } from './model/D.OperationDepositCreate.model';
import { DOperationTransferCreateModel, DOperationTransferCreateModelTid, IDOperationTransferCreateModel } from './model/D.OperationTransferCreate.model';
import { DOperationWithdrawCreateModel, DOperationWithdrawCreateModelTid, IDOperationWithdrawCreateModel } from './model/D.OperationWithdrawCreate.model';

export class DOperationModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DOperationGateway>(DOperationGatewayTid).to(DOperationGateway).inSingletonScope();
    ioc.bind<DOperationListCase>(DOperationListCaseTid).to(DOperationListCase);
    ioc.bind<DOperationDepositCreateCase>(DOperationDepositCreateCaseTid).to(DOperationDepositCreateCase);
    ioc.bind<DOperationWithdrawCreateCase>(DOperationWithdrawCreateCaseTid).to(DOperationWithdrawCreateCase);
    ioc.bind<DOperationTransferCreateCase>(DOperationTransferCreateCaseTid).to(DOperationTransferCreateCase);
    ioc.bind<NewableType<IDOperationModel>>(DOperationModelTid).toConstructor<IDOperationModel>(DOperationModel);
    ioc.bind<NewableType<IDOperationDepositCreateModel>>(DOperationDepositCreateModelTid).toConstructor<IDOperationDepositCreateModel>(DOperationDepositCreateModel);
    ioc.bind<NewableType<IDOperationTransferCreateModel>>(DOperationTransferCreateModelTid).toConstructor<IDOperationTransferCreateModel>(DOperationTransferCreateModel);
    ioc.bind<NewableType<IDOperationWithdrawCreateModel>>(DOperationWithdrawCreateModelTid).toConstructor<IDOperationWithdrawCreateModel>(DOperationWithdrawCreateModel);
  }
}
