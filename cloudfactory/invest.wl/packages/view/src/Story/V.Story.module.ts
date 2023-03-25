import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { IVStoryModel, VStoryModel, VStoryModelTid } from './model/V.Story.model';
import { IVStoryItemModel, VStoryItemModel, VStoryItemModelTid } from './model/V.StoryItem.model';
import { VStoryPresent, VStoryPresentTid } from './present/V.Story.present';
import { VStoryListPresent, VStoryListPresentTid } from './present/V.StoryList.present';

export class VStoryModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<VStoryPresent>(VStoryPresentTid).to(VStoryPresent);
    ioc.bind<VStoryListPresent>(VStoryListPresentTid).to(VStoryListPresent);
    ioc.bind<NewableType<IVStoryModel>>(VStoryModelTid).toConstructor<IVStoryModel>(VStoryModel);
    ioc.bind<NewableType<IVStoryItemModel>>(VStoryItemModelTid).toConstructor<IVStoryItemModel>(VStoryItemModel);
  }
}
