import { MapX, VSortX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DInvestIdeaListCase, DInvestIdeaListCaseTid, IDInvestIdeaListCaseProps } from '@invest.wl/domain';
import { VInvestIdeaItemModel, VInvestIdeaItemModelTid } from '../model/V.InvestIdeaItem.model';

export const VInvestIdeaListPresentTid = Symbol.for('VInvestIdeaListPresentTid');

export interface IVInvestIdeaListPresentProps extends IDInvestIdeaListCaseProps {
}

@Injectable()
export class VInvestIdeaListPresent {
  public ideaListX = new MapX.VList(this._case.listX.source,
    () => this._case.listX.list, (m) => new this.modelItem(m));

  public sortX = new VSortX(this._case.sortX, {
    Date: { title: 'По дате публикации' },
    Profit: { title: 'По доходности' },
  }, { applyOnChange: false });

  constructor(
    @Inject(DInvestIdeaListCaseTid) private _case: DInvestIdeaListCase,
    @Inject(VInvestIdeaItemModelTid) private modelItem: Newable<typeof VInvestIdeaItemModel>,
  ) {}

  public init(props: IVInvestIdeaListPresentProps) {
    this._case.init(props);
  }

  public dispose() {
    this._case.dispose();
  }
}
