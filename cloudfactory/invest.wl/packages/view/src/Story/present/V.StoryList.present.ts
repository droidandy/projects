import { MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DStoryListCase, DStoryListCaseTid, IDStoryListCaseProps } from '@invest.wl/domain';
import { VStoryItemModel, VStoryItemModelTid } from '../model/V.StoryItem.model';

export const VStoryListPresentTid = Symbol.for('VStoryListPresentTid');

export interface IVStoryListPresentProps extends IDStoryListCaseProps {
}

@Injectable()
export class VStoryListPresent {
  public listX = new MapX.VList(this._case.listX.source,
    () => this._case.listX.list, (m) => new this.modelItem(m));

  constructor(
    @Inject(DStoryListCaseTid) private _case: DStoryListCase,
    @Inject(VStoryItemModelTid) private modelItem: Newable<typeof VStoryItemModel>,
  ) {}

  public init(props: IVStoryListPresentProps) {
    this._case.init(props);
  }
}
