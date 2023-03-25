import { Inject, Injectable } from '@invest.wl/core';
import { reaction } from 'mobx';
import { DAuthStore } from '../Auth/D.Auth.store';
import { DAuthStoreTid } from '../Auth/D.Auth.types';
import { DStoryGateway, DStoryGatewayTid } from './D.Story.gateway';

@Injectable()
export class DStoryStore {
  public listX = this._gw.list({
    name: 'DStoryStore.ListX', req: { pageSize: 10 },
    pageSizeKey: 'pageSize', offsetKey: 'offset', getArray: res => res.data,
  });

  constructor(
    @Inject(DStoryGatewayTid) private _gw: DStoryGateway,
    @Inject(DAuthStoreTid) private _authStore: DAuthStore,
  ) {
    reaction(() => this._authStore.authenticated,
      (authenticated) => authenticated ? this.listX.source.refresh() : this.listX.source.clear());
  }
}
