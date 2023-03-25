import { IDDateAdapter } from '@invest.wl/domain/src/Date/D.Date.types';
import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import { ISConfigStore, SConfigStoreTid } from '@invest.wl/system/src/Config/S.Config.types';

@Injectable()
export class DDateAdapter implements IDDateAdapter {
  constructor(
    @Inject(SConfigStoreTid) private _cfg: ISConfigStore,
  ) {}

  public get serverOffsetMin() {
    return this._cfg.dateServerUtcOffset;
  }

  public get pickerDateMin() {
    return this._cfg.datePickerMinDate;
  }

  public get pickerDateMax() {
    return this._cfg.datePickerMaxDate;
  }
}
