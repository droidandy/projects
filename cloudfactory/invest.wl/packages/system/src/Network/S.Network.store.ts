import { Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';

import { ESNetworkStatus, ISNetworkState, ISNetworkStore } from './S.Network.types';

interface IApiStateReplaceItem {
  url(): string;
  replace(error: ISNetworkState): void;
}

@Injectable()
export class SNetworkStore implements ISNetworkStore {
  public errorReplace: IApiStateReplaceItem[] = [
    // {
    //   url: () => this._const.daDataAddressSuggestion.url,
    //   replace(error) {
    //     if (error.httpStatus === 403) {
    //       error.httpStatus = 400;
    //       if (error.apiError) {
    //         error.apiError.status = 400;
    //         error.apiError.message = 'Превышено кол-во попыток поиска';
    //       }
    //     }
    //   },
    // },
  ];

  @observable.ref public state: ISNetworkState = {
    httpStatus: 0, apiStatus: ESNetworkStatus.OK,
  };

  @computed
  public get isOk() {
    return this.state.apiStatus === ESNetworkStatus.OK;
  }

  @computed
  public get isUnauthorized() {
    const { apiError, httpStatus } = this.state;
    return !!apiError?.isUnauthorized || !!apiError?.isAccess || httpStatus === 403;
  }

  @computed
  public get isNetwork() {
    return this.state.apiError?.isNetwork || !this.state.httpStatus;
  }

  @computed
  public get isAccess() {
    return !!this.state.apiError?.isAccess;
  }

  constructor() {
    makeObservable(this);
  }

  @action
  public stateSet(state: ISNetworkState) {
    const url = state.apiError?.dto.body?.url;
    url && this.errorReplace.find(v => v.url() === url)?.replace(state);
    this.state = { ...state };
  }
}
