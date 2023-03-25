import { Inject, Injectable, TModelId } from '@invest.wl/core';
import { action, makeObservable, observable } from 'mobx';
import { DInvestIdeaGateway, DInvestIdeaGatewayTid } from '../D.InvestIdea.gateway';

export const DInvestIdeaCaseTid = Symbol.for('DInvestIdeaCaseTid');

export interface IDInvestIdeaCaseProps {
  id: TModelId;
}

@Injectable()
export class DInvestIdeaCase {
  @observable.ref public props?: IDInvestIdeaCaseProps;

  public infoX = this._gw.info({
    name: 'DInvestIdeaCase.InfoX', req: () => this.props ? { id: this.props.id } : undefined,
  });

  constructor(
    @Inject(DInvestIdeaGatewayTid) private _gw: DInvestIdeaGateway,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDInvestIdeaCaseProps) {
    this.props = props;
  }
}
