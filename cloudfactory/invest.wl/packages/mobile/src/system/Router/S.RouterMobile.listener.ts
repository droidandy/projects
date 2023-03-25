import { Inject, Injectable } from '@invest.wl/core';
import { SRouterStoreTid } from '@invest.wl/system';

import { EVRouterScreen } from '@invest.wl/view';
import { NavigationContainerRef, NavigationState } from '@react-navigation/native';
import { reaction } from 'mobx';
import { SRouterMobileStore } from './S.RouterMobile.store';
import { ISRoute } from './S.RouterMobile.types';

@Injectable()
export class SRouterMobileListener {
  private _container?: NavigationContainerRef;

  constructor(
    @Inject(SRouterStoreTid) private _store: SRouterMobileStore,
  ) {}

  public init() {
    reaction(() => this._store.container, (container) => {
      this._stop();
      if (container) {
        this._container = container;
        this._start();
      }
    });
  }

  private _start() {
    this._container?.addListener('state', this._listener);
  }

  private _stop() {
    this._container?.removeListener('state', this._listener);
    this._container = undefined;
  }

  private _handleRouteStateChange(newState?: NavigationState) {
    if (!newState) return;
    const stackActive = this._collectStackActive(newState.routes[newState.index] as ISRoute, []);
    this._store.stackSet(stackActive);
  }

  private _collectStackActive(route: ISRoute, result: EVRouterScreen[]): EVRouterScreen[] {
    if (route && route.name) result.push(route.name as EVRouterScreen);
    if (route?.state?.routes && route.state.index != null) {
      this._collectStackActive(route.state.routes[route.state.index] as ISRoute, result);
    }
    return result;
  }

  private _listener = (event: any) => this._handleRouteStateChange(event.data.state);
}
