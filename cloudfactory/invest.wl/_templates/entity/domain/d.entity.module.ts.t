---
to: src/domain/<%= Name %>/D.<%= Name %>.module.ts
---
import { IocContainer, IocModule, NewableType } from '../../common/IoC';
import { D<%= Name %>Const, D<%= Name %>ConstTid } from './D.<%= Name %>.const';
import { D<%= Name %>Service, D<%= Name %>ServiceTid } from './D.<%= Name %>.service';
import { D<%= Name %>Gateway, D<%= Name %>GatewayTid } from './D.<%= Name %>.gateway';
import { D<%= Name %>Store, D<%= Name %>StoreTid } from './D.<%= Name %>.store';
import { D<%= Name %>Case, D<%= Name %>CaseTid } from './case/D.<%= Name %>.case';
import { D<%= Name %>ListCase, D<%= Name %>ListCaseTid } from './case/D.<%= Name %>List.case';
import { ID<%= Name %>Model, D<%= Name %>ModelTid, D<%= Name %>Model } from './model/D.<%= Name %>.model';
import { ID<%= Name %>SetModel, D<%= Name %>SetModelTid, D<%= Name %>SetModel } from './model/D.<%= Name %>Set.model';

export class D<%= Name %>Module extends IocModule {
  protected list: IIocModule[] = [];

  public Configure(ioc: IocContainer): void {
    ioc.bind<D<%= Name %>Const>(D<%= Name %>ConstTid).to(D<%= Name %>Const).inSingletonScope();
    ioc.bind<D<%= Name %>Service>(D<%= Name %>ServiceTid).to(D<%= Name %>Service).inSingletonScope();
    ioc.bind<D<%= Name %>Gateway>(D<%= Name %>GatewayTid).to(D<%= Name %>Gateway).inSingletonScope();
    ioc.bind<D<%= Name %>Store>(D<%= Name %>StoreTid).to(D<%= Name %>Store).inSingletonScope();
    ioc.bind<D<%= Name %>Case>(D<%= Name %>CaseTid).to(D<%= Name %>Case);
    ioc.bind<D<%= Name %>ListCase>(D<%= Name %>ListCaseTid).to(D<%= Name %>ListCase);
    ioc.bind<NewableType<ID<%= Name %>Model>>(D<%= Name %>ModelTid).toConstructor<ID<%= Name %>Model>(D<%= Name %>Model);
    ioc.bind<NewableType<ID<%= Name %>SetModel>>(D<%= Name %>SetModelTid).toConstructor<ID<%= Name %>SetModel>(D<%= Name %>SetModel);
  }
}
