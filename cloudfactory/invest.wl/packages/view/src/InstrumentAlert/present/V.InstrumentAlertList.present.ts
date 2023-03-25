import { MapX } from '@invest.wl/common';
import { EDInstrumentAlertStatus, Inject, Injectable, Newable } from '@invest.wl/core';
import {
  DInstrumentAlertListCase,
  DInstrumentAlertListCaseTid,
  DNotificationStore,
  DNotificationStoreTid,
  IDInstrumentAlertListCaseProps,
} from '@invest.wl/domain';
import { action, computed, makeObservable, observable } from 'mobx';
import { IVInstrumentAlertModel, VInstrumentAlertModel, VInstrumentAlertModelTid } from '../model/V.InstrumentAlert.model';

export const VInstrumentAlertListPresentTid = Symbol.for('VInstrumentAlertListPresentTid');

export interface IVInstrumentAlertListPresentProps extends IDInstrumentAlertListCaseProps {
}

@Injectable()
export class VInstrumentAlertListPresent {
  @observable public props?: IVInstrumentAlertListPresentProps;

  public listX = new MapX.VList(
    this.cse.listX.source,
    () => this.cse.listX.list,
    v => new this.model(v),
  );

  constructor(
    @Inject(DInstrumentAlertListCaseTid) public cse: DInstrumentAlertListCase,
    @Inject(DNotificationStoreTid) private _notification: DNotificationStore,
    @Inject(VInstrumentAlertModelTid) private model: Newable<typeof VInstrumentAlertModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVInstrumentAlertListPresentProps) {
    this.props = props;
    this.cse.init(props);
  }

  @computed
  public get emptyText() {
    return this.props?.status === EDInstrumentAlertStatus.Completed ? 'Нет исполненных уведомлений' : 'Нет активных уведомлений';
  }

  public delete = async (model: IVInstrumentAlertModel) => {
    await this.cse.delete(model.id);
    this._notification.successAdd('Уведомление удалено');
  };

  public viewedUpdate = async (list: IVInstrumentAlertModel[]) => {
    await this.cse.viewedUpdate(list.map(i => i.domain));
  };
}
