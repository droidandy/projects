import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { DInvestIdeaCase, DInvestIdeaCaseTid } from './case/D.InvestIdea.case';
import { DInvestIdeaListCase, DInvestIdeaListCaseTid } from './case/D.InvestIdeaList.case';
import { DInvestIdeaGateway, DInvestIdeaGatewayTid } from './D.InvestIdea.gateway';
import { DInvestIdeaModel, DInvestIdeaModelTid, IDInvestIdeaModel } from './model/D.InvestIdea.model';
import { DInvestIdeaItemModel, DInvestIdeaItemModelTid, IDInvestIdeaItemModel } from './model/D.InvestIdeaItem.model';

export class DInvestIdeaModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DInvestIdeaGateway>(DInvestIdeaGatewayTid).to(DInvestIdeaGateway).inSingletonScope();
    ioc.bind<DInvestIdeaCase>(DInvestIdeaCaseTid).to(DInvestIdeaCase);
    ioc.bind<DInvestIdeaListCase>(DInvestIdeaListCaseTid).to(DInvestIdeaListCase);
    ioc.bind<NewableType<IDInvestIdeaModel>>(DInvestIdeaModelTid).toConstructor<IDInvestIdeaModel>(DInvestIdeaModel);
    ioc.bind<NewableType<IDInvestIdeaItemModel>>(DInvestIdeaItemModelTid).toConstructor<IDInvestIdeaItemModel>(DInvestIdeaItemModel);
  }
}
