import { Inject, Injectable, Newable } from '@invest.wl/core';

import { action, observable } from 'mobx';
import { DAddressGateway, DAddressGatewayTid } from '../D.Address.gateway';
import { DAddressSearchModel, DAddressSearchModelTid } from '../model/D.AddressSearch.model';

export const DAddressSearchCaseTid = Symbol.for('DAddressSearchCaseTid');

export interface IDAddressSearchCaseProps {
}

@Injectable()
export class DAddressSearchCase {
  @observable.ref public props?: IDAddressSearchCaseProps;
  public searchModel = new this._searchModel();

  public listX = this._gw.search({
    name: 'DAddressSearchCase.listX',
    req: () => {
      const text = this.searchModel.fields.text.value || '';
      return text.length >= 3 ? { text } : undefined;
    },
  });

  constructor(
    @Inject(DAddressSearchModelTid) private _searchModel: Newable<typeof DAddressSearchModel>,
    @Inject(DAddressGatewayTid) private _gw: DAddressGateway,
  ) { }

  @action
  public init(props: IDAddressSearchCaseProps) {
    this.props = props;
  }
}
