import { MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DAddressSearchCase, DAddressSearchCaseTid, IDAddressSearchCaseProps } from '@invest.wl/domain';
import { VAddressModel, VAddressModelTid } from '../model/V.Address.model';

import { VAddressSearchModel, VAddressSearchModelTid } from '../model/V.AddressSearch.model';

export const VAddressSearchPresentTid = Symbol.for('VAddressSearchPresentTid');

export interface IVAddressSearchPresentProps extends IDAddressSearchCaseProps {
}

@Injectable()
export class VAddressSearchPresent {
  public searchModel = new this._searchModel(this.cse.searchModel);

  public listX = new MapX.VList(this.cse.listX.source,
    () => this.cse.listX.list, v => new this._model(v));

  constructor(
    @Inject(DAddressSearchCaseTid) public cse: DAddressSearchCase,
    @Inject(VAddressModelTid) private _model: Newable<typeof VAddressModel>,
    @Inject(VAddressSearchModelTid) private _searchModel: Newable<typeof VAddressSearchModel>,
  ) {}

  public init(props: IVAddressSearchPresentProps) {
    this.cse.init(props);
  }
}
