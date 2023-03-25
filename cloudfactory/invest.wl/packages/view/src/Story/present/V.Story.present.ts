import { MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DStoryCase, DStoryCaseTid, IDStoryCaseProps } from '@invest.wl/domain';
import { VStoryModel, VStoryModelTid } from '../model/V.Story.model';

export const VStoryPresentTid = Symbol.for('VStoryPresentTid');

export interface IVStoryPresentProps extends IDStoryCaseProps {
}

@Injectable()
export class VStoryPresent {
  public infoX = new MapX.V(this._case.infoX.source,
    () => this._case.infoX.model, (m) => new this.model(m));

  constructor(
    @Inject(DStoryCaseTid) private _case: DStoryCase,
    @Inject(VStoryModelTid) private model: Newable<typeof VStoryModel>,
  ) {}

  public init(props: IVStoryPresentProps) {
    this._case.init(props);
  }
}
