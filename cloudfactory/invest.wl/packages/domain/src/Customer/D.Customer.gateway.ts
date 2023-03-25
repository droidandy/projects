import { AsynX, IAsynXOpts, MapX } from '@invest.wl/common';
import {
  IDCustomerCreateSelfConfirmRequestDTO,
  IDCustomerCreateSelfRequestDTO,
  IDCustomerPreferenceSetRequestDTO,
  Inject,
  Injectable,
  Newable,
} from '@invest.wl/core';
import { DCustomerAdapterTid, IDCustomerAdapter } from './D.Customer.types';
import { DCustomerAccountSelfModel, DCustomerAccountSelfModelTid } from './model/D.CustomerAccountSelf.model';

@Injectable()
export class DCustomerGateway {
  constructor(
    @Inject(DCustomerAdapterTid) private _adapter: IDCustomerAdapter,
    @Inject(DCustomerAccountSelfModelTid) private _selfModel: Newable<typeof DCustomerAccountSelfModel>,
  ) {}

  accountSelf(opts: IAsynXOpts<IDCustomerAdapter['accountSelf']>) {
    const source = new AsynX(this._adapter.accountSelf.bind(this._adapter), opts);
    return new MapX.D(source, () => source.data?.data, lv => new this._selfModel(lv));
  }

  preferenceSet(req: IDCustomerPreferenceSetRequestDTO) {
    return this._adapter.preferenceSet(req);
  }

  createSelf(req: IDCustomerCreateSelfRequestDTO) {
    return this._adapter.createSelf(req);
  }

  createSelfCodeResend(req: {}) {
    return this._adapter.createSelfCodeResend(req);
  }

  createSelfConfirm(req: IDCustomerCreateSelfConfirmRequestDTO) {
    return this._adapter.createSelfConfirm(req);
  }
}
