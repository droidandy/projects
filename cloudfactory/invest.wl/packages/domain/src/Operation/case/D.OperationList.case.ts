import { ILambda, lambdaResolve } from '@invest.wl/common';

import { IDOperationListRequestDTO, Inject, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';
import { DAccountStore, DAccountStoreTid } from '../../Account/D.Account.store';
import { DOperationGateway, DOperationGatewayTid } from '../D.Operation.gateway';

export const DOperationListCaseTid = Symbol.for('DOperationListCaseTid');
type TListReq = Omit<IDOperationListRequestDTO, 'offset' | 'pageSize'>;

export interface IDOperationListCaseProps extends TListReq {
  pageSize?: number;
}

@Injectable()
export class DOperationListCase {
  @observable.ref public props?: IDOperationListCaseProps;

  public listX = this._gw.list({
    name: 'DOperationListCase.ListX',
    req: () => this.props ? ({ ...this.props, ...lambdaResolve(this._requestLv) }) : undefined,
    pageSizeKey: 'pageSize', offsetKey: 'offset', getArray: res => res.data,
  });

  @computed
  public get accountListX() {
    return this._accountStore.listX;
  }

  @observable.ref private _requestLv: ILambda<TListReq | undefined>;

  constructor(
    @Inject(DOperationGatewayTid) private _gw: DOperationGateway,
    @Inject(DAccountStoreTid) private _accountStore: DAccountStore,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDOperationListCaseProps) {
    this.props = props;
  }

  @action
  public requestSet(req: ILambda<TListReq>) {
    this._requestLv = req;
  }
}
