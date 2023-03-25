import { Inject, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';
import { DDocumentStore } from '../D.Document.store';
import { DDocumentStoreTid } from '../D.Document.types';

export const DDocumentListCaseTid = Symbol.for('DDocumentListCaseTid');

export interface IDDocumentListCaseProps {
}

@Injectable()
export class DDocumentListCase {
  @observable public props?: IDDocumentListCaseProps;

  constructor(@Inject(DDocumentStoreTid) private _store: DDocumentStore) {
    makeObservable(this);
  }

  @computed
  public get listSelfX() {
    return this._store.listSelfX;
  }

  @action
  public init(props: IDDocumentListCaseProps) {
    this.props = props;
  }
}
