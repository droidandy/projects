import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DOwnerAdapterTid, IDOwnerAdapter } from './D.Owner.types';
import { DOwnerModel, DOwnerModelTid } from './model/D.Owner.model';

@Injectable()
export class DOwnerStore {
  public model = new this._model({
    phone: this._adapter.phone,
    phoneCallCenter: this._adapter.phoneCallCenter,
    address: this._adapter.address,
    emailCustomer: this._adapter.emailCustomer,
    emailHelp: this._adapter.emailHelp,
    emailTechnical: this._adapter.emailTechnical,
  });

  constructor(
    @Inject(DOwnerModelTid) private _model: Newable<typeof DOwnerModel>,
    @Inject(DOwnerAdapterTid) private _adapter: IDOwnerAdapter,
  ) {}
}
