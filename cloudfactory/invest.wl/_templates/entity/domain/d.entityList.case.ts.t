---
to: src/domain/<%= Name %>/case/D.<%= Name %>List.case.ts
---
import { action, observable } from 'mobx';

import { Inject, Injectable } from '../../../common/IoC';
import { D<%= Name %>Gateway, D<%= Name %>GatewayTid } from '../D.<%= Name %>.gateway';
import { D<%= Name %>Store, D<%= Name %>StoreTid } from '../D.<%= Name %>.store';

export const D<%= Name %>ListCaseTid = Symbol.for('D<%= Name %>ListCaseTid');

export interface ID<%= Name %>ListCaseProps { }

@Injectable()
export class D<%= Name %>ListCase {
  @observable.ref public props?: ID<%= Name %>ListCaseProps;

  constructor(
    @Inject(D<%= Name %>GatewayTid) private _gw: D<%= Name %>Gateway,
    @Inject(D<%= Name %>StoreTid) private _store: D<%= Name %>Store,
  ) {}

  @action
  public init(props: ID<%= Name %>ListCaseProps) {
    this.props = props
  }
}
