---
to: src/view/<%= Name %>/V.<%= Name %>.module.ts
---
import { IocContainer, IocModule } from '../../common/IoC';

export class V<%= Name %>Module extends IocModule {
  public Configure(ioc: IocContainer): void {
  }
}
