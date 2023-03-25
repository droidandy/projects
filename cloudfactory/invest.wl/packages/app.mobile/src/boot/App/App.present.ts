import { Inject, Injectable } from '@invest.wl/core';
import { EVLayoutScreen } from '@invest.wl/view/src/Layout/V.Layout.types';
import { VRouterListener } from '@invest.wl/view/src/Router/V.Router.listener';
import { VRouterListenerTid } from '@invest.wl/view/src/Router/V.Router.types';

export const AppPresentTid = Symbol.for('AppPresentTid');

export interface IAppPresent {
  init(): Promise<void>;
}

@Injectable()
export class AppPresent implements IAppPresent {
  constructor(
    @Inject(VRouterListenerTid) private routerListener: VRouterListener,
  ) { }

  // выполняется каждый раз после закрытия приложения:
  // 1) после "системной назад" при этом приложение НЕ ВЫГРУЖАЕТСЯ из памяти
  // 2) после выгрузки приложения из памяти (убить в списке процессов)
  public async init() {
    this.routerListener.onAppStart({ screen: EVLayoutScreen.LayoutEntry });
  }
}
