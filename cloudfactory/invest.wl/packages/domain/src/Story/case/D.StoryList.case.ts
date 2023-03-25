import { Inject, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';
import { DStoryStore } from '../D.Story.store';
import { DStoryStoreTid } from '../D.Story.types';

export const DStoryListCaseTid = Symbol.for('DStoryListCaseTid');

export interface IDStoryListCaseProps {
}

@Injectable()
export class DStoryListCase {
  @observable.ref public props?: IDStoryListCaseProps;

  @computed
  public get listX() {
    return this._store.listX;
  }

  constructor(
    @Inject(DStoryStoreTid) private _store: DStoryStore,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDStoryListCaseProps) {
    this.props = props;
  }
}
