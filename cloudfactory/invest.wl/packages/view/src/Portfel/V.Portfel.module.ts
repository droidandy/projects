import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { IVPortfelMVHistoryModel, VPortfelMVHistoryModel, VPortfelMVHistoryModelTid } from './model/V.PortfelMVHistory.model';
import { IVPortfelPLByInstrumentModel, VPortfelPLByInstrumentModel, VPortfelPLByInstrumentModelTid } from './model/V.PortfelPLByInstrument.model';
import { IVPortfelPLGroupModel, VPortfelPLGroupModel, VPortfelPLGroupModelTid } from './model/V.PortfelPLGroup.model';
import { IVPortfelPLHistoryModel, VPortfelPLHistoryModel, VPortfelPLHistoryModelTid } from './model/V.PortfelPLHistory.model';
import { IVPortfelSummaryModel, VPortfelSummaryModel, VPortfelSummaryModelTid } from './model/V.PortfelSummary.model';
import { IVPortfelSummaryGroupModel, VPortfelSummaryGroupModel, VPortfelSummaryGroupModelTid } from './model/V.PortfelSummaryGroup.model';
import { IVPortfelYieldHistoryModel, VPortfelYieldHistoryModel, VPortfelYieldHistoryModelTid } from './model/V.PortfelYieldHistory.model';
import { VPortfelPresent, VPortfelPresentTid } from './present/V.Portfel.present';
import { VPortfelComposedPresent, VPortfelComposedPresentTid } from './present/V.PortfelComposed.present';
import { VPortfelInstrumentTypePresent, VPortfelInstrumentTypePresentTid } from './present/V.PortfelInstrumentType.present';
import { VPortfelOfInstrumentPresent, VPortfelOfInstrumentPresentTid } from './present/V.PortfelOfInstrument.present';
import { VPortfelStore, VPortfelStoreTid } from './V.Portfel.store';

export class VPortfelModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<VPortfelStore>(VPortfelStoreTid).to(VPortfelStore).inSingletonScope();
    ioc.bind<VPortfelPresent>(VPortfelPresentTid).to(VPortfelPresent);
    ioc.bind<VPortfelOfInstrumentPresent>(VPortfelOfInstrumentPresentTid).to(VPortfelOfInstrumentPresent);
    ioc.bind<VPortfelComposedPresent>(VPortfelComposedPresentTid).to(VPortfelComposedPresent);
    ioc.bind<VPortfelInstrumentTypePresent>(VPortfelInstrumentTypePresentTid).to(VPortfelInstrumentTypePresent);
    ioc.bind<NewableType<IVPortfelPLByInstrumentModel>>(VPortfelPLByInstrumentModelTid).toConstructor<IVPortfelPLByInstrumentModel>(VPortfelPLByInstrumentModel);
    ioc.bind<NewableType<IVPortfelPLGroupModel>>(VPortfelPLGroupModelTid).toConstructor<IVPortfelPLGroupModel>(VPortfelPLGroupModel);
    ioc.bind<NewableType<IVPortfelSummaryModel>>(VPortfelSummaryModelTid).toConstructor<IVPortfelSummaryModel>(VPortfelSummaryModel);
    ioc.bind<NewableType<IVPortfelSummaryGroupModel>>(VPortfelSummaryGroupModelTid).toConstructor<IVPortfelSummaryGroupModel>(VPortfelSummaryGroupModel);
    ioc.bind<NewableType<IVPortfelYieldHistoryModel>>(VPortfelYieldHistoryModelTid).toConstructor<IVPortfelYieldHistoryModel>(VPortfelYieldHistoryModel);
    ioc.bind<NewableType<IVPortfelMVHistoryModel>>(VPortfelMVHistoryModelTid).toConstructor<IVPortfelMVHistoryModel>(VPortfelMVHistoryModel);
    ioc.bind<NewableType<IVPortfelPLHistoryModel>>(VPortfelPLHistoryModelTid).toConstructor<IVPortfelPLHistoryModel>(VPortfelPLHistoryModel);
  }
}
