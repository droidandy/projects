import { MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DOperationListCase, DOperationListCaseTid, IDOperationListCaseProps } from '@invest.wl/domain';
import { VAccountQUIKModel, VAccountQUIKModelTid } from '../../Account/model/V.AccountQUIK.model';
import { VOperationModel, VOperationModelTid } from '../model/V.Operation.model';

export const VOperationListPresentTid = Symbol.for('VOperationListPresentTid');

export interface IVOperationListPresentProps extends IDOperationListCaseProps {
}

@Injectable()
export class VOperationListPresent {
  public listX = new MapX.VList(this._case.listX.source,
    () => this._case.listX.list, (m) => new this.model(m));

  public accountListX = new MapX.VList(this._case.accountListX.source,
    () => this._case.accountListX.list, (m) => new this.modelAccountQUIK(m));


  constructor(
    @Inject(DOperationListCaseTid) private _case: DOperationListCase,
    @Inject(VOperationModelTid) private model: Newable<typeof VOperationModel>,
    @Inject(VAccountQUIKModelTid) private modelAccountQUIK: Newable<typeof VAccountQUIKModel>,
  ) {}

  public init(props: IVOperationListPresentProps) {
    this._case.init(props);
  }
}
