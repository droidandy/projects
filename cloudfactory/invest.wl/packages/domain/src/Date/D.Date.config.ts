import { EDDateDayPart, Inject, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';
import { DErrorService, DErrorServiceTid } from '../Error/D.Error.service';
import { DDateAdapterTid, IDDateAdapter } from './D.Date.types';

export const DDateConfigTid = Symbol.for('DDateConfigTid');

@Injectable()
export class DDateConfig {
  @observable private _serverOffset = 0;

  public dayPartMap: { [P in EDDateDayPart]: (hour: number) => boolean } = {
    [EDDateDayPart.Morning]: (hour: number) => hour >= 5 && hour <= 11,
    [EDDateDayPart.Afternoon]: (hour: number) => hour >= 12 && hour <= 18,
    [EDDateDayPart.Evening]: (hour: number) => hour >= 19 && hour <= 23,
    [EDDateDayPart.Night]: (hour: number) => hour >= 0 && hour <= 4,
  };

  public get pickerDateMin() {
    return this._adapter.pickerDateMin;
  }

  public get pickerDateMax() {
    return this._adapter.pickerDateMax;
  }

  @computed
  public get serverOffset() {
    const offset = `+${Math.floor(this._serverOffset / 60)}:00`;
    return offset.length === '+N:00'.length
      ? offset.replace('+', '+0') : offset;
  }

  constructor(
    @Inject(DDateAdapterTid) private _adapter: IDDateAdapter,
    @Inject(DErrorServiceTid) private _errorService: DErrorService,
  ) {
    makeObservable(this);
  }

  @action
  public async init() {
    const offset = this._adapter.serverOffsetMin;
    if (!offset && offset !== 0) this._errorService.businessHandle('Серверное время не задано');
    else this._serverOffset = offset;
  }
}
