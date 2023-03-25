---
to: src/domain/<%= Name %>/D.<%= Name %>.service.ts
---
import { Inject, Injectable } from '../../common/IoC';
import { D<%= Name %>Store, D<%= Name %>StoreTid } from './D.<%= Name %>.store';
import { D<%= Name %>Gateway, D<%= Name %>GatewayTid } from './D.<%= Name %>.gateway';

export const D<%= Name %>ServiceTid = Symbol.for('D<%= Name %>ServiceTid');

@Injectable()
export class D<%= Name %>Service {
  constructor(
    @Inject(D<%= Name %>StoreTid) private _store: D<%= Name %>Store,
    @Inject(D<%= Name %>GatewayTid) private _gateway: D<%= Name %>Gateway,
  ) {}
}
