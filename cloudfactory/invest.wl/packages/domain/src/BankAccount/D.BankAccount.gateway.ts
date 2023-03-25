import { AsynX, IAsynXOpts, MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DBankAccountAdapterTid, IDBankAccountAdapter } from './D.BankAccount.types';
import { DBankModel, DBankModelTid } from './model/D.Bank.model';

export const DBankAccountGatewayTid = Symbol.for('DBankAccountGatewayTid');

@Injectable()
export class DBankAccountGateway {
  constructor(
    @Inject(DBankAccountAdapterTid) private _adapter: IDBankAccountAdapter,
    @Inject(DBankModelTid) private _model: Newable<typeof DBankModel>,
  ) { }

  // public list(opts: IAsynXPagedOpts<IBankAccountDTO, STransportAccountService['BankAccountList']>) {
  //   const source = new AsynX.Paged(this._service.BankAccountList.bind(this._service), opts);
  //   return new MapX.DList(source, () => source.data?.data, v => new this.model(v));
  // }

  public search(opts: IAsynXOpts<IDBankAccountAdapter['search']>) {
    const source = new AsynX(this._adapter.search.bind(this._adapter), opts);
    return new MapX.DList(source, () => source.data?.data, v => new this._model(v));
  }

  // public save(opts: IBankAccountSaveRequest) {
  //   return this._service.BankAccountSave(opts);
  // }

  // public delete(opts: IBankAccountDeleteRequest) {
  //   return this._service.BankAccountDelete(opts);
  // }
}
