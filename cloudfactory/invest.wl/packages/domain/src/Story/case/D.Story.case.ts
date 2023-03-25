import { Inject, Injectable, TModelId } from '@invest.wl/core';
import { action, makeObservable, observable } from 'mobx';
import { DStoryGateway, DStoryGatewayTid } from '../D.Story.gateway';

export const DStoryCaseTid = Symbol.for('DStoryCaseTid');

export interface IDStoryCaseProps {
  id: TModelId;
}

@Injectable()
export class DStoryCase {
  @observable.ref public props?: IDStoryCaseProps;

  public infoX = this._gw.info({
    name: 'DStoryCase.infoX', req: () => this.props,
  });

  constructor(
    @Inject(DStoryGatewayTid) private _gw: DStoryGateway,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDStoryCaseProps) {
    this.props = props;
  }
}
