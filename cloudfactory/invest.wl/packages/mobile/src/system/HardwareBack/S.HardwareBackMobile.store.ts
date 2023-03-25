import { EventX } from '@invest.wl/common';
import { Injectable, IoC } from '@invest.wl/core';
import { ISHardwareBackEvent, ISHardwareBackStore, ISRouterService, SRouterServiceTid } from '@invest.wl/system';
import { BackHandler } from 'react-native';

// TODO: почему-то не всегда событие проходит через обработчик представленный ниже,
// но если локально на экране снова подписаться "нативно" (ISHardwareBackHolderProps.native), то всё ОК

@Injectable()
export class SHardwareBackMobileStore implements ISHardwareBackStore {
  public onPressX = new EventX<ISHardwareBackEvent>();
  private _router = IoC.get<ISRouterService>(SRouterServiceTid);

  public async init() {
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
  }

  private _backHandler = () => {
    const canGoBack = this._router.canGoBack();
    const event: ISHardwareBackEvent = { appExit: !canGoBack };
    this.onPressX.emit(event);
    if (event.appExit) BackHandler.exitApp();
    return event.goBack != null ? !event.goBack : !event.appExit;
  };
}
