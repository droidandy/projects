import { Injectable } from '@invest.wl/core';

export const DBankAccountStoreTid = Symbol.for('DBankAccountStoreTid');

@Injectable()
export class DBankAccountStore {
  // public listX = this._gw.list({
  //   name: 'DBankAccountStore.listX',
  //   req: () => this._authStore.authenticated ? {
  //     statuses: [EBankAccountStatus.Active, EBankAccountStatus.Blocked],
  //     pagesize: 10,
  //   } : undefined,
  //   offsetKey: 'offset',  pageSizeKey: 'pagesize',
  //   getArray: res => res.data.list,
  // });

  constructor(
    // @Inject(DBankAccountGatewayTid) private _gw: DBankAccountGateway,
    // @Inject(DAuthStoreTid) private _authStore: DAuthStore,
  ) {
    // reaction(() => this._authStore.authenticated,
    //   authenticated => authenticated ? this._list.refresh() : this._list.clear());
  }
}
