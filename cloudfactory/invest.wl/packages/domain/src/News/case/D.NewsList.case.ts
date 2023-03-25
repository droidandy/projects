import { ILambda, lambdaResolve } from '@invest.wl/common';
import { IDNewsListRequestDTO, Inject, Injectable } from '@invest.wl/core';
import { action, makeObservable, observable } from 'mobx';
import { DNewsGateway, DNewsGatewayTid } from '../D.News.gateway';

export const DNewsListCaseTid = Symbol.for('DNewsListCaseTid');
type TListReq = Omit<IDNewsListRequestDTO, 'offset' | 'pageSize'>;

export interface IDNewsListCaseProps extends TListReq {
  pageSize?: number;
}

@Injectable()
export class DNewsListCase {
  @observable.ref public props?: IDNewsListCaseProps;

  public listX = this._gw.list({
    name: 'DNewsListCase.ListX',
    req: () => this.props ? ({ ...this.props, ...lambdaResolve(this._requestLv) }) : undefined,
    pageSizeKey: 'pageSize', offsetKey: 'offset', getArray: res => res.data,
  });

  @observable.ref private _requestLv: ILambda<TListReq | undefined>;

  constructor(
    @Inject(DNewsGatewayTid) private _gw: DNewsGateway,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDNewsListCaseProps) {
    this.props = props;
  }

  @action
  public requestSet(req: ILambda<TListReq>) {
    this._requestLv = req;
  }
}
