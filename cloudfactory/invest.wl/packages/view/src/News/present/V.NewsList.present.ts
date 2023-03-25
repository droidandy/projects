import { MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DNewsListCase, DNewsListCaseTid, IDNewsListCaseProps } from '@invest.wl/domain';
import { VNewsItemModel, VNewsItemModelTid } from '../model/V.NewsItem.model';

export const VNewsListPresentTid = Symbol.for('VNewsListPresentTid');

export interface IVNewsListPresentProps extends IDNewsListCaseProps {
}

@Injectable()
export class VNewsListPresent {
  public listX = new MapX.VList(this._case.listX.source,
    () => this._case.listX.list, (m) => new this.modelItem(m));

  constructor(
    @Inject(DNewsListCaseTid) private _case: DNewsListCase,
    @Inject(VNewsItemModelTid) private modelItem: Newable<typeof VNewsItemModel>,
  ) {}

  public init(props: IVNewsListPresentProps) {
    this._case.init(props);
  }
}
