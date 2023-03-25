import {
  ISApplicationListener, ISApplicationStore, SApplicationStoreTid,
} from '@invest.wl/system/src/Application/S.Application.types';
import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import { EDApplicationState } from '@invest.wl/core/src/dto/Application/D.Application.dto';

@Injectable()
export class SApplicationWebListener implements ISApplicationListener {
  constructor(
    @Inject(SApplicationStoreTid) private _appStore: ISApplicationStore,
  ) {}

  public async init() {
    window.addEventListener('focus', this._onFocus);
    window.addEventListener('blur', this._onBlue);
    await this._handleAppStateChange(EDApplicationState.active);
  }

  public dispose() {
    if (__DEV__) console.log('AppStateChangeListener::dispose()'); // 🐞 ✅
    window.removeEventListener('focus', this._onFocus);
    window.removeEventListener('blur', this._onBlue);
  }

  public _onFocus = () => this._handleAppStateChange(EDApplicationState.active);
  public _onBlue = () => this._handleAppStateChange(EDApplicationState.background);

  private _handleAppStateChange = async (nextState: EDApplicationState) => {
    if (__DEV__) console.log('AppStateChangeListener::state changed', nextState); // 🐞 ✅
    this._appStore.state = nextState;
  };
}
