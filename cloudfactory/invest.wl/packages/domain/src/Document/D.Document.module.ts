import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { DDocumentCreateCase, DDocumentCreateCaseTid } from './case/D.DocumentCreate.case';
import { DDocumentListCase, DDocumentListCaseTid } from './case/D.DocumentList.case';
import { DDocumentSignCase, DDocumentSignCaseTid } from './case/D.DocumentSign.case';
import { DDocumentConfig } from './D.Document.config';
import { DDocumentGateway } from './D.Document.gateway';
import { DDocumentStore } from './D.Document.store';
import { DDocumentConfigTid, DDocumentGatewayTid, DDocumentStoreTid, IDDocumentConfig } from './D.Document.types';
import { DDocumentModel, DDocumentModelTid, IDDocumentModel } from './model/D.Document.model';
import { DDocumentSignConfirmModel, DDocumentSignConfirmModelTid, IDDocumentSignConfirmModel } from './model/D.DocumentSignConfirm.model';

export class DDocumentModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<IDDocumentConfig>(DDocumentConfigTid).to(DDocumentConfig).inSingletonScope();
    ioc.bind<DDocumentStore>(DDocumentStoreTid).to(DDocumentStore).inSingletonScope();
    ioc.bind<DDocumentGateway>(DDocumentGatewayTid).to(DDocumentGateway).inSingletonScope();
    ioc.bind<DDocumentListCase>(DDocumentListCaseTid).to(DDocumentListCase);
    ioc.bind<DDocumentSignCase>(DDocumentSignCaseTid).to(DDocumentSignCase);
    ioc.bind<DDocumentCreateCase>(DDocumentCreateCaseTid).to(DDocumentCreateCase);

    ioc.bind<NewableType<IDDocumentModel>>(DDocumentModelTid).toConstructor<IDDocumentModel>(DDocumentModel);
    ioc.bind<NewableType<IDDocumentSignConfirmModel>>(DDocumentSignConfirmModelTid).toConstructor<IDDocumentSignConfirmModel>(DDocumentSignConfirmModel);
  }
}
