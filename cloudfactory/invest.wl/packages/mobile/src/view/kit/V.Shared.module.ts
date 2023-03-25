import { IoC, IocContainer, IocModule } from '@invest.wl/core';
import { VSwipeableRowStore, VSwipeableRowStoreTid } from './Surface/SwipeableRow/V.SwipeableRow.store';

export class VSharedModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<VSwipeableRowStore>(VSwipeableRowStoreTid).to(VSwipeableRowStore).inSingletonScope();
  }

  public async init() {
    const store = IoC.get<VSwipeableRowStore>(VSwipeableRowStoreTid);
    return store;
  }
}
