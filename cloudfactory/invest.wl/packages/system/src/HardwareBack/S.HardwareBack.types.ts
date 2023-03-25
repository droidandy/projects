import { EventX } from '@invest.wl/common';

export const SHardwareBackStoreTid = Symbol.for('SHardwareBackStoreTid');
export const SHardwareBackConfigTid = Symbol.for('SHardwareBackConfigTid');

export interface ISHardwareBackEvent {
  // в обработчике можно менять значение этих флагов.
  // false - не выходим из приложения | true - выходим
  appExit: boolean;
  // false - не переходим назад | true\undefined - переходим
  goBack?: boolean;
}

export interface ISHardwareBackStore {
  readonly onPressX: EventX<ISHardwareBackEvent>;
  init(): Promise<void>;
}

export interface ISHardwareBackConfig {
  // экран на который уходим прежде чем совсем выйти из приложения
  screenBeforeExit?: string;
}
