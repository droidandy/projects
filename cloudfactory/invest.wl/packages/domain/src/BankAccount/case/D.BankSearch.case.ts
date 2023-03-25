import { Inject, Injectable, Newable } from '@invest.wl/core';

import { action, observable } from 'mobx';
import { DBankAccountGateway, DBankAccountGatewayTid } from '../D.BankAccount.gateway';
import { DBankSearchModel, DBankSearchModelTid } from '../model/D.BankSearch.model';

export const DBankSearchCaseTid = Symbol.for('DBankSearchCaseTid');

export interface IDBankSearchCaseProps {
}

@Injectable()
export class DBankSearchCase {
  @observable.ref public props?: IDBankSearchCaseProps;
  public searchModel = new this._searchModel();

  public listX = this._gw.search({
    name: 'DBankSearchCase.listX',
    req: () => {
      const text = this.searchModel.fields.text.value || '';
      return text.length >= 3 ? { text } : undefined;
    },
  });

  constructor(
    @Inject(DBankSearchModelTid) private _searchModel: Newable<typeof DBankSearchModel>,
    @Inject(DBankAccountGatewayTid) private _gw: DBankAccountGateway,
  ) { }

  @action
  public init(props: IDBankSearchCaseProps) {
    this.props = props;
  }
}
