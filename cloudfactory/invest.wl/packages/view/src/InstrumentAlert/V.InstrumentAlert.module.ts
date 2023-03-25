import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { IVInstrumentAlertModel, VInstrumentAlertModel, VInstrumentAlertModelTid } from './model/V.InstrumentAlert.model';
import { IVInstrumentAlertCountModel, VInstrumentAlertCountModel, VInstrumentAlertCountModelTid } from './model/V.InstrumentAlertCount.model';
import { IVInstrumentAlertSetModel, VInstrumentAlertSetModel, VInstrumentAlertSetModelTid } from './model/V.InstrumentAlertSet.model';
import { VInstrumentAlertCreatePresent, VInstrumentAlertCreatePresentTid } from './present/V.InstrumentAlertCreate.present';
import { VInstrumentAlertListPresent, VInstrumentAlertListPresentTid } from './present/V.InstrumentAlertList.present';

export class VInstrumentAlertModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<VInstrumentAlertListPresent>(VInstrumentAlertListPresentTid).to(VInstrumentAlertListPresent);
    ioc.bind<VInstrumentAlertCreatePresent>(VInstrumentAlertCreatePresentTid).to(VInstrumentAlertCreatePresent);
    ioc.bind<NewableType<IVInstrumentAlertModel>>(VInstrumentAlertModelTid).toConstructor<IVInstrumentAlertModel>(VInstrumentAlertModel);
    ioc.bind<NewableType<IVInstrumentAlertSetModel>>(VInstrumentAlertSetModelTid).toConstructor<IVInstrumentAlertSetModel>(VInstrumentAlertSetModel);
    ioc.bind<NewableType<IVInstrumentAlertCountModel>>(VInstrumentAlertCountModelTid).toConstructor<IVInstrumentAlertCountModel>(VInstrumentAlertCountModel);
  }
}
