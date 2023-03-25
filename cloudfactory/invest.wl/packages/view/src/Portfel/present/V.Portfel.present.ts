import { MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DPortfelCase, DPortfelCaseTid, IDPortfelCaseProps } from '@invest.wl/domain';
import { VPortfelPLGroupModel, VPortfelPLGroupModelTid } from '../model/V.PortfelPLGroup.model';
import { VPortfelSummaryGroupModel, VPortfelSummaryGroupModelTid } from '../model/V.PortfelSummaryGroup.model';
import { VPortfelYieldHistoryModel, VPortfelYieldHistoryModelTid } from '../model/V.PortfelYieldHistory.model';

export const VPortfelPresentTid = Symbol.for('VPortfelPresentTid');

export interface IVPortfelPresentProps extends IDPortfelCaseProps {
}

@Injectable()
export class VPortfelPresent {
  public plGroupX = new MapX.V(this.cse.plGroupX.source,
    () => this.cse.plGroupX.model, (m) => new this.modelPlGroup(m));

  public summaryX = new MapX.V(this.cse.summaryX.source,
    () => this.cse.summaryX.model, (m) => new this.modelSummaryGroup(m));

  public yieldHistoryX = new MapX.VList(this.cse.yieldHistoryX.source,
    () => this.cse.yieldHistoryX.list, (m) => new this.modelYieldHistory(m));

  constructor(
    @Inject(DPortfelCaseTid) public cse: DPortfelCase,
    @Inject(VPortfelPLGroupModelTid) protected modelPlGroup: Newable<typeof VPortfelPLGroupModel>,
    @Inject(VPortfelSummaryGroupModelTid) protected modelSummaryGroup: Newable<typeof VPortfelSummaryGroupModel>,
    @Inject(VPortfelYieldHistoryModelTid) protected modelYieldHistory: Newable<typeof VPortfelYieldHistoryModel>,
  ) { }

  public init(props: IVPortfelPresentProps) {
    this.cse.init(props);
  }

  public dispose() {
    this.cse.dispose();
  }
}
