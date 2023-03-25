import { MapX, VModalModel } from '@invest.wl/common';
import { EDInstrumentAlertStatus, Inject, Injectable, Newable } from '@invest.wl/core';
import {
  DInstrumentAlertCreateCase,
  DInstrumentAlertCreateCaseTid,
  DInstrumentAlertListCase,
  DInstrumentAlertListCaseTid,
  IDInstrumentAlertCreateCaseProps,
} from '@invest.wl/domain';
import { DNotificationStoreTid, IDNotificationStore } from '@invest.wl/domain/src/Notification/D.Notification.types';
import { action, computed, makeObservable, observable } from 'mobx';
import { VInstrumentSummaryModel, VInstrumentSummaryModelTid } from '../../Instrument/model/V.InstrumentSummary.model';
import { VInstrumentAlertModel, VInstrumentAlertModelTid } from '../model/V.InstrumentAlert.model';
import { VInstrumentAlertSetModel, VInstrumentAlertSetModelTid } from '../model/V.InstrumentAlertSet.model';

export const VInstrumentAlertCreatePresentTid = Symbol.for('VInstrumentAlertCreatePresentTid');

export interface VInstrumentAlertCreatePresentProps extends IDInstrumentAlertCreateCaseProps {
}

@Injectable()
export class VInstrumentAlertCreatePresent {
  @observable public props?: VInstrumentAlertCreatePresentProps;

  public createModal = new VModalModel();
  public setModel = new this._setModel(this.createCase.setModel);

  public listX = new MapX.VList(
    this.listCase.listX.source,
    () => this.listCase.listX.list,
    v => new this._model(v),
  );

  @computed
  public get hasCompleted() {
    return this.listX?.list.filter(a => a.domain.dto.Status === EDInstrumentAlertStatus.Completed).length > 0;
  }

  public instrumentSummaryX = new MapX.V(
    this.createCase.instrumentSummaryX.source,
    () => this.createCase.instrumentSummaryX.model,
    (m) => new this._instrumentSummaryModel(m));

  constructor(
    @Inject(DInstrumentAlertCreateCaseTid) public createCase: DInstrumentAlertCreateCase,
    @Inject(DInstrumentAlertListCaseTid) public listCase: DInstrumentAlertListCase,
    @Inject(VInstrumentAlertModelTid) private _model: Newable<typeof VInstrumentAlertModel>,
    @Inject(VInstrumentAlertSetModelTid) protected _setModel: Newable<typeof VInstrumentAlertSetModel>,
    @Inject(VInstrumentSummaryModelTid) protected _instrumentSummaryModel: Newable<typeof VInstrumentSummaryModel>,
    @Inject(DNotificationStoreTid) private _notification: IDNotificationStore,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: VInstrumentAlertCreatePresentProps) {
    this.props = props;
    this.createCase.init(props);
    this.listCase.init({ ...props.cid.toJSON(true) });
  }

  public dispose() {
    this.dismiss().then();
  }

  public dismiss = async () => {
    this.createModal.close();
    await this.createModal.whenClose();
  };

  public create = async () => {
    this.setModel.dirtySet();
    await this.createCase.create();
    this._notification.successAdd('Уведомление успешно зарегистрировано');
    return this.dismiss();
  };
}
