import { MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DBankSearchCase, DBankSearchCaseTid, IDBankSearchCaseProps } from '@invest.wl/domain';
import { VBankModel, VBankModelTid } from '../model/V.Bank.model';
import { VBankSearchModel, VBankSearchModelTid } from '../model/V.BankSearch.model';

export const VBankSearchPresentTid = Symbol.for('VBankSearchPresentTid');

export interface IVBankSearchPresentProps extends IDBankSearchCaseProps {
}

@Injectable()
export class VBankSearchPresent {
  public searchModel = new this._searchModel(this.cse.searchModel);

  public listX = new MapX.VList(this.cse.listX.source,
    () => this.cse.listX.list, v => new this._model(v));

  constructor(
    @Inject(DBankSearchCaseTid) public cse: DBankSearchCase,
    @Inject(VBankModelTid) private _model: Newable<typeof VBankModel>,
    @Inject(VBankSearchModelTid) private _searchModel: Newable<typeof VBankSearchModel>,
  ) {}

  public init(props: IVBankSearchPresentProps) {
    this.cse.init(props);
  }
}
