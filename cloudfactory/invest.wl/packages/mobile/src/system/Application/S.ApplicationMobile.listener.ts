import { EDApplicationState, Inject, Injectable } from '@invest.wl/core';
import { ISApplicationListener, ISApplicationStore, SApplicationStoreTid } from '@invest.wl/system';
import { AppState as AppStateRN, AppStateStatus } from 'react-native';

@Injectable()
export class SApplicationMobileListener implements ISApplicationListener {
  private static _appStateFromString(str?: AppStateStatus): EDApplicationState {
    switch (str) {
      case 'active':
      case 'inactive':
      case 'background':
        return EDApplicationState[str];
      default:
        return EDApplicationState.unknown;
    }
  }

  constructor(
    @Inject(SApplicationStoreTid) private _appStore: ISApplicationStore,
  ) {}

  public async init() {
    if (__DEV__) console.log('AppStateChangeListener::start()'); // 🐞 ✅
    AppStateRN.addEventListener('change', this._handleAppStateChange);
    await this._handleAppStateChange(AppStateRN.currentState);
  }

  public dispose() {
    if (__DEV__) console.log('AppStateChangeListener::dispose()'); // 🐞 ✅
    AppStateRN.removeEventListener('change', this._handleAppStateChange);
  }

  private _handleAppStateChange = async (nextStateStr: AppStateStatus) => {
    const nextState = SApplicationMobileListener._appStateFromString(nextStateStr);
    if (__DEV__) console.log('AppStateChangeListener::state changed', nextState); // 🐞 ✅
    this._appStore.state = nextState;
  };
}
