import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { IVNewsModel, VNewsModel, VNewsModelTid } from './model/V.News.model';
import { IVNewsItemModel, VNewsItemModel, VNewsItemModelTid } from './model/V.NewsItem.model';
import { VNewsPresent, VNewsPresentTid } from './present/V.News.present';
import { VNewsListPresent, VNewsListPresentTid } from './present/V.NewsList.present';

export class VNewsModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<VNewsPresent>(VNewsPresentTid).to(VNewsPresent);
    ioc.bind<VNewsListPresent>(VNewsListPresentTid).to(VNewsListPresent);
    ioc.bind<NewableType<IVNewsModel>>(VNewsModelTid).toConstructor<IVNewsModel>(VNewsModel);
    ioc.bind<NewableType<IVNewsItemModel>>(VNewsItemModelTid).toConstructor<IVNewsItemModel>(VNewsItemModel);
  }
}
