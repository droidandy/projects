// инициализация проброса эксепшенов js в Crashlitics (попадают в НЕ фатальные краши - изменить нельзя поведение увы)
import { Platform } from 'react-native';
import RNExitApp from 'react-native-exit-app';

declare let global: any;

export function initRN2CrashliticBridge() {
  if (__DEV__) {
    // Don't send exceptions from __DEV__, it's way too noisy!
    // Live reloading and hot reloading in particular lead to tons of noise...
    return;
  }

  const originalHandler = global.ErrorUtils.getGlobalHandler();

  function errorHandler(e: any, isFatal: boolean) {
    if (false) {
      // And then re-throw the exception with the original handler
      if (originalHandler) {
        if (Platform.OS === 'ios') {
          originalHandler(e, isFatal);
        } else {
          setTimeout(() => {
            originalHandler(e, isFatal);
          }, 500);
        }
      }
    }

    // не сохраняется краш на андройде. Мб и на ios - лучше так чем никак.
    setTimeout(() => {
      RNExitApp.exitApp();
    }, 500);
  }

  global.ErrorUtils.setGlobalHandler(errorHandler);
}
