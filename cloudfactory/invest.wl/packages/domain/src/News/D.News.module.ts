import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { DNewsCase, DNewsCaseTid } from './case/D.News.case';
import { DNewsListCase, DNewsListCaseTid } from './case/D.NewsList.case';
import { DNewsGateway, DNewsGatewayTid } from './D.News.gateway';
import { DNewsModel, DNewsModelTid, IDNewsModel } from './model/D.News.model';
import { DNewsItemModel, DNewsItemModelTid, IDNewsItemModel } from './model/D.NewsItem.model';

export class DNewsModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DNewsGateway>(DNewsGatewayTid).to(DNewsGateway).inSingletonScope();
    ioc.bind<DNewsCase>(DNewsCaseTid).to(DNewsCase);
    ioc.bind<DNewsListCase>(DNewsListCaseTid).to(DNewsListCase);
    ioc.bind<NewableType<IDNewsModel>>(DNewsModelTid).toConstructor<IDNewsModel>(DNewsModel);
    ioc.bind<NewableType<IDNewsItemModel>>(DNewsItemModelTid).toConstructor<IDNewsItemModel>(DNewsItemModel);
  }
}
