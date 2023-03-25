import { EDDocumentStatus, Inject, Injectable } from '@invest.wl/core';
import { reaction } from 'mobx';
import { DAuthStore } from '../Auth/D.Auth.store';
import { DAuthStoreTid } from '../Auth/D.Auth.types';
import { DDocumentGateway } from './D.Document.gateway';
import { DDocumentGatewayTid } from './D.Document.types';

@Injectable()
export class DDocumentStore {
  public listSelfX = this._gw.listSelf({
    name: 'DDocumentStore.listSelfX', offsetKey: 'offset', pageSizeKey: 'limit',
    req: () => this._authStore.authenticated ? {
      statusList: [EDDocumentStatus.New, EDDocumentStatus.Processed, EDDocumentStatus.Signed, EDDocumentStatus.Archive],
      limit: 10,
    } : undefined,
    getArray: res => res.data.list,
  });

  constructor(
    @Inject(DDocumentGatewayTid) private _gw: DDocumentGateway,
    @Inject(DAuthStoreTid) private _authStore: DAuthStore,
  ) {
    reaction(() => this._authStore.authenticated,
      (authenticated) => authenticated ? this.listSelfX.source.refresh() : this.listSelfX.source.clear());
  }
}
