import { MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DNewsCase, DNewsCaseTid, IDNewsCaseProps } from '@invest.wl/domain';
import { VNewsModel, VNewsModelTid } from '../model/V.News.model';

export const VNewsPresentTid = Symbol.for('VNewsPresentTid');

export interface IVNewsPresentProps extends IDNewsCaseProps {
}

@Injectable()
export class VNewsPresent {
  public infoX = new MapX.V(this._case.infoX.source,
    () => this._case.infoX.model, (m) => new this.model(m));

  constructor(
    @Inject(DNewsCaseTid) private _case: DNewsCase,
    @Inject(VNewsModelTid) private model: Newable<typeof VNewsModel>,
  ) {}

  public init(props: IVNewsPresentProps) {
    this._case.init(props);
  }
}
