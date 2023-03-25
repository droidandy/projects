import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DDocumentSignCase, DDocumentSignCaseTid, IDDocumentSignCaseProps } from '@invest.wl/domain';
import { VTimerBgModel } from '../../Timer/model/V.TimerBg.model';
import { VDocumentSignConfirmModel, VDocumentSignConfirmModelTid } from '../model/V.DocumentSignConfirm.model';

export const VDocumentSignPresentTid = Symbol.for('VDocumentSignPresentTid');

export interface IVDocumentSignPresentProps extends IDDocumentSignCaseProps {
}

@Injectable()
export class VDocumentSignPresent {
  public confirmModel = new this._confirmModel(this.cse.confirmModel);
  public timer = new VTimerBgModel(this.cse.timer);

  constructor(
    @Inject(DDocumentSignCaseTid) public cse: DDocumentSignCase,
    @Inject(VDocumentSignConfirmModelTid) private _confirmModel: Newable<typeof VDocumentSignConfirmModel>,
  ) { }

  public init(props: IVDocumentSignPresentProps) {
    return this.cse.init(props);
  }
}
