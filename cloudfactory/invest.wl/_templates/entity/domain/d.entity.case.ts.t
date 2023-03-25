---
to: src/domain/<%= Name %>/case/D.<%= Name %>.case.ts
---
import { action, observable } from 'mobx';

import { Inject, Injectable } from '../../../common/IoC';
import { TDomainId } from '../../Domain.types';
import { D<%= Name %>Gateway, D<%= Name %>GatewayTid } from '../D.<%= Name %>.gateway';
import { D<%= Name %>Store, D<%= Name %>StoreTid } from '../D.<%= Name %>.store';

export const D<%= Name %>CaseTid = Symbol.for('D<%= Name %>CaseTid');

export interface ID<%= Name %>CaseProps {
  id: TDomainId;
}

@Injectable()
export class D<%= Name %>Case {
  @observable.ref public props?: ID<%= Name %>CaseProps;

  constructor(
    @Inject(D<%= Name %>GatewayTid) private _gw: D<%= Name %>Gateway,
    @Inject(D<%= Name %>StoreTid) private _store: D<%= Name %>Store,
  ) {}

  @action
  public init(props: ID<%= Name %>CaseProps) {
    this.props = props
  }
}
