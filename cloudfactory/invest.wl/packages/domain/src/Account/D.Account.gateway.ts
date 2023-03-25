import { AsynX, IAsynXOpts, MapX } from '@invest.wl/common';
import { IDAccountAgreementCreateConfirmRequestDTO, IDAccountAgreementCreateRequestDTO, Inject, Injectable, Newable } from '@invest.wl/core';
import { DAccountAdapterTid, IDAccountAdapter } from './D.Account.types';
import { DAccountUtil } from './D.Account.util';
import { DAccountModel, DAccountModelTid } from './model/D.Account.model';
import { DAccountQUIKModel, DAccountQUIKModelTid } from './model/D.AccountQUIK.model';

export const DAccountGatewayTid = Symbol.for('DAccountGatewayTid');

@Injectable()
export class DAccountGateway {
  constructor(
    @Inject(DAccountAdapterTid) private adapter: IDAccountAdapter,
    @Inject(DAccountModelTid) private model: Newable<typeof DAccountModel>,
    @Inject(DAccountQUIKModelTid) private modelQUIK: Newable<typeof DAccountQUIKModel>,
  ) {}

  public list(opts: IAsynXOpts<IDAccountAdapter['list']>) {
    const source = new AsynX(this.adapter.list.bind(this.adapter), opts);
    return new MapX.DList(source, () => DAccountUtil.order(source.data?.data), lv => new this.model(lv));
  }

  public QUIKList(opts: IAsynXOpts<IDAccountAdapter['quikList']>) {
    const source = new AsynX(this.adapter.quikList.bind(this.adapter), opts);
    return new MapX.DList(source, () => DAccountUtil.order(source.data?.data), lv => new this.modelQUIK(lv));
  }

  public agreementCreate(req: IDAccountAgreementCreateRequestDTO) {
    return this.adapter.agreementCreate(req);
  }

  public agreementCreateCodeResend(req: {}) {
    return this.adapter.agreementCreateCodeResend(req);
  }

  public agreementCreateConfirm(req: IDAccountAgreementCreateConfirmRequestDTO) {
    return this.adapter.agreementCreateConfirm(req);
  }
}
