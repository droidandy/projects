import { Injectable } from '@invest.wl/core';
import { ISKeyboardStore } from '@invest.wl/system';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { Keyboard, Platform } from 'react-native';

@Injectable()
export class SKeyboardMobileStore implements ISKeyboardStore {
  @observable public willShow: boolean = false;
  @observable public didShow: boolean = false;

  constructor() {
    makeObservable(this);
  }

  public async init() {
    const ios = Platform.OS === 'ios';
    Keyboard.addListener(ios ? 'keyboardWillShow' : 'keyboardDidShow',
      () => runInAction(() => this.willShow = true));
    Keyboard.addListener(ios ? 'keyboardWillHide' : 'keyboardDidHide',
      () => runInAction(() => this.willShow = false));
    Keyboard.addListener('keyboardDidShow',
      () => runInAction(() => this.didShow = true));
    Keyboard.addListener('keyboardDidHide',
      () => runInAction(() => this.didShow = false));
  }

  @action.bound
  public dismiss() {
    if (this.didShow) Keyboard.dismiss();
  }
}
