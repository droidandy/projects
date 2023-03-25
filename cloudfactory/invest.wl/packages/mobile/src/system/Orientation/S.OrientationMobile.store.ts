import { Injectable } from '@invest.wl/core';
import { ESOrientationType, ISOrientationStore } from '@invest.wl/system';
import { action, computed, makeObservable, observable } from 'mobx';
import Orientation, { OrientationType } from 'react-native-orientation-locker';

@Injectable()
export class SOrientationMobileStore implements ISOrientationStore {
  @observable private _orientation: OrientationType = 'PORTRAIT' as OrientationType;

  constructor() {
    makeObservable(this);
    // События addOrientationListener на ios симуляторе могут подглючивать при быстром повороте,
    // на это не надо обращать внисмания, на устройстве работает корректно
    Orientation.addOrientationListener(this._onOrientationChange);
    Orientation.getOrientation(this._onOrientationChange);
  }

  public lockToPortrait(): void {
    Orientation.lockToPortrait();
  }

  public unlockAllOrientations(): void {
    Orientation.unlockAllOrientations();
  }

  @computed
  public get appOrientation(): ESOrientationType {
    switch (this._orientation) {
      case 'LANDSCAPE-LEFT':
        return ESOrientationType.LandscapeLeft;
      case 'LANDSCAPE-RIGHT':
        return ESOrientationType.LandscapeRight;
      case 'PORTRAIT':
      case 'PORTRAIT-UPSIDEDOWN':
      case 'UNKNOWN':
      default:
        return ESOrientationType.Portrait;
    }
  }

  @action.bound
  private _onOrientationChange(orientation: OrientationType, deviceOrientation?: OrientationType) {
    // иногда при повороте экрана коллбэк вызывается дважды (во второй раз со значением UNKNOWN)
    // игнорируем это поведение
    if (orientation === 'UNKNOWN') return;
    this._orientation = orientation;
  }

  @computed
  public get isLandscape(): boolean {
    return this.appOrientation === ESOrientationType.LandscapeLeft || this.appOrientation === ESOrientationType.LandscapeRight;
  }
}
