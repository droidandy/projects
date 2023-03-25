import { Inject, Injectable } from '@invest.wl/core';
import { ISRouterService, SRouterServiceTid } from '@invest.wl/system';
import { EVRouterScreen, IVRouterParamsMap, IVRouterResetParams, IVRouterService } from './V.Router.types';

@Injectable()
export class VRouterService implements IVRouterService {
  constructor(
    @Inject(SRouterServiceTid) private _service: ISRouterService,
  ) {}

  public resetTo<R extends EVRouterScreen>(screen: R, params?: IVRouterResetParams) {
    this._service.resetTo(screen, params);
  }

  public navigateTo<R extends EVRouterScreen>(screen: R, params?: IVRouterParamsMap[R]) {
    this._service.navigateTo(screen, params);
  }

  public push<R extends EVRouterScreen>(screen: R, params?: IVRouterParamsMap[R]) {
    this._service.push(screen, params);
  }

  public pop(count: number = 1) {
    this._service.pop(count);
  }

  public popToTop() {
    this._service.popToTop();
  }

  public replaceTo<R extends EVRouterScreen>(screen: R, params?: IVRouterParamsMap[R]) {
    this._service.replaceTo(screen, params);
  }

  public canGoBack() {
    return this._service.canGoBack();
  }

  public back() {
    this._service.back();
  }
}
