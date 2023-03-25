import { ISRouterContainer, ISRouterResetParams, ISRouterScreen, TObject } from '@invest.wl/core';

export const SRouterStoreTid = Symbol.for('SRouterStoreTid');
export const SRouterServiceTid = Symbol.for('SRouterServiceTid');
export const SRouterListenerTid = Symbol.for('SRouterListenerTid');

export interface ISRouterService {
  resetTo<R extends ISRouterScreen>(name?: R, params?: ISRouterResetParams<R>): void;
  navigateTo<R extends ISRouterScreen>(name: R, params?: TObject): void;
  push<R extends ISRouterScreen>(name: R, params?: TObject): void;
  pop(count?: number): void;
  popToTop(): void;
  replaceTo<R extends ISRouterScreen>(name: R, params?: TObject): void;
  back(): void;
  canGoBack(): boolean;

  routeSearch<R extends ISRouterScreen>(name?: R): R | undefined;
  routeHas<R extends ISRouterScreen>(name?: R): boolean;
}

export interface ISRouterStore {
  container?: ISRouterContainer;
  isActive: { [name: string]: number };
  stackCurrent: ISRouterScreen[];
  stackPrev: ISRouterScreen[];

  init(list: ISRouterScreen[]): void;
  containerSet(container?: ISRouterContainer): void;
  stackSet(routeActiveStack: ISRouterScreen[]): void;
}
