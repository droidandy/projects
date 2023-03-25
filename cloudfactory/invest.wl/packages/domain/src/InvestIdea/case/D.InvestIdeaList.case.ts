import { DSortX, EDSortXType, ILambda, lambdaResolve } from '@invest.wl/common';
import { IDInvestIdeaListRequestDTO, IDInvestIdeaListSort, Inject, Injectable } from '@invest.wl/core';
import { action, makeObservable, observable } from 'mobx';
import { DInvestIdeaGateway, DInvestIdeaGatewayTid } from '../D.InvestIdea.gateway';

export const DInvestIdeaListCaseTid = Symbol.for('DInvestIdeaListCaseTid');

type TListReq = Omit<IDInvestIdeaListRequestDTO, 'offset' | 'pageSize'>;

export interface IDInvestIdeaListCaseProps extends TListReq {
  pageSize?: number;
}

@Injectable()
export class DInvestIdeaListCase {
  @observable.ref public props?: IDInvestIdeaListCaseProps;

  public listX = this._gw.list({
    name: 'DInvestIdeaListCase.listX',
    req: () => this.props ? ({
      pageSize: 10, order: this.sortX.resultSingle, ...this.props, ...lambdaResolve(this._requestLv),
    }) : undefined,
    pageSizeKey: 'pageSize', offsetKey: 'offset', getArray: res => res.data,
  });

  public sortX = new DSortX<IDInvestIdeaListSort>({
    Date: { type: EDSortXType.Date },
    Profit: { type: EDSortXType.Number },
  }, { single: true });

  @observable private _requestLv: ILambda<TListReq | undefined>;

  constructor(
    @Inject(DInvestIdeaGatewayTid) private _gw: DInvestIdeaGateway,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDInvestIdeaListCaseProps) {
    this.props = props;
  }

  public dispose() {
    this.sortX.dispose();
  }

  @action
  public requestSet(req: ILambda<TListReq>) {
    this._requestLv = req;
  }
}
