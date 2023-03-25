import { Inject, Injectable } from '@invest.wl/core';
import { IDOwnerAdapter } from '@invest.wl/domain/src/Owner/D.Owner.types';
import { ISConfigStore, SConfigStoreTid } from '@invest.wl/system/src/Config/S.Config.types';

@Injectable()
export class DOwnerAdapter implements IDOwnerAdapter {
  constructor(
    @Inject(SConfigStoreTid) private _cfg: ISConfigStore,
  ) { }

  public get address() {
    return this._cfg.ownerAddress || '';
  }

  public get phone() {
    return this._cfg.ownerPhoneHelp || '';
  }

  public get phoneCallCenter() {
    return this._cfg.ownerPhoneCallCenter || '';
  }

  public get emailCustomer() {
    return this._cfg.ownerEmailCustomer || 'customer@bank.ru';
  }

  public get emailHelp() {
    return this._cfg.ownerEmailHelp || 'help@bank.ru';
  }

  public get emailTechnical() {
    return this._cfg.ownerEmailTechnical || 'tech@bank.ru';
  }
}
