import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import { IDOwnerAdapter } from '@invest.wl/domain/src/Owner/D.Owner.types';
import { ISConfigStore, SConfigStoreTid } from '@invest.wl/system/src/Config/S.Config.types';

@Injectable()
export class DOwnerAdapter implements IDOwnerAdapter {
  constructor(
    @Inject(SConfigStoreTid) private _cfg: ISConfigStore,
  ) { }

  public get address() {
    return '123112, г. Москва,\nПресненская наб., д.6, стр. 2\nДК «Империя», этаж 13';
  }

  public get phone() {
    return this._cfg.ownerPhoneHelp || '8 800 200-32-35';
  }

  public get phoneCallCenter() {
    return this._cfg.ownerPhoneCallCenter || '8 495 933-32-32';
  }

  public get emailCustomer() {
    return this._cfg.ownerEmailCustomer || 'clients@iticapital.ru';
  }

  public get emailHelp() {
    return this._cfg.ownerEmailHelp || 'support@iticapital.ru';
  }

  public get emailTechnical() {
    return this._cfg.ownerEmailTechnical || 'support@iticapital.ru';
  }
}
