import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { DInstrumentAlertCreateCase, DInstrumentAlertCreateCaseTid } from './case/D.InstrumentAlertCreate.case';
import { DInstrumentAlertListCase, DInstrumentAlertListCaseTid } from './case/D.InstrumentAlertList.case';
import { DInstrumentAlertConfig, DInstrumentAlertConfigTid } from './D.InstrumentAlert.config';
import { DInstrumentAlertGateway, DInstrumentAlertGatewayTid } from './D.InstrumentAlert.gateway';
import { DInstrumentAlertStore, DInstrumentAlertStoreTid } from './D.InstrumentAlert.store';
import { DInstrumentAlertModel, DInstrumentAlertModelTid, IDInstrumentAlertModel } from './model/D.InstrumentAlert.model';
import { DInstrumentAlertCountModel, DInstrumentAlertCountModelTid, IDInstrumentAlertCountModel } from './model/D.InstrumentAlertCount.model';
import { DInstrumentAlertSetModel, DInstrumentAlertSetModelTid, IDInstrumentAlertSetModel } from './model/D.InstrumentAlertSet.model';

export class DInstrumentAlertModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DInstrumentAlertConfig>(DInstrumentAlertConfigTid).to(DInstrumentAlertConfig).inSingletonScope();
    ioc.bind<DInstrumentAlertGateway>(DInstrumentAlertGatewayTid).to(DInstrumentAlertGateway).inSingletonScope();
    ioc.bind<DInstrumentAlertStore>(DInstrumentAlertStoreTid).to(DInstrumentAlertStore).inSingletonScope();
    ioc.bind<DInstrumentAlertListCase>(DInstrumentAlertListCaseTid).to(DInstrumentAlertListCase);
    ioc.bind<DInstrumentAlertCreateCase>(DInstrumentAlertCreateCaseTid).to(DInstrumentAlertCreateCase);
    ioc.bind<NewableType<IDInstrumentAlertModel>>(DInstrumentAlertModelTid).toConstructor<IDInstrumentAlertModel>(DInstrumentAlertModel);
    ioc.bind<NewableType<IDInstrumentAlertSetModel>>(DInstrumentAlertSetModelTid).toConstructor<IDInstrumentAlertSetModel>(DInstrumentAlertSetModel);
    ioc.bind<NewableType<IDInstrumentAlertCountModel>>(DInstrumentAlertCountModelTid).toConstructor<IDInstrumentAlertCountModel>(DInstrumentAlertCountModel);
  }
}
