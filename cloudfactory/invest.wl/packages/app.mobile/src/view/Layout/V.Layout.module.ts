import { IocContainer, IocModule } from '@invest.wl/core';
import { VLayoutEntryPresent, VLayoutEntryPresentTid } from './screen/Entry/V.LayoutEntry.present';
import { VLayoutManualPresent, VLayoutManualPresentTid } from './screen/Manual/V.LayoutManual.present';

export class VLayoutModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<VLayoutEntryPresent>(VLayoutEntryPresentTid).to(VLayoutEntryPresent);
    ioc.bind<VLayoutManualPresent>(VLayoutManualPresentTid).to(VLayoutManualPresent);
  }
}
