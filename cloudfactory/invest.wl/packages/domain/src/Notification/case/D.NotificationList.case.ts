import { Inject, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';
import { DNotificationStore } from '../D.Notification.store';
import { DNotificationStoreTid } from '../D.Notification.types';

export const DNotificationListCaseTid = Symbol.for('DNotificationListCaseTid');

export interface IDNotificationListCaseProps {
}

@Injectable()
export class DNotificationListCase {
  @observable.ref public props?: IDNotificationListCaseProps;

  @computed
  public get listX() {
    return this._store.listX;
  }

  constructor(
    @Inject(DNotificationStoreTid) private _store: DNotificationStore,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDNotificationListCaseProps) {
    this.props = props;
  }
}
