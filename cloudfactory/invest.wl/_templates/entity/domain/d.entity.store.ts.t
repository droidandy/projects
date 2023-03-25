---
to: src/domain/<%= Name %>/D.<%= Name %>.store.ts
---
import { Inject, Injectable } from '../../common/IoC';
import { D<%= Name %>GatewayTid, D<%= Name %>Gateway } from './D.<%= Name %>.gateway';

export const D<%= Name %>StoreTid = Symbol.for('D<%= Name %>Store')

@Injectable()
export class D<%= Name %>Store {
  constructor(
    @Inject(D<%= Name %>GatewayTid) private _gateway: D<%= Name %>Gateway
  ) {}
}
