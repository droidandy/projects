import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { DErrorConfig, DErrorConfigTid } from './D.Error.config';
import { DErrorService, DErrorServiceTid } from './D.Error.service';
import { DErrorStore, DErrorStoreTid } from './D.Error.store';
import { DErrorBusinessModel, DErrorBusinessModelTid, IDErrorBusinessModel } from './model/D.ErrorBusiness.model';
import { DErrorProgModel, DErrorProgModelTid, IDErrorProgModel } from './model/D.ErrorProg.model';

export class DErrorModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DErrorConfig>(DErrorConfigTid).to(DErrorConfig).inSingletonScope();
    ioc.bind<DErrorService>(DErrorServiceTid).to(DErrorService).inSingletonScope();
    ioc.bind<DErrorStore>(DErrorStoreTid).to(DErrorStore).inSingletonScope();
    ioc.bind<NewableType<IDErrorBusinessModel>>(DErrorBusinessModelTid).toConstructor<IDErrorBusinessModel>(DErrorBusinessModel);
    ioc.bind<NewableType<IDErrorProgModel>>(DErrorProgModelTid).toConstructor<IDErrorProgModel>(DErrorProgModel);
  }
}
