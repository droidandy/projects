import { SRouterWebStore } from './S.RouterWeb.store';
import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import { ISRouterService, SRouterStoreTid } from '@invest.wl/system/src/Router/S.Router.types';
import { ISRouterParams, ISRouterResetParams, ISRouterScreen } from '@invest.wl/core/src/dto/Router/S.Router.dto';
import { action, makeObservable } from 'mobx';


@Injectable()
export class SRouterWebService implements ISRouterService {
  constructor(
    @Inject(SRouterStoreTid) private _store: SRouterWebStore,
  ) {
    makeObservable(this);
  }

  @action
  public resetTo(screen?: ISRouterScreen, params?: ISRouterResetParams) {
    if (screen) this._store.list = [{ screen, params }];
    else this._store.list = [];
    this._store.container.replaceState(params, params?.title, screen);
  }

  @action
  public navigateTo<R extends ISRouterScreen>(screen: R, params?: ISRouterResetParams[R]) {
    this._store.list.push({ screen, params });
    this._store.container.pushState(params, params?.title, screen);
  }

  @action
  public push<R extends ISRouterScreen>(screen: R, params?: ISRouterResetParams[R]) {
    this._store.list.push({ screen, params });
    this._store.container.pushState(params, params?.title, screen);
  }

  @action
  public pop(count: number = 1) {
    this._store.list = this._store.list.slice(0, this._store.list.length - count);
    this._store.container.go(-count);
  }

  @action
  public popToTop() {
    const count = this._store.list.length;
    this._store.list = this._store.list.slice(0, 1);
    this._store.container.go(-(count - 1));
  }

  @action
  public replaceTo<R extends ISRouterScreen>(screen: R, params?: ISRouterParams<R>) {
    this._store.list[this._store.list.length - 1] = { screen, params };
    this._store.container.replaceState(params, params?.title, screen);
  }

  public canGoBack() {
    return this._store.list.length > 0;
  }

  @action
  public back() {
    this._store.list = this._store.list.slice(0, this._store.list.length - 1);
    window.history.back();
  }

  public routeSearch<R extends ISRouterScreen>(name?: R) {
    if (!name) return;
    const nameUp = name.toUpperCase();
    return this._store.screenList.find(r => r.toUpperCase() === nameUp) as R;
  }

  public routeHas(name?: ISRouterScreen) {
    return !!this.routeSearch(name);
  }
}
