import { MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DInvestIdeaCase, DInvestIdeaCaseTid, IDInvestIdeaCaseProps } from '@invest.wl/domain';
import { VInvestIdeaModel, VInvestIdeaModelTid } from '../model/V.InvestIdea.model';

export const VInvestIdeaPresentTid = Symbol.for('VInvestIdeaPresentTid');

export interface IVInvestIdeaPresentProps extends IDInvestIdeaCaseProps {
}

@Injectable()
export class VInvestIdeaPresent {
  public infoX = new MapX.V(this._case.infoX.source, () => this._case.infoX.model,
    (m) => new this.model(m));

  constructor(
    @Inject(DInvestIdeaCaseTid) private _case: DInvestIdeaCase,
    @Inject(VInvestIdeaModelTid) private model: Newable<typeof VInvestIdeaModel>,
  ) { }

  public init(props: IVInvestIdeaPresentProps) {
    this._case.init(props);
  }
}
