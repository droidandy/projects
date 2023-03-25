import { Injectable, ISRouterScreen } from '@invest.wl/core';
import { ISRouterStore } from '@invest.wl/system';
import { NavigationAction, NavigationContainerRef } from '@react-navigation/native';
import difference from 'lodash/difference';
import { action, computed, extendObservable, makeObservable, observable } from 'mobx';

@Injectable()
export class SRouterMobileStore implements ISRouterStore {
  private readonly _pending: NavigationAction[] = [];
  @observable.ref public container?: NavigationContainerRef;
  @observable public screenList: ISRouterScreen[] = [];
  @observable public isActive: { [name: string]: number } = {};

  @observable private _stackCurrent: ISRouterScreen[] = [];
  public stackPrev: ISRouterScreen[] = [];


  @computed
  public get stackCurrent(): ISRouterScreen[] {
    return this._stackCurrent;
  }

  constructor() {
    makeObservable(this);
  }

  @action
  public init(list: ISRouterScreen[]) {
    this.isActive = list.reduce((acc, screen) => {
      acc[screen] = 0;
      return acc;
    }, {} as { [name: string]: number });
  }

  @action
  public containerSet(container?: NavigationContainerRef) {
    this.container = container;
    // process pending actions
    if (!this.container) return;
    while (this._pending.length > 0) {
      this.dispatch(this._pending.shift()!);
    }
  }

  public dispatch(eArgs: NavigationAction) {
    if (!this.container) this._pending.push(eArgs);
    else this.container.dispatch(eArgs);
  }

  @action
  public stackSet(routeActiveStack: ISRouterScreen[]) {
    difference(this._stackCurrent, routeActiveStack).forEach(screen => this._activeSet(screen, false));
    routeActiveStack.forEach(screen => this._activeSet(screen, true));
    this.stackPrev = this._stackCurrent;
    this._stackCurrent = routeActiveStack;
  }

  @action
  private _routeAdd(screen: ISRouterScreen) {
    // DYNAMIC ROUTES
    // https://mobx.js.org/best/pitfalls.html#-object-somenewprop-value-is-not-picked-up
    if (!this.isActive.hasOwnProperty(screen)) {
      extendObservable(this.isActive, { [screen]: 0 });
    }
  }

  @action
  private _activeSet(screen: ISRouterScreen, active: boolean) {
    this._routeAdd(screen);
    this.isActive[screen] = active ? 1 : 0;
  }
}
