import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { DOwnerCase, DOwnerCaseTid } from './case/D.Owner.case';
import { DOwnerStore } from './D.Owner.store';
import { DOwnerStoreTid } from './D.Owner.types';
import { DOwnerModel, DOwnerModelTid, IDOwnerModel } from './model/D.Owner.model';

export class DOwnerModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DOwnerStore>(DOwnerStoreTid).to(DOwnerStore).inSingletonScope();
    ioc.bind<DOwnerCase>(DOwnerCaseTid).to(DOwnerCase);
    ioc.bind<NewableType<IDOwnerModel>>(DOwnerModelTid).toConstructor<IDOwnerModel>(DOwnerModel);
  }
}
