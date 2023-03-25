import { Inject, Injectable, TModelId } from '@invest.wl/core';
import { action, makeObservable, observable } from 'mobx';
import { DNewsGateway, DNewsGatewayTid } from '../D.News.gateway';

export const DNewsCaseTid = Symbol.for('DNewsCaseTid');

export interface IDNewsCaseProps {
  id: TModelId;
}

@Injectable()
export class DNewsCase {
  @observable.ref public props?: IDNewsCaseProps;

  public infoX = this._gw.Info({
    name: 'DNewsCase.InfoX', req: () => this.props,
  });

  constructor(
    @Inject(DNewsGatewayTid) private _gw: DNewsGateway,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDNewsCaseProps) {
    this.props = props;
  }
}
