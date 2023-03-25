import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DNotificationStore, DNotificationStoreTid, DOwnerCase, DOwnerCaseTid, IDOwnerCaseProps } from '@invest.wl/domain';
import { ISClipboardService, SClipboardServiceTid } from '@invest.wl/system';
import { action, makeObservable } from 'mobx';
import { VOwnerModel, VOwnerModelTid } from '../model/V.Owner.model';
import { IVOwnerInfoPresentProps } from './V.OwnerInfo.present';

export const VOwnerContactPresentTid = Symbol.for('VOwnerContactPresentTid');

export interface IVOwnerContactPresentProps extends IDOwnerCaseProps {
}

@Injectable()
export class VOwnerContactPresent {
  public model = new this._model(this.cse.model);

  constructor(
    @Inject(DOwnerCaseTid) public cse: DOwnerCase,
    @Inject(DNotificationStoreTid) public notification: DNotificationStore,
    @Inject(SClipboardServiceTid) public clipboard: ISClipboardService,
    @Inject(VOwnerModelTid) private _model: Newable<typeof VOwnerModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVOwnerInfoPresentProps) {
    this.cse.init(props);
  }

  public clipboardSet = async (value?: string) => {
    if (!value) return;
    await this.clipboard.stringSet(value);
    this.notification.successAdd('Скопировано');
  };
}
