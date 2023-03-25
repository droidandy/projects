import { EDAuthStrategy, IoC, IocContainer, IocModule } from '@invest.wl/core';
import { SAuthListener } from './S.Auth.listener';
import { SAuthService } from './S.Auth.service';
import { SAuthStore } from './S.Auth.store';
import {
  ISAuthConfig,
  ISAuthListener,
  ISAuthSecurityStrategy,
  ISAuthService,
  ISAuthStore,
  SAuthConfigTid,
  SAuthListenerTid,
  SAuthSecurityStrategyTid,
  SAuthServiceTid,
  SAuthStoreTid,
} from './S.Auth.types';
import { SAuthSecurityCredStrategy } from './strategy/S.AuthSecurityCred.strategy';
import { SAuthSecurityRefreshTokenStrategy } from './strategy/S.AuthSecurityRefreshToken.strategy';

export class SAuthModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<ISAuthStore>(SAuthStoreTid).to(SAuthStore).inSingletonScope();
    ioc.bind<ISAuthService>(SAuthServiceTid).to(SAuthService).inSingletonScope();
    ioc.bind<ISAuthListener>(SAuthListenerTid).to(SAuthListener).inSingletonScope();

    const cfg = IoC.get<ISAuthConfig>(SAuthConfigTid);
    ioc.bind<ISAuthSecurityStrategy>(SAuthSecurityStrategyTid).to(
      cfg.strategy === EDAuthStrategy.Cred ? SAuthSecurityCredStrategy : SAuthSecurityRefreshTokenStrategy,
    ).inSingletonScope();
  }

  public init() {
    const store = IoC.get<SAuthStore>(SAuthStoreTid);
    const listener = IoC.get<ISAuthListener>(SAuthListenerTid);
    return Promise.all([store.init(), listener.init()]);
  }
}
