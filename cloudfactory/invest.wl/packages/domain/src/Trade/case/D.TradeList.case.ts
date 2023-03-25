import {
  DFilterX,
  DFilterXComposeDateModel,
  DFilterXDateModel,
  DFilterXNumberModel,
  DFilterXStringModel,
  ILambda,
  lambdaResolve,
  MapX,
} from '@invest.wl/common';

import { EDCurrencyCode, EDTradeDirection, IDTradeItemDTO, IDTradeListRequestDTO, Inject, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';
import { DAccountStore, DAccountStoreTid } from '../../Account/D.Account.store';
import { DTradeGateway, DTradeGatewayTid } from '../D.Trade.gateway';

export const DTradeListCaseTid = Symbol.for('DTradeListCaseTid');
type TListReq = Omit<IDTradeListRequestDTO, 'offset' | 'pageSize' | 'agreementIdList'>;

export interface IDTradeListCaseProps extends Omit<TListReq, 'currencyName'> {
  pageSize?: number;
}

type IDTradeListFilter = Pick<IDTradeItemDTO, 'Date' | 'BS'>
& { InstrumentName: IDTradeItemDTO['Instrument']['Name']; AccountName: IDTradeItemDTO['Account']['name'] };

@Injectable()
export class DTradeListCase {
  @observable.ref public props?: IDTradeListCaseProps;

  // TODO: text must be in view layer
  public filterX = new DFilterX<IDTradeListFilter>({
    Date: { input: true },
    InstrumentName: { input: true },
    AccountName: {
      list: () => this.accountList.map(a => ({ name: a.dto.Name, value: a.dto.Name })),
    },
    BS: {
      list: [
        { name: 'Продажа', value: EDTradeDirection.Sell },
        { name: 'Покупка', value: EDTradeDirection.Buy },
      ],
    },
  })
    .add('Date', new DFilterXComposeDateModel([new DFilterXDateModel(undefined, '>='), new DFilterXDateModel(undefined, '<=')]))
    .add('InstrumentName', new DFilterXStringModel(undefined, 'include'))
    .add('AccountName', new DFilterXStringModel(undefined, 'equal'))
    .add('BS', new DFilterXNumberModel(undefined, '=='));

  public _listX = this._gw.list({
    name: 'DTradeListCase.ListX', req: () => this.props ? ({
      agreementIdList: ['-1'], ...this.props, ...lambdaResolve(this._requestLv),
    }) : undefined, pageSizeKey: 'pageSize', offsetKey: 'offset', getArray: res => res.data,
  });

  public listX = new MapX.DProxyList(
    () => {
      const model = this.filterX;
      return !model.isEmpty ? this._listX.list.filter(o => model.filterFn({
        Date: o.dto.Date, BS: o.dto.BS, InstrumentName: o.dto.Instrument.Name, AccountName: o.dto.Account.name,
      })) : this._listX.list;
    },
    this._listX.source,
  );

  @computed
  public get accountListX() {
    return this._accountStore.listX;
  }

  @observable.ref private _requestLv: ILambda<TListReq> = {
    currencyName: EDCurrencyCode.RUR,
  };

  constructor(
    @Inject(DTradeGatewayTid) private _gw: DTradeGateway,
    @Inject(DAccountStoreTid) private _accountStore: DAccountStore,
  ) {
    makeObservable(this);
  }

  @computed
  public get accountList() {
    return this._accountStore.listX.list;
  }

  @action
  public init(props: IDTradeListCaseProps) {
    this.props = props;
  }

  @action
  public requestSet(req: ILambda<TListReq>) {
    this._requestLv = req;
  }
}
