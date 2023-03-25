import { DisposableHolder, ILambda, lambdaResolve } from '@invest.wl/common';

import { IDInstrumentSearchRequestDTO, Inject, Injectable } from '@invest.wl/core';
import debounce from 'lodash/debounce';
import { action, computed, makeObservable, observable, reaction, runInAction } from 'mobx';
import { DInputStringModel } from '../../Input/model/D.InputString.model';
import { DInstrumentConfig, DInstrumentConfigTid } from '../D.Instrument.config';
import { DInstrumentGateway, DInstrumentGatewayTid } from '../D.Instrument.gateway';
import { DInstrumentStore, DInstrumentStoreTid } from '../D.Instrument.store';

export const DInstrumentSearchCaseTid = Symbol.for('DInstrumentSearchCaseTid');
type TListReq = IDInstrumentSearchRequestDTO;

export interface IDInstrumentSearchCaseProps {
}

@Injectable()
export class DInstrumentSearchCase {
  @observable.ref public props?: IDInstrumentSearchCaseProps;
  public _dH = new DisposableHolder();

  public text = new DInputStringModel();

  @computed
  public get searchRecentList() {
    return this._store.searchRecentList;
  }

  public searchListX = this._gw.search({
    name: 'DInstrumentSearchCase.SearchListX', req: () => lambdaResolve(this._listReq),
  });

  @observable.ref private _listReq?: ILambda<TListReq | undefined>;

  constructor(
    @Inject(DInstrumentGatewayTid) private _gw: DInstrumentGateway,
    @Inject(DInstrumentStoreTid) private _store: DInstrumentStore,
    @Inject(DInstrumentConfigTid) private _const: DInstrumentConfig,
  ) {
    this.search = debounce(this.search, this._const.searchInputDelay);
    makeObservable(this);
  }

  @action
  public init(props: IDInstrumentSearchCaseProps) {
    this.props = props;
    this._dH.push(reaction(() => this.text.value, this.search));
  }

  public dispose() {
    this._dH.dispose();
  }

  @action.bound
  public search(text?: string) {
    text = text?.trim() || '';
    if (text.length < this._const.searchTextMinLength) {
      if (this.searchListX.source.isLoaded) this.searchListX.source.clear();
      return;
    }

    this._store.searchRecentAdd(text).then();
    runInAction(() => (this._listReq = { text: text! }));
  }
}
