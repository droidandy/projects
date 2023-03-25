import { MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DNotificationListCase, DNotificationListCaseTid, IDNotificationListCaseProps } from '@invest.wl/domain';
import { action, makeObservable, observable } from 'mobx';
import { VNotificationModel, VNotificationModelTid } from '../model/V.Notification.model';
import { VNotificationImportantModel, VNotificationImportantModelTid } from '../model/V.NotificationImportant.model';

export const VNotificationListPresentTid = Symbol.for('VNotificationListPresentTid');

export interface IVNotificationListPresentProps extends IDNotificationListCaseProps {
}

@Injectable()
export class VNotificationListPresent {
  @observable.ref public props?: IDNotificationListCaseProps;

  public listX = new MapX.BaseList(
    () => this._case.listX.list.filter(n => !n.isImportant),
    v => new this.model(v),
  );

  public importantListX = new MapX.BaseList(
    () => this._case.listX.list.filter(n => n.isImportant),
    v => new this.modelImportant(v),
  );

  constructor(
    @Inject(DNotificationListCaseTid) private _case: DNotificationListCase,
    @Inject(VNotificationModelTid) private model: Newable<typeof VNotificationModel>,
    @Inject(VNotificationImportantModelTid) private modelImportant: Newable<typeof VNotificationImportantModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDNotificationListCaseProps) {
    this.props = props;
  }
}
