import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { IVInvestIdeaModel, VInvestIdeaModel, VInvestIdeaModelTid } from './model/V.InvestIdea.model';
import { IVInvestIdeaItemModel, VInvestIdeaItemModel, VInvestIdeaItemModelTid } from './model/V.InvestIdeaItem.model';
import { VInvestIdeaPresent, VInvestIdeaPresentTid } from './present/V.InvestIdea.present';
import { VInvestIdeaListPresent, VInvestIdeaListPresentTid } from './present/V.InvestIdeaList.present';

export class VInvestIdeaModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<VInvestIdeaListPresent>(VInvestIdeaListPresentTid).to(VInvestIdeaListPresent);
    ioc.bind<VInvestIdeaPresent>(VInvestIdeaPresentTid).to(VInvestIdeaPresent);
    ioc.bind<NewableType<IVInvestIdeaModel>>(VInvestIdeaModelTid).toConstructor<IVInvestIdeaModel>(VInvestIdeaModel);
    ioc.bind<NewableType<IVInvestIdeaItemModel>>(VInvestIdeaItemModelTid).toConstructor<IVInvestIdeaItemModel>(VInvestIdeaItemModel);
  }
}
