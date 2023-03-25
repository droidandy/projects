import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { IVDocumentModel, VDocumentModel, VDocumentModelTid } from './model/V.Document.model';
import { IVDocumentSignConfirmModel, VDocumentSignConfirmModel, VDocumentSignConfirmModelTid } from './model/V.DocumentSignConfirm.model';
import { VDocumentCreatePresent, VDocumentCreatePresentTid } from './present/V.DocumentCreate.present';
import { VDocumentListPresent, VDocumentListPresentTid } from './present/V.DocumentList.present';
import { VDocumentSignPresent, VDocumentSignPresentTid } from './present/V.DocumentSign.present';
import { VDocumentI18n } from './V.Document.i18n';
import { IVDocumentI18n, VDocumentI18nTid } from './V.Document.types';

export class VDocumentModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<IVDocumentI18n>(VDocumentI18nTid).to(VDocumentI18n).inSingletonScope();
    ioc.bind<VDocumentListPresent>(VDocumentListPresentTid).to(VDocumentListPresent);
    ioc.bind<VDocumentCreatePresent>(VDocumentCreatePresentTid).to(VDocumentCreatePresent);
    ioc.bind<VDocumentSignPresent>(VDocumentSignPresentTid).to(VDocumentSignPresent);

    ioc.bind<NewableType<IVDocumentModel>>(VDocumentModelTid).toConstructor<IVDocumentModel>(VDocumentModel);
    ioc.bind<NewableType<IVDocumentSignConfirmModel>>(VDocumentSignConfirmModelTid).toConstructor<IVDocumentSignConfirmModel>(VDocumentSignConfirmModel);
  }
}
