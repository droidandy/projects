import { MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DInstrumentCase, DInstrumentCaseTid, IDAccountListCaseProps, IDInstrumentCaseProps } from '@invest.wl/domain';
import { action, makeObservable, observable } from 'mobx';
import { VInstrumentSummaryModel, VInstrumentSummaryModelTid } from '../model/V.InstrumentSummary.model';
import { VInstrumentFavoritePresent, VInstrumentFavoritePresentTid } from './V.InstrumentFavorite.present';

export const VInstrumentPresentTid = Symbol.for('VInstrumentPresentTid');

export interface IVInstrumentPresentProps extends IDInstrumentCaseProps, IDAccountListCaseProps {
}

@Injectable()
export class VInstrumentPresent {
  @observable public props?: IVInstrumentPresentProps;

  public summaryX = new MapX.V(
    this.cse.summaryX.source,
    () => this.cse.summaryX.model,
    (m) => new this.modelSummary(m));

  constructor(
    @Inject(DInstrumentCaseTid) public cse: DInstrumentCase,
    @Inject(VInstrumentFavoritePresentTid) public favoritePr: VInstrumentFavoritePresent,
    @Inject(VInstrumentSummaryModelTid) protected modelSummary: Newable<typeof VInstrumentSummaryModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVInstrumentPresentProps) {
    this.props = props;
    this.cse.init(props);
    this.favoritePr.init({ model: () => this.summaryX.model?.domain, cid: props.cid });
  }
}
