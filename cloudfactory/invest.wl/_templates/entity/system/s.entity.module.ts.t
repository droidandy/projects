---
to: src/system/<%= Name %>/S.<%= Name %>.module.ts
---
import { IocContainer, IocModule } from '../../common/IoC';
import { S<%= Name %>Transport, S<%= Name %>TransportTid } from './S.<%= Name %>.transport';

export class S<%= Name %>Module extends IocModule {
  public Configure(ioc: IocContainer): void {
    ioc.bind<S<%= Name %>Transport>(S<%= Name %>TransportTid).to(S<%= Name %>Transport);
  }
}
