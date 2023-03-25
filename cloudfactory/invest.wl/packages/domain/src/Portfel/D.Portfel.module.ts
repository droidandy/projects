import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { DPortfelCase, DPortfelCaseTid } from './case/D.Portfel.case';
import { DPortfelConfig } from './D.Portfel.config';
import { DPortfelGateway, DPortfelGatewayTid } from './D.Portfel.gateway';
import { DPortfelStore, DPortfelStoreTid } from './D.Portfel.store';
import { DPortfelConfigTid } from './D.Portfel.types';
import { DPortfelMVHistoryModel, DPortfelMVHistoryModelTid, IDPortfelMVHistoryModel } from './model/D.PortfelMVHistory.model';
import { DPortfelPLByInstrumentModel, DPortfelPLByInstrumentModelTid, IDPortfelPLByInstrumentModel } from './model/D.PortfelPLByInstrument.model';
import { DPortfelPLGroupModel, DPortfelPLGroupModelTid, IDPortfelPLGroupModel } from './model/D.PortfelPLGroup.model';
import { DPortfelPLHistoryModel, DPortfelPLHistoryModelTid, IDPortfelPLHistoryModel } from './model/D.PortfelPLHistory.model';
import { DPortfelSummaryModel, DPortfelSummaryModelTid, IDPortfelSummaryModel } from './model/D.PortfelSummary.model';
import { DPortfelSummaryGroupModel, DPortfelSummaryGroupModelTid, IDPortfelSummaryGroupModel } from './model/D.PortfelSummaryGroup.model';
import { DPortfelYieldHistoryModel, DPortfelYieldHistoryModelTid, IDPortfelYieldHistoryModel } from './model/D.PortfelYieldHistory.model';

export class DPortfelModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DPortfelConfig>(DPortfelConfigTid).to(DPortfelConfig).inSingletonScope();
    ioc.bind<DPortfelGateway>(DPortfelGatewayTid).to(DPortfelGateway).inSingletonScope();
    ioc.bind<DPortfelStore>(DPortfelStoreTid).to(DPortfelStore).inSingletonScope();
    ioc.bind<DPortfelCase>(DPortfelCaseTid).to(DPortfelCase);
    ioc.bind<NewableType<IDPortfelPLByInstrumentModel>>(DPortfelPLByInstrumentModelTid)
      .toConstructor<IDPortfelPLByInstrumentModel>(DPortfelPLByInstrumentModel);
    ioc.bind<NewableType<IDPortfelPLGroupModel>>(DPortfelPLGroupModelTid).toConstructor<IDPortfelPLGroupModel>(DPortfelPLGroupModel);
    ioc.bind<NewableType<IDPortfelSummaryModel>>(DPortfelSummaryModelTid).toConstructor<IDPortfelSummaryModel>(DPortfelSummaryModel);
    ioc.bind<NewableType<IDPortfelSummaryGroupModel>>(DPortfelSummaryGroupModelTid).toConstructor<IDPortfelSummaryGroupModel>(DPortfelSummaryGroupModel);
    ioc.bind<NewableType<IDPortfelYieldHistoryModel>>(DPortfelYieldHistoryModelTid).toConstructor<IDPortfelYieldHistoryModel>(DPortfelYieldHistoryModel);
    ioc.bind<NewableType<IDPortfelMVHistoryModel>>(DPortfelMVHistoryModelTid).toConstructor<IDPortfelMVHistoryModel>(DPortfelMVHistoryModel);
    ioc.bind<NewableType<IDPortfelPLHistoryModel>>(DPortfelPLHistoryModelTid).toConstructor<IDPortfelPLHistoryModel>(DPortfelPLHistoryModel);
  }
}
