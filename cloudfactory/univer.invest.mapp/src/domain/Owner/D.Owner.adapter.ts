import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
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
    return this._cfg.ownerPhoneHelp || '8 800 775-25-59';
  }

  public get phoneCallCenter() {
    return this._cfg.ownerPhoneCallCenter || '';
  }

  public get emailCustomer() {
    return this._cfg.ownerEmailCustomer || 'info@univer.ru';
  }

  public get emailHelp() {
    return this._cfg.ownerEmailHelp || 'help@univer.ru';
  }

  public get emailTechnical() {
    return this._cfg.ownerEmailTechnical || 'support@univer.ru';
  }
}
