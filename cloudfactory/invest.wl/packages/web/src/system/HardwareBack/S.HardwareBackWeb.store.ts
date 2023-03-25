import { Injectable, IoC } from '@invest.wl/core/src/di/IoC';
import { EventX } from '@invest.wl/common/src/reactive/EventX/EventX';
import { ISRouterService, SRouterServiceTid } from '@invest.wl/system/src/Router/S.Router.types';
import { ISHardwareBackEvent, ISHardwareBackStore } from '@invest.wl/system/src/HardwareBack/S.HardwareBack.types';

@Injectable()
export class SHardwareBackWebStore implements ISHardwareBackStore {
  public onPressX = new EventX<ISHardwareBackEvent>();
  private _router = IoC.get<ISRouterService>(SRouterServiceTid);

  public async init() {
    window.addEventListener('popstate', this._handleBackButtonClick, false);
  }

  private _handleBackButtonClick = (e: PopStateEvent) => {
    const event: ISHardwareBackEvent = { appExit: !this._router.canGoBack() };
    this.onPressX.emit(event);
    // TODO:
    if (event.appExit == true) {
      // Call Back button programmatically as per user confirmation.
      // history.back();
      // Uncomment below line to redirect to the previous page instead.
      // window.location = document.referrer // Note: IE11 is not supporting this.
    } else {
      // Stay on the current page.
      // history.pushState(null, null, window.location.pathname);
    }
  };
}
