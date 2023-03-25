import { DModelXValue, ILambda } from '@invest.wl/common';
import { IoC } from '@invest.wl/core';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { now } from 'mobx-utils';
import moment from 'moment';
import { DStorageLocalStore, DStorageLocalStoreTid } from '../../StorageLocal/D.StorageLocal.store';
import { IDTimerBgModel, IDTimerDTO } from '../D.Timer.types';

type TDTO = IDTimerDTO;

export class DTimerBgModel extends DModelXValue<TDTO> implements IDTimerBgModel {
  private _sl = IoC.get<DStorageLocalStore>(DStorageLocalStoreTid);

  @observable public isStarted: boolean = false;
  @observable private _endTime?: Date;

  @computed
  public get name() {
    return `TimerBg_${this.dto.name}`;
  }

  @computed
  public get timeToEnd() {
    if (this._endTime) {
      now(); // observable now
      const _now = moment();
      let timeToEnd = moment(this._endTime).diff(_now, 'seconds');

      timeToEnd = timeToEnd > 0 ? timeToEnd : 0;
      if (!timeToEnd) this.clear().then();
      return timeToEnd;
    }
    return 0;
  }

  @computed
  public get isEnded() {
    return this.timeToEnd <= 0;
  }

  constructor(dtoLV: ILambda<TDTO>) {
    super(dtoLV);
    makeObservable(this);
  }

  @action.bound
  public async start(timeToEndSec?: number) {
    // определить дату конца таймера
    const endTime = timeToEndSec ? moment().add(timeToEndSec + 1, 'seconds') : await this._savedEndTime();
    const isNeedStartTimer = !!endTime && moment().isBefore(endTime);
    if (isNeedStartTimer) {
      runInAction(() => (this._endTime = endTime!.toDate()));
      await this._sl.set(this.name, this._endTime!.toString());
    }
  }

  @action.bound
  public async clear() {
    if (this._endTime) {
      setTimeout(() => runInAction(() => this._endTime = undefined), 0);
      await this._sl.remove(this.name);
    }
  }

  private async _savedEndTime() {
    const saved = await this._sl.get(this.name);
    return saved ? moment(new Date(saved)) : undefined;
  }
}
