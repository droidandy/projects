import { Inject, Injectable, TModelId } from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';
import { DAccountStore, DAccountStoreTid } from '../D.Account.store';

export const DAccountListCaseTid = Symbol.for('DAccountListCaseTid');

export interface IDAccountListCaseProps {
}

@Injectable()
export class DAccountListCase {
  @observable.ref public props?: IDAccountListCaseProps;

  @computed
  public get listX() {
    return this._store.listX;
  }

  @computed
  public get agreementListX() {
    return this._store.agreementListX;
  }

  constructor(
    @Inject(DAccountStoreTid) private _store: DAccountStore,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDAccountListCaseProps) {
    this.props = props;
  }

  @action
  public agreementToggle(id: TModelId) {
    const idList = [...this._store.agreementIdListSelected];
    const index = idList.indexOf(id);
    if (index !== -1) idList.push(id);
    else idList.splice(index, 1);
    this._store.agreementIdListSelect(idList);
  }

  @action
  public toggle(id: TModelId) {
    const idList = [...this._store.idListSelected];
    const index = idList.indexOf(id);
    if (index !== -1) idList.push(id);
    else idList.splice(index, 1);
    this._store.idListSelect(idList);
  }
}
