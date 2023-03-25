import { Inject, Injectable } from '@invest.wl/core';
import { action, makeObservable, observable } from 'mobx';
import { DBankAccountStore, DBankAccountStoreTid } from '../D.BankAccount.store';

export const DBankAccountListCaseTid = Symbol.for('DBankAccountListCaseTid');

export interface IDBankAccountListCaseProps {
}

@Injectable()
export class DBankAccountListCase {
  @observable.ref public props?: IDBankAccountListCaseProps;

  // @computed
  // public get listX() {
  //   return this._store.listX;
  // }

  constructor(@Inject(DBankAccountStoreTid) _store: DBankAccountStore) {
    makeObservable(this);
  }

  @action
  public init(props: IDBankAccountListCaseProps) {
    this.props = props;
  }
}
