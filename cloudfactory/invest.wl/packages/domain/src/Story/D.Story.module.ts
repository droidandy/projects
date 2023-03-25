import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { DStoryCase, DStoryCaseTid } from './case/D.Story.case';
import { DStoryListCase, DStoryListCaseTid } from './case/D.StoryList.case';
import { DStoryGateway, DStoryGatewayTid } from './D.Story.gateway';
import { DStoryStore } from './D.Story.store';
import { DStoryStoreTid } from './D.Story.types';
import { DStoryModel, DStoryModelTid, IDStoryModel } from './model/D.Story.model';
import { DStoryItemModel, DStoryItemModelTid, IDStoryItemModel } from './model/D.StoryItem.model';

export class DStoryModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DStoryGateway>(DStoryGatewayTid).to(DStoryGateway).inSingletonScope();
    ioc.bind<DStoryStore>(DStoryStoreTid).to(DStoryStore).inSingletonScope();
    ioc.bind<DStoryCase>(DStoryCaseTid).to(DStoryCase);
    ioc.bind<DStoryListCase>(DStoryListCaseTid).to(DStoryListCase);
    ioc.bind<NewableType<IDStoryModel>>(DStoryModelTid).toConstructor<IDStoryModel>(DStoryModel);
    ioc.bind<NewableType<IDStoryItemModel>>(DStoryItemModelTid).toConstructor<IDStoryItemModel>(DStoryItemModel);
  }
}
