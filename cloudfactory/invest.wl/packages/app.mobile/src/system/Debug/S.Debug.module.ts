import { IoC, IocContainer, IocModule } from '@invest.wl/core';
import { SDebugLoginCommand, SDebugLoginCommandTid } from './command/S.DebugLogin.command';
import { SDebugYellowBoxCommand, SDebugYellowBoxCommandTid } from './command/S.DebugYellowBox.command';
import { SDebugService } from './S.Debug.service';
import { SDebugStore } from './S.Debug.store';
import { SDebugServiceTid, SDebugStoreTid } from './S.Debug.types';

export class SDebugModule extends IocModule {
  private _loginCommand = IoC.get<SDebugLoginCommand>(SDebugLoginCommandTid);
  private _yellowBoxCommand = IoC.get<SDebugYellowBoxCommand>(SDebugYellowBoxCommandTid);

  public configure(ioc: IocContainer): void {
    ioc.bind<SDebugStore>(SDebugStoreTid).to(SDebugStore).inSingletonScope();
    // not singleton!
    ioc.bind<SDebugService>(SDebugServiceTid).to(SDebugService);
    ioc.bind<SDebugLoginCommand>(SDebugLoginCommandTid).to(SDebugLoginCommand).inSingletonScope();
    ioc.bind<SDebugYellowBoxCommand>(SDebugYellowBoxCommandTid).to(SDebugYellowBoxCommand).inSingletonScope();
  }

  public async init() {
    await Promise.all([this._loginCommand.init(), this._yellowBoxCommand.init()]);
  }
}
