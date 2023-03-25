import { MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import {
  DNotificationStore,
  DNotificationStoreTid,
  DOrderCreateCase,
  DOrderCreateCaseTid,
  DOrderCreateConfirmSMSStrategy,
  IDOrderCreateCaseProps,
} from '@invest.wl/domain';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { VAccountQUIKModel, VAccountQUIKModelTid } from '../../Account/model/V.AccountQUIK.model';
import { VInstrumentInfoModel, VInstrumentInfoModelTid } from '../../Instrument/model/V.InstrumentInfo.model';
import { VTimerBgModel } from '../../Timer/model/V.TimerBg.model';
import { VOrderCreateModel, VOrderCreateModelTid } from '../model/V.OrderCreate.model';
import { VOrderCreateConfirmModel, VOrderCreateConfirmModelTid } from '../model/V.OrderCreateConfirm.model';
import { VOrderInfoModel, VOrderInfoModelTid } from '../model/V.OrderInfo.model';

export const VOrderCreatePresentTid = Symbol.for('VOrderCreatePresentTid');

export interface IVOrderCreatePresentProps extends IDOrderCreateCaseProps {
}

@Injectable()
export class VOrderCreatePresent {
  @observable.ref public props?: IVOrderCreatePresentProps;
  @observable public isCreated = false;

  public createModel = new this.modelCreate(this.createCase.createModel);
  public confirmModel = new this.modelCreateConfirm(this.createCase.confirmModel);
  public timerModel = this.createCase.strategy instanceof DOrderCreateConfirmSMSStrategy ?
    new VTimerBgModel(this.createCase.strategy.timerModel) : undefined;

  public instrumentX = new MapX.V(this.createCase.instrumentX.source,
    () => this.createCase.instrumentX.model, (m) => new this.modelInstrumentInfo(m));

  public accountListX = new MapX.VList(this.createCase.accountListX.source,
    () => this.createCase.accountListX.list, (m) => new this.modelQUIK(m));

  public infoX = new MapX.V(this.createCase.infoX.source,
    () => this.createCase.infoX.model, (m) => new this.modelInfo(m));

  constructor(
    @Inject(DOrderCreateCaseTid) public createCase: DOrderCreateCase,
    @Inject(DNotificationStoreTid) private _notificationStore: DNotificationStore,
    @Inject(VOrderCreateModelTid) private modelCreate: Newable<typeof VOrderCreateModel>,
    @Inject(VOrderCreateConfirmModelTid) private modelCreateConfirm: Newable<typeof VOrderCreateConfirmModel>,
    @Inject(VInstrumentInfoModelTid) private modelInstrumentInfo: Newable<typeof VInstrumentInfoModel>,
    @Inject(VAccountQUIKModelTid) private modelQUIK: Newable<typeof VAccountQUIKModel>,
    @Inject(VOrderInfoModelTid) private modelInfo: Newable<typeof VOrderInfoModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVOrderCreatePresentProps) {
    this.props = props;
    this.createCase.init(props);
  }

  public dispose() {
    this.createCase.dispose();
  }

  @action.bound
  public async create() {
    this.createModel.dirtySet();
    await this.createCase.create();
    runInAction(() => (this.isCreated = true));
  }

  @action.bound
  public async confirm() {
    this.confirmModel.dirtySet();
    await this.createCase.confirm();
    this._notificationStore.successAdd('Заявка успешно создана');
  }

  @action.bound
  public async cancel() {
    this.createCase.cancel();
    this.isCreated = false;
  }
}
