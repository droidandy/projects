import { Inject, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';
import { DOwnerStore } from '../D.Owner.store';
import { DOwnerStoreTid } from '../D.Owner.types';

export const DOwnerCaseTid = Symbol.for('DOwnerCaseTid');

export interface IDOwnerCaseProps {
}

@Injectable()
export class DOwnerCase {
  @observable.ref public props?: IDOwnerCaseProps;

  @computed
  public get model() {
    return this._store.model;
  };

  constructor(
    @Inject(DOwnerStoreTid) private _store: DOwnerStore,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDOwnerCaseProps) {
    this.props = props;
  }
}
