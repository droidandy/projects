import { Inject, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';
import { DNotificationStore } from '../D.Notification.store';
import { DNotificationStoreTid } from '../D.Notification.types';

export const DNotificationSettingCaseTid = Symbol.for('DNotificationSettingCaseTid');

export interface IDNotificationSettingCaseProps {
}

@Injectable()
export class DNotificationSettingCase {
  @observable.ref public props?: IDNotificationSettingCaseProps;

  @computed
  public get setting() {
    return this._store.setting;
  }

  constructor(
    @Inject(DNotificationStoreTid) private _store: DNotificationStore,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDNotificationSettingCaseProps) {
    this.props = props;
  }

  public importantToggle() {
    return this._store.importantToggle();
  }
}
