import { Inject, Injectable, ISRouterResetParams, ISRouterScreen } from '@invest.wl/core';
import { ISRouterService, SRouterStoreTid } from '@invest.wl/system';
import { CommonActions, StackActions } from '@react-navigation/native';
import { SRouterMobileStore } from './S.RouterMobile.store';

@Injectable()
export class SRouterMobileService implements ISRouterService {
  public static resetPrepare(name: ISRouterScreen, params?: ISRouterResetParams) {
    const reset = { index: 0, routes: [{ name, params }] };
    while (params?.children?.screen) {
      reset.index++;
      reset.routes.push({ name: params.children.screen, params: params.children.params });
      params = params.children.params;
    }
    return reset;
  }

  public static screenListCollect(screen?: ISRouterScreen, params?: ISRouterResetParams) {
    const result: ISRouterScreen[] = [];
    if (screen) result.push(screen);
    while (params?.screen) {
      result.push(params.screen);
      params = params?.params;
    }
    return result;
  }

  constructor(
    @Inject(SRouterStoreTid) private _store: SRouterMobileStore,
  ) {}

  public resetTo(screen?: ISRouterScreen, params?: ISRouterResetParams) {
    const eArgs = CommonActions.reset(SRouterMobileService.resetPrepare(screen || 'Main', params));
    // TODO: есть вариант сделать прогнозируемое активирование экранов, но нужно ли?
    // this._store.stateSet(SRouterWebService.screenListCollect(screen, params));
    this._store.dispatch(eArgs);
  }

  public navigateTo<R extends ISRouterScreen>(screen: R, params?: ISRouterResetParams[R]) {
    const eArgs = CommonActions.navigate(screen, params);
    // TODO: есть вариант сделать прогнозируемое активирование экранов, но нужно ли?
    // this._store.stateSet(SRouterWebService.screenListCollect(screen, params));
    this._store.dispatch(eArgs);
  }

  public push<R extends ISRouterScreen>(screen: R, params?: ISRouterResetParams[R]) {
    const eArgs = StackActions.push(screen, params);
    // this._store.stateSet(this._store.currentStack.concat(screen));
    this._store.dispatch(eArgs);
  }

  public pop(count: number) {
    const eArgs = StackActions.pop(count);
    this._store.dispatch(eArgs);
  }

  public popToTop() {
    const eArgs = StackActions.popToTop();
    this._store.dispatch(eArgs);
  }

  public replaceTo(screen: ISRouterScreen, params?: any) {
    const eArgs = StackActions.replace(screen, params);
    // this._store.stateSet(this._store.currentStack.slice(0, this._store.currentStack.length - 1).concat(screen));
    this._store.dispatch(eArgs);
  }

  public canGoBack() {
    return !!this._store.container?.canGoBack();
  }

  public back() {
    this._store.stackSet(this._store.stackCurrent.slice(0, this._store.stackCurrent.length - 1));
    this._store.dispatch(CommonActions.goBack());
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
