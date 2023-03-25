import {
  DFilterX,
  DFilterXArrayModel,
  DFilterXComposeDateModel,
  DFilterXDateModel,
  DFilterXNumberModel,
  DFilterXStringModel,
  ILambda,
  LambdaX,
  MapX,
} from '@invest.wl/common';

import { EDCurrencyCode, EDOrderStatus, EDTradeDirection, IDOrderItemDTO, IDOrderListRequestDTO, Inject, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';
import { DAccountStore, DAccountStoreTid } from '../../Account/D.Account.store';
import { DOrderGateway, DOrderGatewayTid } from '../D.Order.gateway';

export const DOrderListCaseTid = Symbol.for('DOrderListCaseTid');
type TListReq = Omit<IDOrderListRequestDTO, 'offset' | 'pageSize' | 'agreementIdList'>;

export interface IDOrderListCaseProps extends Omit<TListReq, 'currencyName'> {
  pageSize?: number;
}

type IDOrderListFilter = Pick<IDOrderItemDTO, 'Date' | 'BS' | 'Status'>
& { InstrumentName: IDOrderItemDTO['Instrument']['Name']; AccountId: IDOrderItemDTO['Account']['id'] };

@Injectable()
export class DOrderListCase {
  @observable.ref public props?: IDOrderListCaseProps;

  // TODO: text must be in view layer
  public filterX = new DFilterX<IDOrderListFilter>({
    Date: { input: true },
    InstrumentName: { input: true },
    AccountId: {
      list: () => this.accountList.map(a => ({ name: a.dto.Name, value: a.dto.id })),
    },
    Status: {
      list: [
        { name: 'Исполненные', value: [EDOrderStatus.Reduced] },
        { name: 'Активные', value: [EDOrderStatus.ReducedPartial, EDOrderStatus.New, EDOrderStatus.NotSent] },
        { name: 'Отмененные', value: [EDOrderStatus.Deleted, EDOrderStatus.Deleting, EDOrderStatus.Error] },
      ],
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
    .add('AccountId', new DFilterXStringModel(undefined, 'equal'))
    .add('Status', new DFilterXArrayModel<number>(undefined, 'include'))
    .add('BS', new DFilterXNumberModel(undefined, '=='));

  public _listX = this._gw.list({
    name: 'DOrderListCase.ListX', req: () => this.props ? ({
      agreementIdList: ['-1'], ...this.props, ...LambdaX.resolve(this._requestLv),
    }) : undefined, pageSizeKey: 'pageSize', offsetKey: 'offset', getArray: res => res.data,
  });

  public listX = new MapX.DProxyList(
    () => {
      const model = this.filterX;
      return !model.isEmpty ? this._listX.list.filter(o => model.filterFn({
        BS: o.dto.BS, InstrumentName: o.dto.Instrument.Name, Date: o.dto.Date, AccountId: o.dto.Account.id,
        Status: o.dto.Status,
      }),
      ) : this._listX.list;
    },
    this._listX.source,
  );

  @computed
  public get accountList() {
    return this._accountStore.listX.list;
  }

  @observable.ref private _requestLv: ILambda<TListReq> = {
    currencyName: EDCurrencyCode.RUR,
  };

  constructor(
    @Inject(DOrderGatewayTid) private _gw: DOrderGateway,
    @Inject(DAccountStoreTid) private _accountStore: DAccountStore,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDOrderListCaseProps) {
    this.props = props;
  }

  @action
  public requestSet(req: ILambda<TListReq>) {
    this._requestLv = req;
  }
}
