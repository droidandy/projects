import { ISRouterStore } from '@invest.wl/system/src/Router/S.Router.types';
import { ISRouterScreen } from '@invest.wl/core';

export interface ISRouterContainerItemWeb {
  screen: ISRouterScreen;
  params?: { [key: string]: any };
}

export interface ISRouterWebStore extends ISRouterStore {
  readonly list: ISRouterContainerItemWeb[];
}
