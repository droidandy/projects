import { action, computed, makeObservable, observable } from 'mobx';
import { Injectable } from '@invest.wl/core/src/di/IoC';
import { ISRouterContainer, ISRouterScreen } from '@invest.wl/core/src/dto/Router/S.Router.dto';
import { ISRouterContainerItemWeb, ISRouterWebStore } from './S.RouterWeb.types';


@Injectable()
export class SRouterWebStore implements ISRouterWebStore {
  @observable.ref public container = window.history as unknown as ISRouterContainer & History;
  @observable public screenList: ISRouterScreen[] = [];
  @observable public isActive: { [name: string]: number } = {};

  @observable public list: ISRouterContainerItemWeb[] = [];

  @computed
  public get stackCurrent(): ISRouterScreen[] {
    return this.list.map(item => item.screen);
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
  public containerSet() {
    // not need
  }
}
