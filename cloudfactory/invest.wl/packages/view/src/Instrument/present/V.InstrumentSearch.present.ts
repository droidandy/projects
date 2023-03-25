import { MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DInstrumentSearchCase, DInstrumentSearchCaseTid, IDInstrumentSearchCaseProps } from '@invest.wl/domain';
import { action, makeObservable, observable } from 'mobx';
import { VInputStringModel } from '../../Input/model/V.InputString.model';
import { VInstrumentSearchModel, VInstrumentSearchModelTid } from '../model/V.InstrumentSearch.model';

export const VInstrumentSearchPresentTid = Symbol.for('VInstrumentSearchPresentTid');

export interface IVInstrumentSearchPresentProps extends IDInstrumentSearchCaseProps {
}

@Injectable()
export class VInstrumentSearchPresent {
  @observable public props?: IVInstrumentSearchPresentProps;

  public text = new VInputStringModel(this.cse.text);

  public searchListX = new MapX.VList(
    this.cse.searchListX.source,
    () => this.cse.searchListX.list,
    v => new this.modelSearch(v),
  );

  constructor(
    @Inject(DInstrumentSearchCaseTid) public cse: DInstrumentSearchCase,
    @Inject(VInstrumentSearchModelTid) private modelSearch: Newable<typeof VInstrumentSearchModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVInstrumentSearchPresentProps) {
    this.props = props;
    this.cse.init(props);
  }
}
