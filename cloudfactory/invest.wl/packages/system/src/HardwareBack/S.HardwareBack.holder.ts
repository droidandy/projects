import { IoC } from '@invest.wl/core';
import { BackHandler } from 'react-native';
import { ISHardwareBackEvent, ISHardwareBackStore, SHardwareBackStoreTid } from './S.HardwareBack.types';

export interface ISHardwareBackHolderProps {
  // создаем новый слушатель к нативному событию
  native?: boolean;
}

export class SHardwareBackHolder {
  private _backHandlerStore = IoC.get<ISHardwareBackStore>(SHardwareBackStoreTid);
  private _subscription?: () => void;
  private _handler?: (event?: ISHardwareBackEvent) => void;

  constructor(private _props?: ISHardwareBackHolderProps) {}

  public subscribe(handler: (event?: ISHardwareBackEvent) => void) {
    this._subscription?.();
    if (this._props?.native) {
      this._handler = handler;
      BackHandler.addEventListener('hardwareBackPress', this._backNativeHandler);
      this._subscription = () => BackHandler.removeEventListener('hardwareBackPress', this._backNativeHandler);
    } else {
      this._subscription = this._backHandlerStore.onPressX.subscribe(handler);
    }
  }

  public dispose() {
    if (this._subscription) {
      this._subscription();
      this._subscription = undefined;
    }
  }

  private _backNativeHandler = () => {
    const event: ISHardwareBackEvent = { appExit: false, goBack: true };
    this._handler?.(event);
    if (event.appExit) BackHandler.exitApp();
    return !event.goBack;
  };
}
